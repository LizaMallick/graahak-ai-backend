const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const upload = require('../middleware/uploadMiddleware');

// Handle multipart form data with up to 5 evidence files under field name "evidence"
router.post('/', upload.array('evidence', 5), caseController.createCase);

module.exports = router;