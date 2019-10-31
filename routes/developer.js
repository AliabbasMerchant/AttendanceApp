const express = require('express');
const AdminModel = require('../models/admin');
const StudentModel = require('../models/student');
const DateModel = require('../models/date');

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

router.get('*', (_req, res) => {
    res.redirect('/dev');
});

module.exports = router;
