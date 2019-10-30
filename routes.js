const express = require('express');
const auth = require('./config/auth');

const router = express.Router();

router.get('/', (_req, res) => {
    res.redirect('/login');
});

router.get('/login', (_req, res) => {
    res.render("login");
});

router.post('/login', (req, res) => {
    // TODO
});

router.get('/register', auth.isAdminLoggedIn, (req, res) => {
    res.send('REGISTER ADMIN PAGE');
});

router.post('/register', auth.isAdminLoggedIn, (req, res) => {
    // TODO
});

router.get('/logout', auth.isAdminLoggedIn, (req, res) => {
    req.logout();
    req.flash('success_msgs', 'Successfully logged out');
    res.redirect('/');
});

router.get('/home', auth.isAdminLoggedIn, (req, res) => {
    /*
    Links to:
        Users page (View, add, edit)
        Attendace
    */
    res.send('HOME PAGE');
});

router.get('/students', auth.isAdminLoggedIn, (req, res) => {
    /*
    Table of students
    Options to add, edit and remove
    Link to all students (past also)
    */
    res.send('STUDENTS PAGE');
});

router.get('/students/all', auth.isAdminLoggedIn, (req, res) => {
    /*
    Table of all students
    */
    res.send('ALL STUDENTS PAGE');
});

router.get('/attendance', auth.isAdminLoggedIn, (req, res) => {
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
