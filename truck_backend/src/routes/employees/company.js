const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/employees/company')
const { authenticateToken  } = require('../../jwt/AuthToken')
const { uploadSingle } = require('../../controllers/employees/middleware/uploadLogo');

router.get('/getcompany', authenticateToken , companyController.getCompany);
router.get('/getcompanyid/:id', authenticateToken , companyController.getCompanyID);
router.post('/addcompany',  authenticateToken , uploadSingle.single('company_logo'), companyController.addCompany);
router.put('/editcompany/:company_id',  authenticateToken , uploadSingle.single('company_logo'), companyController.editCompany);



// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

//
module.exports = router;
