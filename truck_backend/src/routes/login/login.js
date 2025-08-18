const express = require('express');
const router = express.Router();
const vehicleRegistrationController = require('../../controllers/login/Login')

// เพิ่มข้อมูล
router.post('/logintruck', vehicleRegistrationController.loginTruck);

module.exports = router;