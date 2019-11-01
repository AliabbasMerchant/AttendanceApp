const express = require('express');
const auth = require('../config/auth');

const adminRoutes = require('./admin');
const studentRoutes = require('./student');
const batchRoutes = require('./batch');
const attendanceRoutes = require('./attendance');

const router = express.Router();

router.get('/', (_req, res) => {
    res.redirect('/login');
});

router.get('/login', adminRoutes.loginGetRoute);

router.post('/login', adminRoutes.loginPostRoute);

router.get('/register', auth.isAdminLoggedIn, adminRoutes.registerGetRoute);

router.post('/register', auth.isAdminLoggedIn, adminRoutes.registerPostRoute);

router.get('/logout', auth.isAdminLoggedIn, adminRoutes.logoutGetRoute);

router.get('/home', auth.isAdminLoggedIn, adminRoutes.homeGetRoute);

router.get('/students', auth.isAdminLoggedIn, studentRoutes.studentsGetRoute);

router.get('/all_students', auth.isAdminLoggedIn, studentRoutes.allStudentsGetRoute);

router.post('/modify_student', auth.isAdminLoggedIn, studentRoutes.modifyStudentPostRoute);

router.get('/delete_student/:id', auth.isAdminLoggedIn, studentRoutes.deleteStudentGetRoute);

router.get('/batches', auth.isAdminLoggedIn, batchRoutes.batchesGetRoute);

router.post('/modify_batch', auth.isAdminLoggedIn, batchRoutes.modifyBatchPostRoute);

router.get('/delete_batch/:id', auth.isAdminLoggedIn, batchRoutes.deleteBatchGetRoute);

router.get('/attendance', auth.isAdminLoggedIn, attendanceRoutes.attendanceGetRoute);

router.post('/attendance', auth.isAdminLoggedIn, attendanceRoutes.attendancePostRoute);

router.get('/view_attendance', auth.isAdminLoggedIn, attendanceRoutes.viewAttendanceGetRoute);

if(process.env.DEVELOPER) {
    router.use('/dev', require('./developer'));
}

router.get('*', (_req, res) => {
    res.redirect('/');
});

module.exports = router;
