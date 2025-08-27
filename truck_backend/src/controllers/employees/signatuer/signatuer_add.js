const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const path = require('path');
const fs = require('fs');

module.exports = {

signatuer_add: async (req, res) => {
    const { id } = req.params;
    let image = null;
    try {
        image = req.files?.signature?.[0]?.filename || null;

        const updateQuery = `INSERT INTO emp_signature (signature, emp_id) VALUES (@signature, @emp_id)`;
        const result = await executeQueryEmployeeAccessDB(updateQuery, { signature: image, emp_id: id });

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Employee signature added successfully" });
        } else {
            return res.status(404).json({ message: "No changes made" });
        }
    } catch (error) {
        console.error("Database query failed:", error);
        return res.status(500).json({ message: "Database query failed", error: error.message });
    }
},



    // 
    signatuer_show: async (req, res) => {
        const { id } = req.params;

        try {
            const sql = `SELECT TOP 1 signature 
FROM emp_signature 
WHERE emp_id = @id_emp 
ORDER BY created_at DESC;
`;
            const result = await executeQueryEmployeeAccessDB(sql, { id_emp: id });

            if (result && result.length > 0) {
                // เพิ่ม URL ของรูปภาพ
                const fileUrl = result.map(reg => ({
                    ...reg, // คัดลอกข้อมูลเดิม
                    signature: reg.signature
                        ? `${req.protocol}://${req.get('host')}/api/uploads/signature/${reg.signature}`
                        : null, // ตรวจสอบว่ามีรูปภาพหรือไม่
                }));
                res.status(200).json(fileUrl);
            } else {
                console.warn("⚠️ ไม่มีข้อมูลในตาราง ");
                res.status(404).json({ message: "No data found in  table" });
            }

        } catch (error) {
            console.error('Error fetching signature:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error: error.message });
        }
    },

    signatuer_delect: async (req, res) => {
        try {
            const { id } = req.parame;
        } catch (error) {

        }
    }

};
