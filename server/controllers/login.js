const UserModel = require("../models/User");

const login = async (req, res) => {
    const { username, clockInTime, clockOutTime } = req.body;
    console.log(req.body);
  
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    if (!clockInTime && !clockOutTime) {
        return res.status(400).json({ message: 'Either clock in time or clock out time is required' });
    }

    try {
        const user = await UserModel.findOne({ username });
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure clockIn is an array
        if (clockInTime) {
            if (!Array.isArray(user.clockIn)) {
                user.clockIn = [];
            }
            
            user.clockIn.push(clockInTime);
        }

        // Ensure clockOut is an array
        if (clockOutTime) {
            if (!Array.isArray(user.clockOut)) {
                user.clockOut = [];
            }
            user.clockOut.push(clockOutTime);
        }

       const usersaved = await user.save();
        // console.log(usersaved);

        res.status(200).json({
            message: 'Operation successful',
            user: {
                username: user.username,
                clockInTime: user.clockIn,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { login };