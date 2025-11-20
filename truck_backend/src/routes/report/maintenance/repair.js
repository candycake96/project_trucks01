const express = require('express');
const router = express.Router();
const repairController = require('../../../controllers/report/maintenance/generate-repair-report')
const repairSummaryController = require('../../../controllers/report/maintenance/generate-repair-summary-report')
const repairInvoiceController = require('../../../controllers/report/maintenance/generate-repair-invoice-report')

// report ใบแจ้งซ่อม
router.post('/report-createRepair/:id', repairController.createRepair);

// report สรุปการแจ้งซ่อม
router.get('/generate-repair-summary-report', repairSummaryController.createRepair);

//  report ใบแจ้งหนี้
router.post('/generate-repair-invoice-repor/:id', repairInvoiceController.createRepair);


module.exports = router; 
