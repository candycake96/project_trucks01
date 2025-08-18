const cron = require('node-cron');
const { executeQueryEmployeeAccessDB } = require('../../config/db');
const transporter = require('../../config/email'); // ✅ ใช้ที่ import มา

const runMaintenanceReminder = () => {
  cron.schedule('25 16 * * *', async () => {
    console.log("⏰ ส่งแจ้งเตือน: ถึงเวลาตรวจเช็คซ่อมบำรุงตอน 16:23 น.");

    const sqlEmp = `
      SELECT e.id_emp, e.email, e.fname, e.lname, pc.permission_code 
      FROM employees e
      LEFT JOIN Employee_permission_access pc ON e.id_emp = pc.emp_id
      WHERE pc.permission_code = 'REQUEST_ONTIFICATION'
    `;

    try {
      const recipients = await executeQueryEmployeeAccessDB(sqlEmp);

      for (const person of recipients) {
        const mailOptions = {
          from: '"Maintenance Bot" <candycake96@gmail.com>',
          to: person.email,
          subject: "แจ้งเตือนซ่อมบำรุง",
          html: `
            <p>สวัสดีคุณ ${person.fname} ${person.lname},</p> <br/>
            <p>ระบบแจ้งเตือนว่าถึงเวลาตรวจเช็คซ่อมบำรุงประจำวันแล้ว</p>
            <p>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 ส่งอีเมลแจ้งเตือนถึง: ${person.email}`);
      }

    } catch (err) {
      console.error("❌ เกิดข้อผิดพลาดในการส่งอีเมล:", err);
    }
  });
};

module.exports = runMaintenanceReminder;


