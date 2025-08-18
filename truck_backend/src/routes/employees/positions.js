const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employees/positions')
const jobposition_addController = require('../../controllers/employees/organization/jobposition_add')
const { authenticateToken  } = require('../../jwt/AuthToken')

// 
router.get('/getpositions/:id', authenticateToken , employeeController.getPositions);

// 
router.post('/positions_add_data', authenticateToken , jobposition_addController.positions_add_data);

// 
router.put('/positions_update_data/:id', authenticateToken , jobposition_addController.positions_update_data);

// 
router.put('/positions_update_status/:id', authenticateToken , jobposition_addController.positions_update_status);




// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

//
module.exports = router;


