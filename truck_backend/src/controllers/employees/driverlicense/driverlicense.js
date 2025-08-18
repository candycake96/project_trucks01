const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    getDriverLicense : async (req, res) => {
        const {id} = req.params;
        const query = `SELECT DL.* , type.license_code, type.license_name
        FROM driver_license DL
        INNER JOIN driving_license_types Type ON DL.license_type_id = Type.license_type_id
        WHERE id_emp = @id_emp 
        ORDER BY id_driver DESC`;
        
        const values = {id_emp: id}
        try {
            const result = await executeQueryEmployeeAccessDB(query, values);

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