const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/driver/DrivingLicenseTypes')
const driverController = require('../../controllers/driver/Driver')
const { authenticateToken  } = require('../../jwt/AuthToken')

// แสดงข้อมูลใบขับขี่ทั้งหมด
router.get('/getdrivinglicensetypes', authenticateToken , employeeController.getDrivingLicenseTypes);

//แสดงข้อมูลพนักงานขับรถ
router.get('/getdriver', authenticateToken , driverController.getDriver);




// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

//
module.exports = router;        
