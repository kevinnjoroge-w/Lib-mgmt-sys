require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

async function testRegister() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const name = "Test User";
        const email = "test" + Date.now() + "@example.com";
        const password = "password123";
        const role = "Student";

        console.log('Creating user...');
        const user = new User({ name, email, password, role });
        await user.save();
        console.log('User saved.');

        console.log('Signing JWT...');
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('JWT signed:', token);

        process.exit(0);
    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    }
}

testRegister();
