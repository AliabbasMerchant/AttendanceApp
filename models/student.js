const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name: { type: String, required: true },
    batch: { type: String, required: true },
    created: { type: Date, required: true },
    deleted: { type: Date },
    attendance: [{
        date: { type: Date, required: true }, // Added only if (s)he is present
    }],
});

module.exports = mongoose.model('attendance_student', studentSchema);
