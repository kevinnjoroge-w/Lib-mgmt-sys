const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    status: { type: String, enum: ['Waiting', 'Notified', 'Fulfilled', 'Cancelled'], default: 'Waiting' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
