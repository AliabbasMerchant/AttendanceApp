const Admin = require('../models/admin');
const Student = require('../models/student');

let attendanceRoutes = {};

attendanceRoutes.attendanceGetRoute = (req, res) => {
    let batch = req.query.batch;
    if (batch) {
        Student.find({ deleted: '', batch }, 'name', { sort: { name: 1, created: 1 } }, (err, students) => {
            if (err) {
                console.log(err);
            }
            res.render('attendance/attendance', {
                students
            });
        });
    } else {
        Student.distinct('batch', { deleted: '' }, (err, batches) => {
            if (err) {
                console.log(err);
            }
            res.render('attendance/batches', {
                batches
            });
        });
    }
};

module.exports = attendanceRoutes;
