const express = require('express');
const router = express.Router();
const rolesController = require('../../controllers/employees/roles')
const { authenticateToken  } = require('../../jwt/AuthToken')

// 
router.get('/getroles', authenticateToken , rolesController.getRoles);
router.post('/updateemployeeroles/:id_emp', authenticateToken, rolesController.updateemployeeroles);




// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

//
module.exports = router;


