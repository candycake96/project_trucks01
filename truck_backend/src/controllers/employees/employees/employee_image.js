const fs = require('fs');
const path = require('path');
const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    putEmployeeImage: async (req, res) => {
        const { id } = req.params;
        let image = null;

        try {
            // ดึงรูปภาพเก่าจากฐานข้อมูล
            const getImageQuery = `SELECT image FROM employees WHERE id_emp = @id`;
            const [employee] = await executeQueryEmployeeAccessDB(getImageQuery, { id });

            if (!employee) {
                return res.status(404).json({ message: "Employee not found" });
            }

            const oldImage = employee.image;

            // ตรวจสอบและดึงชื่อไฟล์ใหม่จาก req.files
            image = req.files?.image?.[0]?.filename || null;


            // ลบรูปภาพเก่าถ้ามี และไม่ใช่ default
            if (oldImage && oldImage !== "default.jpg") {
                const imagePath = path.join(__dirname, '../../../uploads/emp_profile', oldImage);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            

            // อัปเดตรูปภาพใหม่ในฐานข้อมูล
            const updateQuery = `UPDATE employees SET image = @image WHERE id_emp = @id`;
            const result = await executeQueryEmployeeAccessDB(updateQuery, { image, id });

            if (result.affectedRows > 0) {
                return res.status(200).json({ message: "Employee image updated successfully" });
            } else {
                return res.status(404).json({ message: "No changes made" });
            }

        } catch (error) {
            console.error("Database query failed:", error);
            return res.status(500).json({ message: "Database query failed", error: error.message });
        }
    }
};
