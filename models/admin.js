const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model("attendance_admin", adminSchema);
