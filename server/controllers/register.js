const User = require('../models/User');

const registerUser = async (req, res) => {
    const { username, role } = req.body;

    if (!username || !role) {
        return res.status(400).json({ message: 'Username and role are required' });
    }

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ username, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = registerUser;