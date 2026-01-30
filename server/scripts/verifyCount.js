require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');

async function verifyCount() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Book.countDocuments();
        console.log(`Total books in database: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifyCount();
