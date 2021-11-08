const express = require('express');
const router = express.Router();

const secondary1Checklist = require('../controllers/secondary1Checklist');

router.get('/secondary1Checklist', secondary1Checklist.renderSecondary1Checklist);
// router.get('/', secondary1Checklist.renderSecondary1Checklist);

router.post('/submitData1', secondary1Checklist.postSecondary1Checklist);


module.exports = router;