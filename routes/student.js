const StudentModel = require('../models/student');
const BatchModel = require('../models/batch');

let studentRoutes = {};

studentRoutes.studentsGetRoute = (req, res) => {
    let batch = req.query.batch;
    BatchModel.find({}, null, { sort: { name: 1 } }, (err, batches) => {
        if (err) console.log(err);
        if (batches.length) {
            if (batch) {
                StudentModel.find({ deleted: '', batch }, 'name phone_number batch', { sort: { batch: 1, name: 1, created: 1 } }, (err, students) => {
                    if (err) {
                        console.log(err);
                    }
                    res.render('student/students', {
                        students, batches
                    });
                });
            } else {
                StudentModel.find({ deleted: '' }, 'name phone_number batch', { sort: { batch: 1, name: 1, created: 1 } }, (err, students) => {
                    if (err) {
                        console.log(err);
                    }
                    res.render('student/students', {
                        students, batches
                    });
                });
            }
        } else {
            req.flash('error_msgs', 'There are no batches. Please add a batch first.');
            res.redirect('/batches');
        }
    });
};

studentRoutes.allStudentsGetRoute = (req, res) => {
    let batch = req.query.batch;
    if (batch) {
        StudentModel.find({ batch }, 'name phone_number batch created deleted', { sort: { batch: 1, name: 1, created: 1 } }, (err, students) => {
            if (err) {
                console.log(err);
            }
            res.render('student/all_students', {
                students
            });
        });
    } else {
        StudentModel.find({}, 'name phone_number batch created deleted', { sort: { batch: 1, name: 1, created: 1 } }, (err, students) => {
            if (err) {
                console.log(err);
            }
            res.render('student/all_students', {
                students
            });
        });
    }
};

studentRoutes.modifyStudentPostRoute = (req, res) => {
    const { id, name, phone_number, batch } = req.body;
    if (!name || !batch) {
        req.flash('error_msgs', 'Please fill in all required fields');
        res.redirect('/students');
        return;
    }
    // TODO check if batch is invalid
    if (!id) { // create new student
        const created = new Date((new Date()).setUTCHours(0,0,0,0));
        const newStudentModel = new StudentModel({ name, phone_number, batch, created });
        newStudentModel.save()
            .then(_student => {
                req.flash('success_msgs', 'Added New Student!');
                res.redirect('/students');
            })
            .catch(err => console.log(err));
    } else {
        const update = { $set: { name, phone_number, batch } };
        StudentModel.findOneAndUpdate({ _id: id }, update, { new: true, upsert: false }, (err, _student) => {
            if (err) console.log(err);
            else {
                req.flash('success_msgs', 'Student updated!');
                res.redirect('/students');
            }
        });
    }
};

studentRoutes.deleteStudentGetRoute = (req, res) => {
    if (!req.params.id) {
        req.flash('error_msgs', 'Please fill in all required fields');
        res.redirect('/students');
        return;
    }
    const deleted = new Date((new Date()).setUTCHours(0,0,0,0));
    StudentModel.findOneAndUpdate({ _id: req.params.id }, { $set: { deleted } }, { new: true, upsert: false }, (err, _student) => {
        if (err) {
            console.log(err);
        }
        else {
            req.flash('success_msgs', 'Student deleted!');
        }
        res.redirect('/students');
    });
};

module.exports = studentRoutes;
