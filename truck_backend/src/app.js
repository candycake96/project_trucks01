// src/app.js
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const {  connectTruck, connectEmployeeAccessDB } = require("./config/db");
const multer = require("multer");
const path = require("path")



// Middleware
app.use(express.json());  // ใช้ express.json() เพียงตัวเดียว
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json({
    verify: (req, res, buf, encoding) => {
        try {
            // พยายามแปลงข้อมูล JSON หากไม่สำเร็จจะโยนข้อผิดพลาด
            JSON.parse(buf);
        } catch (e) {
            console.error('Invalid JSON:', buf.toString()); 
            throw new SyntaxError('Invalid JSON'); 
        }
    }
}));



// // เปิดใช้งาน CORS ให้ทุก domain หรือกำหนดพอร์ตที่ frontend ใช้ (ในที่นี้คือ 8080) 
// app.use(cors({
//   origin: 'http://localhost:5173',  // ระบุ URL ของ frontend
//   methods: ['GET', 'POST'],  // เลือกเฉพาะ methods ที่อนุญาต
//   allowedHeaders: ['Content-Type', 'Authorization']  // เลือก headers ที่อนุญาต
// }));


// สำหรับการเชื่อมต่อกับฐานข้อมูล EmployeeAccessDB
connectEmployeeAccessDB()
  .then((connection) => {
    console.log("Connected to the EmployeeAccess database.");
    app.locals.dbEmployeeAccess = connection; // เก็บการเชื่อมต่อฐานข้อมูล EmployeeAccessDB ใน app.locals
  })
  .catch((error) => {
    console.error("Database connection failed for EmployeeAccessDB:", error);
  });


// ให้ express สามารถเข้าถึงไฟล์ในโฟลเดอร์ uploads - ข้อมูลรูปภาพโปรไฟล์ emp
app.use('/uploads', express.static(path.join(__dirname, './uploads/emp_profile')));
//  ลายเซ็น
app.use('/uploads/signature', express.static(path.join(__dirname, './uploads/emp_signature')));
// ให้ express สามารถเข้าถึงไฟล์ในโฟลเดอร์ uploads
const vehicleUploadsPath = path.join(__dirname, './controllers/truck/upload/vehicle_doc');
console.log('Vehicle Upload Path:', vehicleUploadsPath); // ตรวจสอบ path
// ให้ express สามารถเข้าถึงไฟล์ในโฟลเดอร์ uploads
const logoPath = path.join(__dirname, './controllers/employees/img/logo');
console.log('Logo Upload Path:', logoPath); // ตรวจสอบ path 

app.use('/vehicle/uploads', express.static(vehicleUploadsPath));
app.use('/company/imglogo', express.static(logoPath))

// import d from './controllers/truck/upload/vehicle_doc'


// ให้ express สามารถเข้าถึงไฟล์ในโฟลเดอร์ uploads
app.use('/api/status_doc', express.static(path.join(__dirname, './controllers/truck/upload/status_doc')));
// ให้ express สามารถเข้าถึงไฟล์ในโฟลเดอร์ uploads
app.use('/api/insurance_doc', express.static(path.join(__dirname, './controllers/truck/upload/insurance_doc')));
// ให้ express สามารถเข้าถึงไฟล์ในโฟลเดอร์ uploads
app.use('/api/vendor_doc', express.static(path.join(__dirname, './controllers/truck/upload/vendor_doc')));
// 
app.use('/api/QT_MTN', express.static(path.join(__dirname, './controllers/truck/upload/QT_MTN')));



// Example Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// result car_types
const car_typesRoutes = require("./routes/truck/car_types");
app.use("/api", car_typesRoutes);

// result vehicle_registration
const vehicle_registrationRoutes = require("./routes/truck/vehicle_registration");
app.use("/api", vehicle_registrationRoutes);

// result vehicle_registration
const loginRoutes = require("./routes/login/login");
app.use("/api", loginRoutes);

// result employees
const employeesRoutes = require("./routes/employees/employees");
app.use("/api", employeesRoutes);
// result employees
const passwordRoutes = require("./routes/employees/password");
app.use("/api", passwordRoutes);
// result 
const branchesRoutes = require("./routes/employees/branches");
app.use("/api", branchesRoutes);
// result 
const positionsRoutes = require("./routes/employees/positions");
app.use("/api", positionsRoutes);
// result 
const departmentsRoutes = require("./routes/employees/departments");
app.use("/api", departmentsRoutes);
// result 
const rolesRoutes = require("./routes/employees/roles");
app.use("/api", rolesRoutes);

// result 
const accessRoutes = require("./routes/employees/access");
app.use("/api", accessRoutes);


// result Driver
const driverRoutes = require("./routes/driver/driver");
app.use("/api", driverRoutes);

// result employee Roles
const employee_rolesRoutes = require("./routes/employees/employee_roles");
app.use("/api", employee_rolesRoutes);

// result employee Roles
const resingRoutes = require("./routes/employees/resing");
app.use("/api", resingRoutes);

// result
const companyRoutes = require("./routes/employees/company");
app.use("/api", companyRoutes);

// // result
const testRoutes = require("./routes/employees/test");
app.use("/api", testRoutes);

// // result 
const vehicle_docRoutes = require("./routes/truck/vehicle_doc");
app.use("/api", vehicle_docRoutes);

// // result 
const cehicle_typeRoutes = require("./routes/truck/vehicle_type");
app.use("/api", cehicle_typeRoutes);

// // result 
const vehicle_usage_typeRoutes = require("./routes/truck/vehicle_usage_type");
app.use("/api", vehicle_usage_typeRoutes);

// // result 
const auto_loansRoutes = require("./routes/truck/auto_loans");
app.use("/api", auto_loansRoutes);

// // result 
const driver_relationRoutes = require("./routes/truck/driver_relation");
app.use("/api", driver_relationRoutes);

// // result 
const vehicle_relation_managementRoutes = require("./routes/truck/vehicle_relation_management");
app.use("/api", vehicle_relation_managementRoutes);

// // result 
const car_mileageRoutes = require("./routes/truck/car_mileage");
app.use("/api", car_mileageRoutes);

// // result 
const car_taxRoutes = require("./routes/truck/car_tax");
app.use("/api", car_taxRoutes);

// // result 
const car_cmiRoutes = require("./routes/truck/car_cmi");
app.use("/api", car_cmiRoutes);

// // result 
const car_insuranceRoutes = require("./routes/truck/car_insurance");
app.use("/api", car_insuranceRoutes);

// // result 
const vehicle_statusRoutes = require("./routes/truck/vehicle_status");
app.use("/api", vehicle_statusRoutes);

// // result 
const vendorRoutes = require("./routes/truck/vendor");
app.use("/api", vendorRoutes);

// // result ระบบอะไหล่รถ งานซ่อม
const systemsRoutes = require("./routes/truck/maintenance/systems");
app.use("/api", systemsRoutes);

// // result ไหล่รถ ราคากลาง งานซ่อม
const partsRoutes = require("./routes/truck/maintenance/parts");
app.use("/api", partsRoutes);

//  งานซ่อม
const repair_requestsRoutes = require("./routes/truck/maintenance/repair_requests");
app.use("/api", repair_requestsRoutes);

//  ตั้งค่า
const setting_repairRoutes = require("./routes/truck/maintenance/setting_repair");
app.use("/api", setting_repairRoutes);

//  ตั้งค่า
const planningRoutes = require("./routes/truck/maintenance/planning");
app.use("/api", planningRoutes);

//  ตั้งค่า ตรวจสอบ สร้างใบเสนอราคา
const analysisRoutes = require("./routes/truck/maintenance/analysis");
app.use("/api", analysisRoutes);

//  ตั้งค่า อนุมัติสุดท้าย ผู้จัดการสาขา
const approvalRoutes = require("./routes/truck/maintenance/approval");
app.use("/api", approvalRoutes);

//  ตั้งค่า Log ระบบส่วนงานซ่อม
const repair_logRoutes = require("./routes/truck/maintenance/repair_log");
app.use("/api", repair_logRoutes);

//  ตั้งค่า หัวหน้าช่างอนุมัติตรวจสอบ
const approver_analysisRoutes = require("./routes/truck/maintenance/approver_analysis");
app.use("/api", approver_analysisRoutes);
 
//  ตั้งค่า ปิดงานซ่อม
const close_listRoutes = require("./routes/truck/maintenance/close_list");
app.use("/api", close_listRoutes);

// 
const setting_modelsRoutes = require("./routes/truck/setting_vehicle/setting_models");
app.use("/api", setting_modelsRoutes);

// ตั้งค่า 
const quotationRoutes = require("./routes/truck/maintenance/quotation");
app.use("/api", quotationRoutes);

// ตั้งค่า รายการ การแจ้งเตือน PM
const setting_mainternance_itemRoutes = require("./routes/truck/maintenance/setting_mainternance_item");
app.use("/api", setting_mainternance_itemRoutes);

// ตั้งค่า ระยะทาง การแจ้งเตือน PM
const setting_mainternance_distancesRoutes = require("./routes/truck/maintenance/setting_mainternance_distances");
app.use("/api", setting_mainternance_distancesRoutes);

// ตั้งค่า pm เพื่อแจ้งเตือน
const pm_plansRoutes = require("./routes/truck/preventive_maintenance/pm_plans");
app.use("/api", pm_plansRoutes);

//  รายงาน
const repairsRoutes = require("./routes/report/maintenance/repair");
app.use("/api", repairsRoutes);




module.exports = app;


