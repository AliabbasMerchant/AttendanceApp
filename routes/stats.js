const StudentModel = require('../models/student');
const DateModel = require('../models/date');
const BatchModel = require('../models/batch');

let statsRoutes = {};

statsRoutes.viewSpanAttendanceGetRoute = (req, res) => {
    const batch = req.query.batch;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    if ((!batch || !startDate || !endDate) && (batch || startDate || endDate)) {  // something is missing, but not everything
        req.flash('error_msgs', 'Please fill in all required fields');
    }
    if (!batch || !startDate || !endDate) { // something is missing
        BatchModel.find({}, 'name', { sort: { name: 1 } }, (err, batches) => {
            if (err) {
                console.log(err);
            }
            res.render('stats/select_batch_span', {
                nextURL: '/view_span_attendance',
                batches
            });
        });
        return;
    }
    startDate = new Date((new Date(startDate)).setUTCHours(0,0,0,0));
    endDate = new Date((new Date(endDate)).setUTCHours(0,0,0,0));
    DateModel.find({ date: { $gte: startDate, $lte: endDate }, batch }, (err, dateModels) => {
        if (err) {
            console.log(err);
        }
        if (!dateModels.length) {
            res.render('stats/span_attendance', {
                batch, startDate, endDate, dates: [], students: [], error: 'No attendance record'
            });
        } else {
            let dates = [];
            dateModels.forEach(dateModel => {
                dates.push(dateModel.date);
            });
            StudentModel.find({
                created: { $lte: endDate },
                $or: [{ deleted: null }, { deleted: { $gt: startDate } }],
                batch,
            }, 'name attendance created deleted', { sort: { name: 1, created: 1 } }, (err, students) => {
                if (err) {
                    console.log(err);
                }
                let s = [];
                students.forEach(student => {
                    let attendance = [];
                    student.attendance.forEach(obj => {
                        attendance.push(obj.date);
                    });
                    s.push({
                        name: student.name,
                        created: student.created,
                        deleted: student.deleted,
                        attendance,
                    });
                });
                res.render('stats/span_attendance', {
                    batch, startDate, endDate, dates, students: s, error: 'No students'
                });
            });
        }
    });
};

statsRoutes.viewStudentGetRoute = (req, res) => {
    if (!req.query.id) {
        req.flash('error_msgs', 'Please select a student.');
        res.redirect('/all_students');
        return;
    }
    StudentModel.findById(req.query.id, (err, student) => {
        if (err) {
            console.log(err);
            req.flash('error_msgs', 'An error occurred.');
            res.redirect('/all_students');
            return;
        }
        let dateFinder;
        const startDate = new Date((new Date(student.created)).setUTCHours(0,0,0,0));
        if (student.deleted) {
            dateFinder = { $gte: startDate, $lt: new Date((new Date(student.deleted)).setUTCHours(0,0,0,0)) };
        } else {
            dateFinder = { $gte: startDate };
        }
        DateModel.find({
            date: dateFinder,
            batch: student.batch,
        }, 'date', { sort: { date: 1 } }, (err, dateModels) => {
            if (err) {
                console.log(err);
                req.flash('error_msgs', 'An error occurred.');
                res.redirect('/all_students');
                return;
            }
            let attendance = [];
            student.attendance.forEach(obj => {
                attendance.push(String(obj.date));
            });
            res.render('stats/student', {
                student, attendance, dates: dateModels.map(dateModel => String(dateModel.date))
            });
        });
    })
};

module.exports = statsRoutes;
