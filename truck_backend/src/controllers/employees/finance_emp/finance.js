const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    getFinanceSalaries: async (req, res) => {
        const { id } = req.params;
        const query = `SELECT * FROM salaries WHERE id_emp = @id_emp ORDER BY salary_id DESC`;
        const values = { id_emp: id }
        try {
            const result = await executeQueryEmployeeAccessDB(query, values);

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in salaries table" });
            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    get_social_security: async (req, res) => {
        const { id } = req.params;
        const query = `SELECT * FROM social_security WHERE id_emp = @id_emp ORDER BY social_security_id DESC`;
        const values = { id_emp: id }
        try {
            const result = await executeQueryEmployeeAccessDB(query, values);

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in salaries table" });
            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    putFinanceSalaries: async (req, res) => {
        const { id } = req.params;
        const {
            base_salary,
            effective_date
        } = req.body;

        const query = `UPDATE salaries 
        SET
            base_salary = @base_salary,
            effective_date = @effective_date
        WHERE 
        salary_id = @salary_id
        `;
      

        const values = { 
            salary_id: id,
            base_salary: base_salary,
            effective_date: effective_date
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


    put_social_security: async (req, res) => {
        const { id } = req.params;
        const {
            contribution_rate,
            contribution_amount,
            effective_date,
        } = req.body;

        const query = `UPDATE salaries 
        SET
            contribution_rate,
            contribution_amount,
            effective_date
        WHERE 
        social_security_id = @social_security_id
        `;
      

        const values = { 
            social_security_id: id,
            contribution_rate: contribution_rate,
            contribution_amount: contribution_amount,
            effective_date: effective_date
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