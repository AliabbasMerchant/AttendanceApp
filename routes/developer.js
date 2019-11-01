const express = require('express');
const AdminModel = require('../models/admin');
const StudentModel = require('../models/student');
const DateModel = require('../models/date');
const BatchModel = require('../models/batch');

const router = express.Router();

router.get('/', (_req, res) => {
    res.send('For Developers Only');
});

router.get('/students', (_req, res) => {
    StudentModel.find({}, null, null, (err, students) => {
        if (err) {
            res.send(err);
        } else {
            res.json(students);
        }
    });
});

router.get('/batches', (_req, res) => {
    BatchModel.find({}, null, null, (err, batches) => {
        if (err) {
            res.send(err);
        } else {
            res.json(batches);
        }
    });
});

router.get('/admins', (_req, res) => {
    AdminModel.find({}, null, null, (err, admins) => {
        if (err) {
            res.send(err);
        } else {
            res.json(admins);
        }
    });
});

router.get('/dates', (_req, res) => {
    DateModel.find({}, null, null, (err, dates) => {
        if (err) {
            res.send(err);
        } else {
            res.json(dates);
        }
    });
});

router.get('/del_students', (_req, res) => {
    StudentModel.deleteMany({}, (err) => {
        res.send(err);
    });
});

router.get('/del_admins', (_req, res) => {
    AdminModel.deleteMany({}, (err) => {
        res.send(err);
    });
});

router.get('/del_dates', (_req, res) => {
    DateModel.deleteMany({}, (err) => {
        res.send(err);
    });
});

router.get('/del_batches', (_req, res) => {
    BatchModel.deleteMany({}, (err) => {
        res.send(err);
    });
});

router.get('/rem_att', (_req, res) => {
    DateModel.deleteMany({}, (err) => {
        res.send(err);
    });
    StudentModel.find({}, null, null, (err, students) => {
        if (err) {
            res.send(err);
        } else {
            students.forEach(student => {
                student.attendance = [];
                student.save((err, _student) => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
    });
});

router.get('/clear', (_req, res) => {
    DateModel.deleteMany({}, (err) => {
        if(err) res.send(err);
    });
    StudentModel.deleteMany({}, (err) => {
        if(err) res.send(err);
    });
    BatchModel.deleteMany({}, (err) => {
        if(err) res.send(err);
    });
    res.send("");
});

router.get('*', (_req, res) => {
    res.redirect('/dev');
});

module.exports = router;
