const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const Fine = require('../models/Fine');
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');
const { getIo } = require('../utils/socket');
const { sendMail } = require('../config/mailer');

exports.borrowBook = async (req, res) => {
    try {
        const { book_id, days } = req.body;
        const book = await Book.findById(book_id);
        if (!book || book.status !== 'Available') {
            return res.status(400).json({ message: 'Book not available' });
        }

        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + Number(days || 14));

        const record = new BorrowRecord({
            user_id: req.user.id,
            book_id,
            borrow_date: borrowDate,
            due_date: dueDate
        });

        book.status = 'Borrowed';
        await book.save();
        await record.save();

        // Send notification for successful borrow
        const borrowMsg = `You have successfully borrowed the book "${book.title}". Due date: ${dueDate.toDateString()}.`;
        const borrowNotif = new Notification({ user_id: req.user.id, message: borrowMsg, type: 'INFO' });
        await borrowNotif.save();
        try {
            const io = getIo();
            io.to(req.user.id).emit('receive_notification', borrowNotif);
        } catch(e) {}

        res.status(201).json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const record = await BorrowRecord.findById(req.params.id);
        if (!record || record.status !== 'Active') {
            return res.status(400).json({ message: 'Invalid borrow record' });
        }

        record.return_date = new Date();
        record.status = 'Returned';

        const book = await Book.findById(record.book_id);
        
        // Handle Reservations
        const nextReservation = await Reservation.findOne({ book_id: book._id, status: 'Waiting' }).sort({ createdAt: 1 }).populate('user_id');
        if (nextReservation) {
            book.status = 'Reserved';
            nextReservation.status = 'Notified';
            await nextReservation.save();
            
            // Dispatch notification
            const msg = `The book "${book.title}" you reserved is now returned and held for you!`;
            const notif = new Notification({ user_id: nextReservation.user_id._id, message: msg, type: 'INFO' });
            await notif.save();
            try {
                const io = getIo();
                io.to(nextReservation.user_id._id.toString()).emit('receive_notification', notif);
            } catch(e) {}
            if (nextReservation.user_id.email) {
                sendMail(nextReservation.user_id.email, "Reserved Book Available", `<p>${msg}</p>`);
            }
        } else {
            book.status = 'Available';
        }


        // Fine calculation (dynamic rate from settings)
        if (record.return_date > record.due_date) {
            const Setting = require('../models/Setting');
            const fineRateSetting = await Setting.findOne({ key: 'fine_rate_per_day' });
            const rate = fineRateSetting ? Number(fineRateSetting.value) : 10;

            const diffTime = Math.abs(record.return_date - record.due_date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const fineAmount = diffDays * rate;

            const fine = new Fine({
                borrow_id: record._id,
                user_id: record.user_id,
                amount: fineAmount
            });
            await fine.save();
        }

        await book.save();
        await record.save();

        res.json({ message: 'Book returned successfully', record });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBorrowHistory = async (req, res) => {
    try {
        const query = req.user.role === 'Student' ? { user_id: req.user.id } : {};
        const records = await BorrowRecord.find(query).populate('book_id').populate('user_id', 'name email');
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.renewBook = async (req, res) => {
    try {
        const record = await BorrowRecord.findById(req.params.id);
        if (!record || record.status !== 'Active') {
            return res.status(400).json({ message: 'Invalid borrow record' });
        }

        const newDueDate = new Date(record.due_date);
        newDueDate.setDate(newDueDate.getDate() + 7);
        record.due_date = newDueDate;

        await record.save();
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.reserveBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.status === 'Available') return res.status(400).json({ message: 'Book is currently available. You can just borrow it.' });

        const existingReservation = await Reservation.findOne({ book_id: book._id, user_id: req.user.id, status: { $in: ['Waiting', 'Notified'] } });
        if (existingReservation) return res.status(400).json({ message: 'You have already reserved this book' });

        const reservation = new Reservation({
            user_id: req.user.id,
            book_id: book._id
        });
        await reservation.save();
        
        res.status(201).json({ message: 'Book reserved successfully', reservation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ book_id: req.params.id, status: 'Waiting' }).sort({ createdAt: 1 }).populate('user_id', 'name');
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserReservations = async (req, res) => {
    try {
        // Find ALL active reservations for this user
        const userReservations = await Reservation.find({ user_id: req.user.id, status: { $in: ['Waiting', 'Notified'] } })
            .populate('book_id', 'title author cover');
        
        // Let's also attach their current queue position logistically
        const enriched = await Promise.all(userReservations.map(async (reser) => {
            if (reser.status === 'Notified') return { ...reser.toObject(), queueIndex: 0 };
            
            // Count how many waiting reservations for the same book are older than this one
            const ahead = await Reservation.countDocuments({
                book_id: reser.book_id._id,
                status: 'Waiting',
                createdAt: { $lt: reser.createdAt }
            });
            return { ...reser.toObject(), queueIndex: ahead + 1 };
        }));

        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


