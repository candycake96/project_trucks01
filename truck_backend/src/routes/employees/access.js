const express = require('express');
const router = express.Router();
const permission_accessController = require('../../controllers/employees/access/permission_access')
const permission_access_editController = require('../../controllers/employees/access/permission_access_edit')
const { authenticateToken  } = require('../../jwt/AuthToken')

// แสดงข้อมูล
router.get('/access_details', authenticateToken , permission_accessController.access_details);

router.get('/permissions/all', authenticateToken , permission_accessController.permissions_all);
router.get('/submenus/all', authenticateToken , permission_accessController.submenus_all);
router.get('/module/all', authenticateToken , permission_accessController.module_all);
router.get('/employee_permission_access/all/:id', authenticateToken , permission_accessController.employee_permission_access_all);



// เพิ่มข้อมูล
// router.post('/branches_add_data', authenticateToken , branches_addController.branches_add_data);

// แก้ไข
router.post('/permission_access_deit/:id', authenticateToken , permission_access_editController.permission_access_deit);

// ลบข้อมูล
// router.put('/branches_update_status/:id', authenticateToken , branches_addController.branches_update_status);


// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// 
module.exports = router; 


