const express = require('express');
const router = express.Router();

const secondary3Checklist = require('../controllers/secondary3Checklist');

router.get('/secondary3Checklist', secondary3Checklist.renderSecondary3Checklist);
// router.get('/', secondary3Checklist.renderSecondary3Checklist);

router.post('/submitData3', secondary3Checklist.postSecondary3Checklist);


module.exports = router;