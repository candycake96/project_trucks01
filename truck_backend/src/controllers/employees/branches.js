const { executeQueryEmployeeAccessDB } = require('../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    getBranches: async (req, res) => {
        const {id} = req.params;
        const query = `SELECT * FROM branches WHERE company_id = @company_id AND branch_status = 'Active'`;
        const value = {company_id: id }
        try {
            const result = await executeQueryEmployeeAccessDB(query, value);

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in branches table" });

            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },
 

}
