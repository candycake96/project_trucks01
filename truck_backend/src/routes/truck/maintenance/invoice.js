const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const invoice_show_detailsController = require('../../../controllers/truck/maintenance/maintenance_invoice/invoice_show_details');
const invoice_un_partController = require('../../../controllers/truck/maintenance/maintenance_invoice/part/invoice_un_part');
const invoice_addController = require('../../../controllers/truck/maintenance/maintenance_invoice/invoice_add');
const invoice_updateController = require('../../../controllers/truck/maintenance/maintenance_invoice/invoice_update');
const invoice_showController = require('../../../controllers/truck/maintenance/maintenance_invoice/invoice_show');
const invoice_approvalController = require('../../../controllers/truck/maintenance/maintenance_invoice/invoice_approval');
const { uploadMultiple } = require('../../../controllers/truck/middleware/upload_vehicle_doc');



// แสดง
router.get('/un_invoice_maintenance', authenticateToken, invoice_show_detailsController.un_invoice_maintenance); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางส่วนแรก
// แสดงข้อมูลที่มีการทำใบแจ้งหนี้
router.get('/invoice_maintenance/:id', authenticateToken, invoice_show_detailsController.invoice_maintenance); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางส่วนแรก
// แสดงอะไหล่ที่ยังไม่ได้ทำ invoice
router.get('/invoice_un_part/:id', authenticateToken, invoice_un_partController.invoice_un_part); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางส่วนแรก

// ปิดงานซ่อม

// แสดงข้อมูลในตาราง ที่ออกใบแจ้งหนี้แล้วแต่ยังไม่ได้อนุมัติ
router.get('/invoice_show_table', authenticateToken, invoice_showController.invoice_show_table); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางส่วนแรก


// เพิ่มข้อมูล 
router.post('/invoice_maintenance_add', authenticateToken, uploadMultiple, invoice_addController.invoice_add); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางส่วนแรก


// แก้ไขข้อมูล
router.put('/invoice_maintenance_update/:id', authenticateToken, uploadMultiple, invoice_updateController.invoice_update); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางส่วนแรก


// อนุมัติข้อมูล invoice
router.get('/invoice_show_table_approval', authenticateToken, invoice_showController.invoice_show_table_approval); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางอนุมัติ
router.post('/invoice_maintenance_approval/:id', authenticateToken, uploadMultiple, invoice_approvalController.invoice_approval); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางส่วนแรก

//  ตรวจสอบว่ามีข้อมูลอนุมัติอยู่หรือไม่
router.get('/invoice_checkApproval/:id', authenticateToken, invoice_show_detailsController.invoice_checkApproval); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางส่วนแรก



// ดึงข้อมูล



module.exports = router;