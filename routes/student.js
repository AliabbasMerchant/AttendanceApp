const Student = require('../models/student');

let studentRoutes = {};

studentRoutes.studentsGetRoute = (_req, res) => {
    Student.find({ deleted: '' }, "name batch", { sort: { batch: 1, name: 1, created: 1 } }, (err, students) => {
        if (err) {
            console.log(err);
        }
        res.render('student/students', {
            students
        });
    });
};

studentRoutes.allStudentsGetRoute = (_req, res) => {
    Student.find({}, "name batch created deleted", { sort: { batch: 1, name: 1, created: 1 } }, (err, students) => {
        if (err) {
            console.log(err);
        }
        res.render('student/all_students', {
            students
        });
    });
};

studentRoutes.modifyStudentPostRoute = (req, res) => {
    const { id, name, batch } = req.body;
    if (!name) {
        req.flash('error_msgs', 'Please fill in all required fields');
        res.redirect('/students');
        return;
    }
    if (!id) { // create new student
        let newStudent;
        if (!batch) {
            newStudent = new Student({ name });
        } else {
            newStudent = new Student({ name, batch });
        }
        newStudent.save()
            .then(_student => {
                req.flash('success_msgs', 'Added New Student!');
                res.redirect('/students');
            })
            .catch(err => console.log(err));
    } else {
        let update;
        if (!batch) {
            update = { $set: { name } };
        } else {
            update = { $set: { name, batch } };
        }
        Student.findOneAndUpdate({ _id: id }, update, { new: true, upsert: false }, (err, _student) => {
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
    Student.findOneAndUpdate({ _id: req.params.id }, { $set: { deleted: new Date() } }, { new: true, upsert: false }, (err, _student) => {
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
