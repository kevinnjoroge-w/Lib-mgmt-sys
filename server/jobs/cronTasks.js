const cron = require('node-cron');
const BorrowRecord = require('../models/BorrowRecord');
const Fine = require('../models/Fine');
const User = require('../models/User');
const Setting = require('../models/Setting');
const Book = require('../models/Book');
const Notification = require('../models/Notification');
const { sendMail } = require('../config/mailer');
const { getIo } = require('../utils/socket');

async function processDailyFinesAndAlerts() {
    console.log("Running daily fine calculations and alerts...");
    try {
        const rateSetting = await Setting.findOne({ key: 'fine_rate_per_day' });
        const dailyRate = rateSetting ? Number(rateSetting.value) : 10;
        
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const activeRecords = await BorrowRecord.find({ status: 'Active' })
            .populate('user_id')
            .populate('book_id');
            
        for (const record of activeRecords) {
            const dueDate = new Date(record.due_date);
            const user = record.user_id;
            const book = record.book_id;
            
            // 1. Calculate and Update Fines if overdue
            if (now > dueDate) {
                const diffTime = Math.abs(now - dueDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const fineAmount = diffDays * dailyRate;
                
                let fine = await Fine.findOne({ borrow_id: record._id });
                let isNewFine = false;
                
                if (!fine) {
                    fine = new Fine({
                        borrow_id: record._id,
                        user_id: user._id,
                        amount: fineAmount
                    });
                    isNewFine = true;
                } else if (fine.amount !== fineAmount && fine.paid_status === 'Unpaid') {
                    fine.amount = fineAmount;
                }
                await fine.save();
                
                // Emitting Fine Notification
                if (isNewFine || fineAmount % (dailyRate * 3) === 0) { // e.g., alert initially and every 3 days
                     const msg = `You have an outstanding fine of Ksh ${fineAmount} for the overdue book "${book.title}".`;
                     const notif = new Notification({ user_id: user._id, message: msg, type: 'FINE' });
                     await notif.save();
                     
                     try {
                         const io = getIo();
                         io.to(user._id.toString()).emit('receive_notification', notif);
                     } catch(err) {} 
                     
                     if (user.email) {
                         sendMail(user.email, "Library Fine Alert", `<p>${msg}</p>`);
                     }
                }
            } 
            // 2. Due Date Warnings (e.g. Due tomorrow)
            else {
                const diffTime = dueDate - now;
                const diffDaysToDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDaysToDue === 1) { // Due tomorrow
                    const msg = `Reminder: The book "${book.title}" is due tomorrow. Please return it to avoid fines.`;
                    
                    // Prevent spamming same notification
                    const existingWarn = await Notification.findOne({
                        user_id: user._id,
                        type: 'DUE_DATE',
                        createdAt: { $gte: startOfToday }
                    });
                    
                    if (!existingWarn) {
                        const notif = new Notification({ user_id: user._id, message: msg, type: 'DUE_DATE' });
                        await notif.save();
                        try {
                            const io = getIo();
                            io.to(user._id.toString()).emit('receive_notification', notif);
                        } catch(err) {}
                        
                        if (user.email) {
                            sendMail(user.email, "Book Due Tomorrow", `<p>${msg}</p>`);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error in cron task:", error);
    }
}

function start() {
    // Run at midnight every day
    cron.schedule('0 0 * * *', processDailyFinesAndAlerts);
    console.log("Cron jobs scheduled.");
}

module.exports = { start, processDailyFinesAndAlerts };
