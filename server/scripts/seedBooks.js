require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const Category = require('../models/Category');

const titles = [
    'The Great Adventure', 'Shadow of the Moon', 'Lost in Time', 'The Secret Key',
    'Midnight Echoes', 'The Silent Observer', 'Whispers in the Wind', 'Beyond the Horizon',
    'The Forgotten Realm', 'Crystals of Light', 'The Last Guardian', 'Echoes of the Past',
    'The Invisible City', 'Sands of Destiny', 'The Golden Compass', 'Wings of Fire',
    'The Silver Lining', 'Beneath the Waves', 'Starlight Journey', 'The Ancient Prophecy'
];

const authors = [
    'J.K. Rowling', 'George R.R. Martin', 'Stephen King', 'Agatha Christie',
    'Ernest Hemingway', 'Mark Twain', 'J.R.R. Tolkien', 'Jane Austen',
    'Leo Tolstoy', 'Charles Dickens', 'Gabriel Garcia Marquez', 'Haruki Murakami',
    'Paulo Coelho', 'Dan Brown', 'Rick Riordan', 'Neil Gaiman'
];

async function seedBooks() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');

        const categories = await Category.find();
        if (categories.length === 0) {
            console.error('No categories found. Run seedCategories.js first.');
            process.exit(1);
        }

        const books = [];
        for (let i = 1; i <= 200; i++) {
            const randomTitle = titles[Math.floor(Math.random() * titles.length)];
            const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];

            books.push({
                title: `${randomTitle} Vol. ${i}`,
                author: randomAuthor,
                ISBN: `978-${Math.floor(100000000 + Math.random() * 900000000)}-${i}`,
                category_id: randomCategory._id,
                status: 'Available'
            });
        }

        await Book.insertMany(books);
        console.log('200 books seeded successfully');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedBooks();
