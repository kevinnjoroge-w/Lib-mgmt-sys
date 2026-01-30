require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

async function seedCategories() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');

        const count = await Category.countDocuments();
        if (count === 0) {
            const categories = [
                { name: 'Fiction' },
                { name: 'Non-Fiction' },
                { name: 'Science' },
                { name: 'History' },
                { name: 'Biography' },
                { name: 'Technology' },
                { name: 'Fantasy' },
                { name: 'Mystery' }
            ];
            await Category.insertMany(categories);
            console.log('Categories seeded');
        } else {
            console.log('Categories already exist');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedCategories();
