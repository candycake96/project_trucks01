const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employees/departments')
const departments_addController = require('../../controllers/employees/organization/departments_add')
const { authenticateToken  } = require('../../jwt/AuthToken')

// 
router.get('/getdepartments/:id', authenticateToken , employeeController.getDepartments);

// 
router.post('/depastment_add_data', authenticateToken , departments_addController.depastment_add_data);

// 
router.put('/depastment_update_data/:id', authenticateToken , departments_addController.depastment_update_data);

// 
router.put('/depastment_update_status/:id', authenticateToken , departments_addController.depastment_update_status);





// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

//
module.exports = router;


