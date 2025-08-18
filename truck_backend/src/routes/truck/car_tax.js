const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const tax_managmentController = require('../../controllers/truck/car_tax/tax_managment');
// แสดง
router.get('/tax_managment_show', authenticateToken, tax_managmentController.tax_managment_show);
router.get('/tax_managment_show_all', authenticateToken, tax_managmentController.tax_managment_show_all);

// ลบข้อมูล


// แก้ไขข้อมูล


// ดึงข้อมูล



module.exports = router;