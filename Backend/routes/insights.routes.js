const express = require('express');
const router = express.Router();
const { getInsights } = require('../controllers/insights.controller');

router.post('/insights', getInsights);

module.exports = router;