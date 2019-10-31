const AdminModel = require('../models/admin');
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
            res.render('attendance/batches', {
                batches
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
    if (!req.body.students) {
        // No one tured up! Its a mass bunk! :)
        req.body.students = [];
    }
    const batch = req.query.batch;
    const date = new Date(req.body.date);
    const students = typeof (req.body.students) == 'string' ? Array(req.body.students) : req.body.students;;
    const adminName = req.user ? req.user.username : process.env.DEVELOPER;
    // Should never happen. req.user is always defined, as we have the admin-logged-in guard is always on, except in dev mode

    DateModel.findOneAndUpdate({ date, batch }, { $set: { date, batch, adminName } }, { new: true, upsert: true }, (err, _date) => {
        if (err) {
            console.log(err);
            req.flash('error_msgs', 'Error saving data');
            res.redirect('/attendance?batch=' + batch);
        }
        else {
            let left = students.length;
            let error = false;
            students.forEach(student_id => {
                StudentModel.findById(student_id, (err, student) => {
                    if (err) {
                        console.log(err);
                        req.flash('error_msgs', 'Failed to find a student!');
                        error = true;
                    }
                    else {
                        let attendanceData = { date };
                        if (!student.attendance.includes(attendanceData)) {
                            student.attendance.push(attendanceData);
                            student.save((err, _student) => {
                                if (err) {
                                    console.log(err);
                                    req.flash('error_msgs', `Failed to save a student's data!`);
                                    error = true;
                                }
                            });
                        }
                    }
                    left--;
                });
            });
            var _flagCheck = setInterval(() => {
                if (!left) {
                    clearInterval(_flagCheck);
                    if (!error) req.flash('success_msgs', 'Attendance saved!');
                    res.redirect('/home');
                }
            }, 100);
        }
    });
}

module.exports = attendanceRoutes;
