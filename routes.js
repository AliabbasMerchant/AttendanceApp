const express = require('express');
const constants = require('./config/constants');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('HELLO');
});


router.get('*', (_req, res) => {
    res.redirect('/')
});

module.exports = router;
