const express = require('express');
const router = express.Router();

const washPlantChecklist = require('../controllers/washPlantChecklist');

router.get('/washPlantChecklist', washPlantChecklist.renderWashPlantChecklist);
// router.get('/', washPlantChecklist.renderWashPlantChecklist);

router.post('/submitWP', washPlantChecklist.postWashPlantChecklist);


module.exports = router;