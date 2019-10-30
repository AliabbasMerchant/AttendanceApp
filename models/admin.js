const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('attendance_admin', adminSchema);
