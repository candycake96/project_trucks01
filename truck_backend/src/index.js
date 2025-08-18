const app = require('./app');  // นำเข้าแอปจาก app.js
// ตั้งค่าแจ้งเตือนข้อมูลซ่อม PM
const runMaintenanceReminder = require('../src/cron/mainternance/mainternanceReminder')
// เรียกให้ cron เริ่มทำงาน
runMaintenanceReminder();


const port = 3333;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});





