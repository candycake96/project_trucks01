const express = require('express');
const router = express.Router();
const setting_mainternance_distancesController = require('../../../controllers/truck/setting_vehicle/setting_mainternance_distances');


// แสดง
router.get('/setting_mainternance_distances_show', setting_mainternance_distancesController.setting_mainternance_distances_show);
// 
router.post('/setting_mainternance_distances_add', setting_mainternance_distancesController.setting_mainternance_distances_add);
// 
router.put('/setting_mainternance_distances_update/:id', setting_mainternance_distancesController.setting_mainternance_distances_update);


module.exports = router;