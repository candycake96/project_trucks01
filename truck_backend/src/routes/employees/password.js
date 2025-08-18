const express = require('express');
const router = express.Router();
const password_updateController = require('../../controllers/employees/password_user/password_update')
const { authenticateToken  } = require('../../jwt/AuthToken')

// 
router.put('/password_update/:id', authenticateToken , password_updateController.password_update);

// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

//
module.exports = router;
