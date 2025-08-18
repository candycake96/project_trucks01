const express = require('express');
const router = express.Router();
const vehicleRegistrationController = require('../../controllers/truck/vehicle_registration')

// เพิ่มข้อมูล
router.post('/add/vehicle_registration', vehicleRegistrationController.addVehicleRegistration);

// ลบข้อมูล
router.delete('/delete/vehicle_registration/:id', vehicleRegistrationController.deleteVehicleRegistration);

// แก้ไขข้อมูล
router.put('/update/vehicle_registration/:id', vehicleRegistrationController.updateVehicleRegistration);

// ดึงข้อมูล
router.get('/vehicle_registration', vehicleRegistrationController.getCarVehicleRegistration); 


module.exports = router;


