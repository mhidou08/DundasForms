const express = require('express');
const router = express.Router();

const secondary4Checklist = require('../controllers/secondary4Checklist');

router.get('/secondary4Checklist', secondary4Checklist.renderSecondary4Checklist);
// router.get('/', secondary4Checklist.renderSecondary4Checklist);

router.post('/submitData4', secondary4Checklist.postSecondary4Checklist);


module.exports = router;