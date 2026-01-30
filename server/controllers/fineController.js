const Fine = require('../models/Fine');

exports.getFines = async (req, res) => {
    try {
        const query = req.user.role === 'Student' ? { user_id: req.user.id } : {};
        const fines = await Fine.find(query).populate('user_id', 'name email').populate('borrow_id');
        res.json(fines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.payFine = async (req, res) => {
    try {
        const fine = await Fine.findById(req.params.id);
        if (!fine) return res.status(404).json({ message: 'Fine not found' });

        fine.paid_status = 'Paid';
        await fine.save();
        res.json(fine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
