// importing modules
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// importing models
const Admin = require('../models/admin');

module.exports = function(passport) {
    passport.use('admin-local',
        new LocalStrategy({ usernameField: 'name' }, (name, password, done) => {
            Admin.findOne({ name: name })
            .then(admin => {
                if (!admin) {
                    // Admin not found
                    return done(null, false, { message: 'Admin not registered' });
                }
                // Match password
                bcrypt.compare(password, admin.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        // Matched
                        return done(null, admin);
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                });
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Admin.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
