const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const User = require('../models/User');
const Fine = require('../models/Fine');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const totalUsers = await User.countDocuments();
        const activeBorrows = await BorrowRecord.countDocuments({ status: 'Active' });
        const totalFines = await Fine.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);

        res.json({
            totalBooks,
            totalUsers,
            activeBorrows,
            totalFines: totalFines[0] ? totalFines[0].total : 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMostBorrowedBooks = async (req, res) => {
    try {
        const reports = await BorrowRecord.aggregate([
            { $group: { _id: "$book_id", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            { $unwind: "$bookDetails" }
        ]);
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
