const StudentModel = require('../models/student');
const DateModel = require('../models/date');
const BatchModel = require('../models/batch');

const constants = require('../config/constants');

let attendanceRoutes = {};

attendanceRoutes.attendanceGetRoute = (req, res) => {
    const batch = req.query.batch;
    const date = req.query.date;
    if (batch ^ date) { // only 1 is present
        req.flash('error_msgs', 'Please fill in all required fields');
    }
    if (!batch || !date) {
        BatchModel.find({}, 'name', { sort: { name: 1 } }, (err, batches) => {
            if (err) {
                console.log(err);
            }
            res.render('attendance/select_batch_date', {
                nextURL: '/attendance',
                batches,
            });
        });
        return;
    } else {
        StudentModel.find({ deleted: '', batch }, 'name', { sort: { name: 1, created: 1 } }, (err, students) => {
            if (err) {
                console.log(err);
            }
            res.render('attendance/attendance', {
                students, batch, date, error: 'No student found'
            });
        });
    }
};

attendanceRoutes.attendancePostRoute = (req, res) => {
    if (!req.query.batch) {
        req.flash('error_msgs', 'Please fill in all required fields');
        res.redirect('/attendance');
        return;
    }
    if (!req.query.date) {
        req.flash('error_msgs', 'Please fill in all required fields');
        res.redirect('/attendance');
        return;
    }
    const batch = req.query.batch;
    const date = new Date((new Date(req.query.date)).setUTCHours(0,0,0,0));
    const students = req.body;
    const adminName = req.user ? req.user.username : process.env.DEVELOPER;
    // Should never happen. req.user is always defined, as the admin-logged-in guard is always on, except in dev mode

    DateModel.findOneAndUpdate({ date, batch }, { $set: { date, batch, adminName } }, { new: true, upsert: true }, (err, _date) => {
        if (err) {
            console.log(err);
            req.flash('error_msgs', 'Error saving data');
            res.redirect('/attendance');
        } else {
            let left = Object.keys(students).length;
            let error = false;
            for (const student_id in students) {
                const present = students[student_id] == constants.PRESENT;
                StudentModel.findById(student_id, (err, student) => {
                    if (err) {
                        console.log(err);
                        req.flash('error_msgs', 'Failed to find a student!');
                        error = true;
                        left--;
                    } else {
                        let found = false;
                        // this filtering is happening in memory. Not in the DB
                        let att = student.attendance.filter((obj, _index, _arr) => {
                            if (String(obj.date) == String(date)) found = true;
                            return String(obj.date) != String(date);
                        });
                        if (present && found) {
                            left--;
                        } else if (present && !found) {
                            att.push({ date });
                            student.attendance = att;
                            student.save((err, _student) => {
                                if (err) {
                                    console.log(err);
                                    req.flash('error_msgs', `Failed to save a student's data!`);
                                    error = true;
                                }
                                left--;
                            });
                        } else if (!present && found) {
                            student.attendance = att;
                            student.save((err, _student) => {
                                if (err) {
                                    console.log(err);
                                    req.flash('error_msgs', `Failed to save a student's data!`);
                                    error = true;
                                }
                                left--;
                            });
                        } else { // !present && !found
                            left--;
                        }
                    }
                });
            }
            var _leftCheck = setInterval(() => {
                if (!left) {
                    clearInterval(_leftCheck);
                    if (!error) req.flash('success_msgs', 'Attendance saved!');
                    res.redirect('/home');
                }
            }, 100);
        }
    });
};

attendanceRoutes.viewAttendanceGetRoute = (req, res) => {
    const batch = req.query.batch;
    const date = req.query.date;
    if (batch ^ date) { // only 1 is present
        req.flash('error_msgs', 'Please fill in all required fields');
    }
    if (!batch || !date) {
        BatchModel.find({}, 'name', { sort: { name: 1 } }, (err, batches) => {
            if (err) {
                console.log(err);
            }
            res.render('attendance/select_batch_date', {
                nextURL: '/view_attendance',
                batches,
            });
        });
        return;
    }
    DateModel.findOne({ date: new Date((new Date(date)).setUTCHours(0,0,0,0)), batch }, null, {}, (err, dateModel) => {
        if (err) {
            console.log(err);
        }
        if (!dateModel) {
            res.render('attendance/attendance', {
                students: [], batch, date: new Date((new Date(date)).setUTCHours(0,0,0,0)), error: 'No attendance has been taken for this day'
            });
        } else {
            const date = new Date((new Date(dateModel.date)).setUTCHours(0,0,0,0));
            StudentModel.find({
                created: { $lte: date },
                $or: [{ deleted: null }, { deleted: { $gt: date } }],
                batch,
            }, 'name attendance created', { sort: { name: 1, created: 1 } }, (err, students) => {
                if (err) {
                    console.log(err);
                }
                res.render('attendance/attendance', {
                    students, batch, date, error: 'No student found'
                });
            });
        }
    });
};

module.exports = attendanceRoutes;
