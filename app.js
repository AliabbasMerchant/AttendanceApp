// importing modules
const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

// passport setup
require('./config/passport')(passport);

// setting up mongoose
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true, dbName: 'testDB', useUnifiedTopology: true
});

// setting up the app
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// passport setup
app.use(cookieParser(process.env.COOKIES_SECRET));
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true
    })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// global variables
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success_msgs = req.flash('success_msgs');
    res.locals.error_msgs = req.flash('error_msgs');
    next();
});

app.use('/', require('./routes'));

// starting server
app.listen(process.env.PORT, process.env.IP);
