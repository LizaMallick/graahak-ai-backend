const express = require('express');
const router = express.Router();
const { createCase } = require('../controllers/caseController');

// POST /api/v1/cases
router.post('/', createCase);

module.exports = router;