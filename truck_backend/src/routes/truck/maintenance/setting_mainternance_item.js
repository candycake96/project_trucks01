const express = require('express');
const router = express.Router();
const setting_mainternance_itemController = require('../../../controllers/truck/setting_vehicle/setting_mainternance_item');


// แสดง
router.get('/setting_mainternance_item_show', setting_mainternance_itemController.setting_mainternance_item_show);
// 
router.post('/setting_mainternance_item_add', setting_mainternance_itemController.setting_mainternance_item_add);
// 
router.put('/setting_mainternance_item_update/:id', setting_mainternance_itemController.setting_mainternance_item_update);


module.exports = router;