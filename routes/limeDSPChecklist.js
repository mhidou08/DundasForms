const express = require('express');
const router = express.Router();

const limeDSPChecklist = require('../controllers/limeDSPChecklist');

router.get('/limeDSPChecklist', limeDSPChecklist.renderLimeDSPChecklist);
// router.get('/', limeDSPChecklist.renderlimeDSPChecklist);

router.post('/submitLD', limeDSPChecklist.postLimeDSPChecklist);


module.exports = router;