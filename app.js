const express = require('express');
// const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const constants = require('./config/constants');

require('./config/passport')(passport);

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    dbName: 'testDB',
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIES_SECRET));
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.PRESENT = constants.PRESENT;
    res.locals.ABSENT = constants.ABSENT;
    res.locals.MIN_DATE = constants.MIN_DATE;
    res.locals.success_msgs = req.flash('success_msgs');
    res.locals.error_msgs = req.flash('error_msgs');
    next();
});

app.use('/', require('./routes/routes'));

app.listen(process.env.PORT, process.env.IP);
