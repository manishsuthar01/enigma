const express = require('express');
const router = express.Router();
const { generateContract } = require('../controllers/generateController');

router.post('/', generateContract);

module.exports = router;
