const express = require('express');
const router = express.Router();
const employeeRolesController = require('../../controllers/employees/roles/employee_roles')
const { authenticateToken  } = require('../../jwt/AuthToken')

// 
router.get('/getemployeeroles/:id', authenticateToken , employeeRolesController.getEmployeeRoles);



// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

//
module.exports = router;


