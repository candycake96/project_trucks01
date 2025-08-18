const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    getAddress: async (req, res) => {
        const { id } = req.params;
        const query = `SELECT * FROM employee_addresses WHERE id_emp = @id_emp ORDER BY address_id DESC`;
        const values = { id_emp: id }
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

    putAddress: async (req, res) => {
        const { id } = req.params;
        const {
            house_number,
            street,
            city,
            province,
            postal_code,
            country
        } = req.body;

        const query = `UPDATE employee_addresses 
        SET
        house_number = @house_number,
        street = @street,
        city = @city,
        province = @province,
        postal_code = @postal_code,
        country = @country
        WHERE 
        address_id = @address_id
        `;

        const values = { 
            house_number,
            street,
            city,
            province,
            postal_code,
            country,
            address_id: id
        };
        try {
            // Execute the query with the provided values
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            // Check if the update affected any rows
            if (result.affectedRows > 0) {
                return res.status(200).json({ message: "Employee updated successfully" });
            } else {
                return res.status(404).json({ message: "Employee not found or no changes made" });
            }
        } catch (error) {
            // Log and respond with a detailed error message
            console.error("Database query failed:", error);
            return res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },
    
}