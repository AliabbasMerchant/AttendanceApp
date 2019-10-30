const mongoose = require('mongoose');

// List of dates on which the batch was working (i.e., the attendace was taken)
// Other dates are considered as holidays
const dateSchema = mongoose.Schema({
    date: { type: Date, default: Date.now, required: true },
    batch: { type: String, default: 'default', required: true }, // The batch with which this date is concerned
    adminName: { type: String, required: true }, // The admin who took the attendance
});

module.exports = mongoose.model('attendance_date', dateSchema);
