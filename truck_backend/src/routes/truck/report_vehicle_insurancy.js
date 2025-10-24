const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../jwt/AuthToken');
const vehicleInsurancyDetailsController = require('../../controllers/truck/report_vehicle_insurancy/vehicle_insurancy_detail');

// 📌 รายงานยานพาหนะและประกันภัย (POST เพราะอาจมี filter ช่วงเวลา)
router.get(
  '/vehicle_insurancy_details',
  authenticateToken,
  vehicleInsurancyDetailsController.vehicle_insurancy_details
);

router.post(
  '/vehicle_insurancy_details_search',
  authenticateToken,
  vehicleInsurancyDetailsController.vehicle_insurancy_details_search
);

// 📌 ถ้าอยากทำดึงข้อมูลทั้งหมดแบบ GET ก็สามารถเพิ่มได้
// router.get('/vehicle_insurancy_details', authenticateToken, vehicleInsurancyDetailsController.getAll);

module.exports = router;
