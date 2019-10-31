const StudentModel = require('../models/student');
const DateModel = require('../models/date');

let attendanceRoutes = {};

attendanceRoutes.attendanceGetRoute = (req, res) => {
    let batch = req.query.batch;
    if (batch) {
        StudentModel.find({ deleted: '', batch }, 'name', { sort: { name: 1, created: 1 } }, (err, students) => {
            if (err) {
                console.log(err);
            }
            res.render('attendance/attendance', {
                students, batch
            });
        });
    } else {
        StudentModel.distinct('batch', { deleted: '' }, (err, batches) => {
            if (err) {
                console.log(err);
            }
            res.render('attendance/select_batch', {
                batches,
                nextURL: "/attendance"
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
    if (!req.body.date) {
        req.flash('error_msgs', 'Please fill in all required fields');
        res.redirect('/attendance?batch=' + req.query.batch);
        return;
    }
    const batch = req.query.batch;
    const date = new Date(req.body.date);
    delete req.body.date;
    const students = req.body;
    const adminName = req.user ? req.user.username : process.env.DEVELOPER;
    // Should never happen. req.user is always defined, as the admin-logged-in guard is always on, except in dev mode

    DateModel.findOneAndUpdate({ date, batch }, { $set: { date, batch, adminName } }, { new: true, upsert: true }, (err, _date) => {
        if (err) {
            console.log(err);
            req.flash('error_msgs', 'Error saving data');
            res.redirect('/attendance?batch=' + batch);
        }
        else {
            let left = Object.keys(students).length;
            let error = false;
            for (const student_id in students) {
                const present = students[student_id] == "present";
                StudentModel.findById(student_id, (err, student) => {
                    if (err) {
                        console.log(err);
                        req.flash('error_msgs', 'Failed to find a student!');
                        error = true;
                        left--;
                    }
                    else {
                        let found = false;
                        // this filtering is happening in memory. Not in the DB
                        student.attendance = student.attendance.filter((obj, _index, _arr) => {
                            if(String(obj.date) == String(date)) found = true;
                            return String(obj.date) != String(date);
                        });
                        if (present && found) {
                            left--;
                        } else if(present && !found) {
                            student.attendance.push({ date });
                            student.save((err, _student) => {
                                if (err) {
                                    console.log(err);
                                    req.flash('error_msgs', `Failed to save a student's data!`);
                                    error = true;
                                }
                                left--;
                            });
                        } else if(!present && found) {
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
            var _flagCheck = setInterval(() => {
                if (!left) {
                    clearInterval(_flagCheck);
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
    if (batch) {
        if (date) {
            DateModel.findOne({ date, batch }, null, {}, (err, dateModel) => {
                if (err) {
                    console.log(err);
                }
                if (!dateModel) {
                    res.render('attendance/attendance', {
                        students: [], batch, error: "No attendance has been taken for this day", date: new Date(date)
                    });
                } else {
                    const date = new Date(dateModel.date);
                    StudentModel.find({
                        created: { $lte: date },
                        $or: [{ deleted: null }, { deleted: { $gt: date } }],
                        batch,
                    }, 'name attendance', { sort: { name: 1, created: 1 } }, (err, students) => {
                        if (err) {
                            console.log(err);
                        }
                        res.render('attendance/attendance', {
                            students, batch, date
                        });
                    });
                }
            });
        } else {
            res.render('attendance/select_date', {
                batch,
                nextURL: "/view_attendance"
            });
        }
    } else {
        StudentModel.distinct('batch', { deleted: '' }, (err, batches) => {
            if (err) {
                console.log(err);
            }
            res.render('attendance/select_batch', {
                batches,
                nextURL: "/view_attendance"
            });
        });
    }
};

module.exports = attendanceRoutes;
