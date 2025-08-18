const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    putEmployees: async (req, res) => {
        const { id } = req.params; // Extract employee ID from request parameters
        const {
            code,
            fname,
            lname,
            nickname,
            gender,
            phone,
            email,
            date_job,
            id_position,
            id_department,
            id_branch,
            identification_number
        } = req.body; // Extract fields from request body
        
        const query = `
            UPDATE employees SET 
                code = @code,
                fname = @fname,
                lname = @lname,
                nickname = @nickname,
                gender = @gender,
                phone = @phone,
                email = @email,
                date_job = @date_job,
                id_position = @id_position,
                id_department = @id_department,
                id_branch = @id_branch,
                identification_number = @identification_number 
            WHERE id_emp = @id_emp
        `;
    
        const values = {
            code,
            fname,
            lname,
            nickname,
            gender,
            phone,
            email,
            date_job,
            id_position,
            id_department,
            id_branch,
            identification_number,
            id_emp: id
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