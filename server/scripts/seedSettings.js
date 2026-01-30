require('dotenv').config();
const mongoose = require('mongoose');
const Setting = require('../models/Setting');

async function seedSettings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const fineRate = await Setting.findOne({ key: 'fine_rate_per_day' });
        if (!fineRate) {
            await Setting.create({
                key: 'fine_rate_per_day',
                value: 10,
                description: 'Fine amount charged per day for overdue books'
            });
            console.log('Default fine rate seeded');
        } else {
            console.log('Fine rate already exists');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedSettings();
