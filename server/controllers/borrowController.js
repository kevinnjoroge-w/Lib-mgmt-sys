const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const Fine = require('../models/Fine');

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
        book.status = 'Available';

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
