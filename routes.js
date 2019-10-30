const express = require('express');
const auth = require('./config/auth');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const Admin = require('./models/admin');

const router = express.Router();

router.get('/', (_req, res) => {
    res.redirect('/login');
});

router.get('/login', (_req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('admin-local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: 'Invalid username or password'
    })(req, res, next);
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { username, password1, password2 } = req.body;
    let error = false;
    if (!username || !password1 || !password2) {
        req.flash('error_msgs', 'Please fill in all required fields');
        error = true;
    }
    if (username.length < 3) {
        req.flash('error_msgs', 'Username should be at least 3 characters long');
        error = true;
    }
    if (password1 !== password2) {
        req.flash('error_msgs', 'Passwords do not match');
        error = true;
    }
    if (password1.length < 8) {
        req.flash('error_msgs', 'Password should be at least 8 characters long');
        error = true;
    }
    if (error) {
        res.render('register', { username, password1, password2 });
    } else {
        Admin.findOne({ username })
            .then(admin => {
                if (admin) {
                    req.flash('error_msgs', 'This username has already been registered');
                    res.render('register', { password1, password2 });
                } else {
                    const newAdmin = new Admin({ username, password: password1 });
                    bcrypt.genSalt(Number(process.env.SECRET_NUMBER), (err, salt) => {
                        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                            if (err) { throw err; }
                            newAdmin.password = hash;
                            newAdmin.save()
                                .then(_admin => {
                                    req.flash('success_msgs', 'Successfully registered!');
                                    res.redirect('/login');
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            });
    };
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
