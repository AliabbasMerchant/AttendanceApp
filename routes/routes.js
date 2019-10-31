const express = require('express');
const auth = require('../config/auth');

const adminRoutes = require('./admin');
const studentRoutes = require('./student');

const router = express.Router();

router.get('/', (_req, res) => {
    res.redirect('/login');
});

router.get('/login', adminRoutes.loginGetRoute);

router.post('/login', adminRoutes.loginPostRoute);

router.get('/register', adminRoutes.registerGetRoute);

router.post('/register', adminRoutes.registerPostRoute);

router.get('/logout', adminRoutes.logoutGetRoute);

router.get('/home', adminRoutes.homeGetRoute);

router.get('/students', studentRoutes.studentsGetRoute);

router.get('/all_students', studentRoutes.allStudentsGetRoute);

router.post('/modify_student', studentRoutes.modifyStudentPostRoute);

router.get('/delete_student/:id', studentRoutes.deleteStudentGetRoute);

// TODO: Where should this go?
router.get('/attendance', (req, res) => {
    /*
    Date option
    List of users
    Save button
    */
    res.send('HOME PAGE');
});

router.get('*', (_req, res) => {
    res.redirect('/')
});

module.exports = router;
