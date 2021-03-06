const mongoose = require('mongoose');

// List of dates on which the batch was working (i.e., the attendace was taken)
// Other dates are considered as holidays
const dateSchema = mongoose.Schema({
    date: { type: Date, required: true },
    batch: { type: String, required: true },
    adminName: { type: String, required: true }, // The admin who took the attendance
});

module.exports = mongoose.model('attendance_date', dateSchema);
