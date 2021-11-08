const express = require('express');
const router = express.Router();

const secondary2Checklist = require('../controllers/secondary2Checklist');

router.get('/secondary2Checklist', secondary2Checklist.renderSecondary2Checklist);
// router.get('/', secondary2Checklist.renderSecondary2Checklist);

router.post('/submitData2', secondary2Checklist.postSecondary2Checklist);


module.exports = router;