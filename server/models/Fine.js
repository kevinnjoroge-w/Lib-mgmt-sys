const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
    borrow_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowRecord', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paid_status: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Fine', fineSchema);
