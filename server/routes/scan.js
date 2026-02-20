const express = require('express');
const router = express.Router();
const { scanContract } = require('../controllers/scanController');

router.post('/', scanContract);

module.exports = router;
