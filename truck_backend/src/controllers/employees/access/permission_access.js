const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    // ไม่ได้ใช้แล้ว --------
    access_details: async (req, res) => {
        const query = `SELECT * FROM permission_access ORDER BY permission_module ASC`;
        try {
            const result = await executeQueryEmployeeAccessDB(query);

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in access_details table" });
            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    module_all: async (req, res) => {
        const query = `SELECT * FROM permission_modules ORDER BY module_id ASC`;
        try {
            const result = await executeQueryEmployeeAccessDB(query);

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in access_details table" });
            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    submenus_all: async (req, res) => {
        const query = `SELECT * FROM permission_submenus ORDER BY module_id ASC`;
        try {
            const result = await executeQueryEmployeeAccessDB(query);

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in access_details table" });
            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    permissions_all: async (req, res) => {
        const query = `SELECT 
      pm.module_id,
      pm.name AS module_name,
      mm.menu_id,
      mm.name AS menu_name,
      pf.function_id,
      pf.code AS permission_code,
      pf.name AS function_name,
      pf.code AS function_code
    FROM permission_modules pm
    JOIN permission_submenus mm ON mm.module_id = pm.module_id
    JOIN permission_functions pf ON pf.menu_id = mm.menu_id
    ORDER BY pm.module_id, mm.menu_id, pf.function_id`;
        try {
            const result = await executeQueryEmployeeAccessDB(query);

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in access_details table" });
            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    employee_permission_access_all: async (req, res) => {
        const { id } = req.params;

        try {
console.log('test', id)
                // ถ้าใช้ mssql
const query = `SELECT * FROM employee_permission_access WHERE emp_id = @emp_id`;
const values = { emp_id: id };
const result = await executeQueryEmployeeAccessDB(query, values);

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in access_details table" });
            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },



    // putAddress: async (req, res) => {
    //     const { id } = req.params;
    //     const {
    //         house_number,
    //         street,
    //         city,
    //         province,
    //         postal_code,
    //         country
    //     } = req.body;

    //     const query = `UPDATE employee_addresses 
    //     SET
    //     house_number = @house_number,
    //     street = @street,
    //     city = @city,
    //     province = @province,
    //     postal_code = @postal_code,
    //     country = @country
    //     WHERE 
    //     address_id = @address_id
    //     `;

    //     const values = { 
    //         house_number,
    //         street,
    //         city,
    //         province,
    //         postal_code,
    //         country,
    //         address_id: id
    //     };
    //     try {
    //         // Execute the query with the provided values
    //         const result = await executeQueryEmployeeAccessDB(query, values);

    //         // Check if the update affected any rows
    //         if (result.affectedRows > 0) {
    //             return res.status(200).json({ message: "Employee updated successfully" });
    //         } else {
    //             return res.status(404).json({ message: "Employee not found or no changes made" });
    //         }
    //     } catch (error) {
    //         // Log and respond with a detailed error message
    //         console.error("Database query failed:", error);
    //         return res.status(500).json({ message: "Database query failed", error: error.message });
    //     }
    // },

}