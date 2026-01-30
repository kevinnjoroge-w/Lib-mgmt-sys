const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrow_date: { type: Date, default: Date.now },
    due_date: { type: Date, required: true },
    return_date: { type: Date },
    status: { type: String, enum: ['Active', 'Returned', 'Overdue'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
