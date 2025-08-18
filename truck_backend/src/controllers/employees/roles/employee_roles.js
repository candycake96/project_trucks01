const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    getEmployeeRoles: async (req, res) => {
        const { id } = req.params;
        const query = `
            SELECT er.*, r.role_name
            FROM Employee_Roles er
            INNER JOIN Roles r ON er.role_id = r.role_id
            WHERE id_emp = @id_emp
        `;

        try {
            const result = await executeQueryEmployeeAccessDB(query, { id_emp: id });

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in Employee_Roles table" });
            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    
 
 

}