const mongoose = require('mongoose');

const batchSchema = mongoose.Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('attendance_batch', batchSchema);
