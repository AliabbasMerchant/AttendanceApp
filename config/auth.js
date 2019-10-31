const auth = {
    isAdminLoggedIn: (req, res, next) => {
        if (req.isAuthenticated() || process.env.DEVELOPER) {
            return next();
        }
        req.flash('error_msgs', 'Please log in to access this page');
        res.redirect('/login');
    }
}

module.exports = auth;
