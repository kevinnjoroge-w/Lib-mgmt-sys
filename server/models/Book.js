const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, required: true, unique: true },
    genre: { type: String },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    status: { type: String, enum: ['Available', 'Borrowed', 'Reserved'], default: 'Available' },
    isEbook: { type: Boolean, default: false },
    sampleUrl: { type: String },
    fileUrl: { type: String },
    price: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
