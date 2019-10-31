const auth = {
    isAdminLoggedIn: (req, res, next) => {
        if (process.env.DEVELOPER) {
            return next();
        }
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msgs', 'Please log in to access this page');
        res.redirect('/login');
    }
}

module.exports = auth;
