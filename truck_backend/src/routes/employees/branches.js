const express = require('express');
const router = express.Router();
const branchesController = require('../../controllers/employees/branches')
const branches_addController = require('../../controllers/employees/organization/branches_add')
const { authenticateToken  } = require('../../jwt/AuthToken')

// แสดงข้อมูล
router.get('/getbranches/:id', authenticateToken , branchesController.getBranches);

// เพิ่มข้อมูล
router.post('/branches_add_data', authenticateToken , branches_addController.branches_add_data);

// แก้ไข
router.put('/branches_update_data/:id', authenticateToken , branches_addController.branches_update_data);

// ลบข้อมูล
router.put('/branches_update_status/:id', authenticateToken , branches_addController.branches_update_status);


// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

//
module.exports = router;


