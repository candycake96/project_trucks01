const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employees/employees')
const employeeEmployeesController = require('../../controllers/employees/employees/employee_edit')
const employeeImageController = require('../../controllers/employees/employees/employee_image')
const employeeShowIDController = require('../../controllers/employees/employee_show_id')
const employeeAddController = require('../../controllers/employees/employeeAdd')
const driverLicenseController = require('../../controllers/employees/driver_licenses')
const addressController = require('../../controllers/employees/address/address')
const financeController = require('../../controllers/employees/finance_emp/finance')
const employeeDriverLicenseController = require('../../controllers/employees/driverlicense/driverlicense')

const signatuer_addController = require('../../controllers/employees/signatuer/signatuer_add') //ลายเซ็น
const { authenticateToken  } = require('../../jwt/AuthToken')
const { uploadMultiple } = require('../../middleware/upload');
const multer = require('multer');
const upload = multer(); // You can configure storage options if needed


//ข้อมูลพนักงานทั้งหมด
router.get('/getemployees', authenticateToken , employeeController.getEmployees);

// แสดงขเ้อมูล โดยใช้ code
router.get('/getemployeeshowcode/:code', authenticateToken , employeeShowIDController.getEmployeeShowCode);

// แก้ไข status ของพนักงาน
router.put('/putemployeeresign/:id', authenticateToken , employeeController.putEmployeeResign);

// แก้ไขข้อมูล employees
router.put('/putemployees/:id', authenticateToken , employeeEmployeesController.putEmployees);

// 
router.put('/employeesputimage/:id', authenticateToken , uploadMultiple, employeeImageController.putEmployeeImage);


// แสดงข้อมูลพนักงานเช็คค่า id ที่รับส่ง
router.get('/getemployeesshowid/:id', authenticateToken , employeeShowIDController.getEmployeeShowID);

// เพิ่มข้อมูลพนักงาน
// Using the uploadSingle middleware in a POST route
router.post('/addemployees', authenticateToken, uploadMultiple, employeeController.addEmployees);


// แสดงข้อมูลพนักงาน
router.get('/getemployeesdriver', authenticateToken, employeeController.getEmployeesDriver);

// เพิ่มข้อมูลพนักงาน
router.post('/addemployeesdriver', authenticateToken, uploadMultiple, employeeAddController.addEmployeesDriver);
//ลายเซ็น
router.post('/signatuer_add/:id', authenticateToken, uploadMultiple, signatuer_addController.signatuer_add);  // เก็บข้อมูล
router.get('/signatuer_show/:id', authenticateToken, uploadMultiple, signatuer_addController.signatuer_show); // แสดงรูป


// router.get('/getdriverlicense', authenticateToken , driverLicenseController.getDriverLicense);
router.post('/adddriverlicense/:id', authenticateToken , driverLicenseController.addDriverLicense); //เพิ่มข้อมูลใบขับขี่
router.delete('/deletedriverlicense/:id', authenticateToken , driverLicenseController.deleteDriverLicense);
router.put('/updatedriverlicense/:id', authenticateToken , driverLicenseController.updateDriverLicense);

// โชว์ข้อมูล โดยข้อมูลที่อยู่เช็คจาก id_emp ที่อยู่
router.get('/getaddress/:id', authenticateToken , addressController.getAddress)
router.put('/putaddress/:id', authenticateToken , addressController.putAddress) //แก้ไข

// 
router.get('/getFinanceSalaries/:id', authenticateToken , financeController.getFinanceSalaries)

// 
router.get('/get_social_security/:id', authenticateToken , financeController.get_social_security)


// โชว์ข้อมูล โดยข้อมูลที่อยู่เช็คจาก id_emp
router.get('/getdriverLicense/:id', authenticateToken , employeeDriverLicenseController.getDriverLicense)


// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// 
module.exports = router;



