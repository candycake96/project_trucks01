const express = require('express');
const router = express.Router();
const repairController = require('../../../controllers/report/maintenance/generate-repair-report')

// เพิ่มข้อมูล
router.post('/report-createRepair/:id', repairController.createRepair);

module.exports = router; 