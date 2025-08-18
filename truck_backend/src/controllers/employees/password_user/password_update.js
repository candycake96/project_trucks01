const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const bcrypt = require('bcryptjs');

module.exports = {
  password_update: async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
console.log('password :', password);
console.log('id :', id);
    try {
      // 1. เข้ารหัสรหัสผ่านก่อนเก็บ
      const hashedPassword = await bcrypt.hash(password, 10); // 10 คือ salt rounds

      // 2. SQL ที่ปลอดภัย และควรใช้ชื่อ table ที่เหมาะสม เช่น employees
      const query = `
        UPDATE password 
        SET password = @password 
        WHERE id_emp = @id_emp
      `;

      const result = await executeQueryEmployeeAccessDB(query, {
        password: hashedPassword,
        id_emp: id,
      });

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Password updated successfully" });
      } else {
        return res.status(404).json({ message: "Employee not found" });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({ error: "An error occurred while updating the password" });
    }
  }
};
