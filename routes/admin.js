const passport = require('passport');
const bcrypt = require('bcryptjs');

const AdminModel = require('../models/admin');

let adminRoutes = {};

adminRoutes.loginGetRoute = (_req, res) => {
    res.render('admin/login');
};

adminRoutes.loginPostRoute = (req, res, next) => {
    passport.authenticate('admin-local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: 'Invalid username or password'
    })(req, res, next);
};

adminRoutes.registerGetRoute = (_req, res) => {
    res.render('admin/register');
};

adminRoutes.registerPostRoute = (req, res) => {
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
        res.render('admin/register', { username, password1, password2 });
    } else {
        AdminModel.findOne({ username })
            .then(admin => {
                if (admin) {
                    req.flash('error_msgs', 'This username has already been registered');
                    res.render('admin/register', { password1, password2 });
                } else {
                    const newAdminModel = new AdminModel({ username, password: password1 });
                    bcrypt.genSalt(Number(process.env.SECRET_NUMBER), (err, salt) => {
                        bcrypt.hash(newAdminModel.password, salt, (err, hash) => {
                            if (err) { throw err; }
                            newAdminModel.password = hash;
                            newAdminModel.save()
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
};

adminRoutes.logoutGetRoute = (req, res) => {
    req.logout();
    req.flash('success_msgs', 'Successfully logged out');
    res.redirect('login');
};

adminRoutes.homeGetRoute = (req, res) => {
    res.render('admin/home');
};

module.exports = adminRoutes;
