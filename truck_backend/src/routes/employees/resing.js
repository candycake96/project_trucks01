const express = require('express');
const router = express.Router();
const resingController = require('../../controllers/employees/resing/employees')
const { authenticateToken  } = require('../../jwt/AuthToken')

// 
router.get('/getemployeesresing', authenticateToken , resingController.getEmployeesResing);



// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

//
module.exports = router;
