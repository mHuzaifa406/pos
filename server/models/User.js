const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    // Roles: G, S, A, J (guest, salesperson, admin, etc.)
    role: { type: String, required: true },
    clockIn: [{ type: Date }],
    clockOut: [{ type: Date }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);