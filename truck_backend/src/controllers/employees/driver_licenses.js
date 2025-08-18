const { executeQueryEmployeeAccessDB } = require('../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    // แสดงข้อมูล Driver License
    getDriverLicense: async  (req, res) => {
        const query = `SELECT dr.license_number, dr.issued_date, dr.expiry_date, dr.issuing_authority, dr.id_emp, dr.status,dr.id_driver, 
        lt.license_code, lt.license_name,
       emp.fname, emp.lname
FROM ((driver_license dr
INNER JOIN employees emp ON dr.id_emp = emp.id_emp)
INNER JOIN driving_license_types lt ON dr.license_type_id = lt.license_type_id)
WHERE dr.status = 'Active'
ORDER BY dr.expiry_date DESC;

        `;
        try {
            const result = await executeQueryEmployeeAccessDB(query);

            if (result && result.length > 0) {
                res.status(200).json(result); // ส่งข้อมูลในรูปแบบ JSON
            } else {
                res.status(404).json({ message: "No data found in Driver License table" }); // แก้ไขคำผิด
            }
        } catch (error) { // ระบุพารามิเตอร์ error
            console.error("Database query failed: ", error);
            res.status(500).json({ message: "Database query failed", error: error.message }); 
        }
    },


    // เพิ่อข้อมูล Driver License
// Add Driver License
addDriverLicense: async (req, res) => {
    const { id } = req.params; // Corrected typo from 'req.parames' to 'req.params'
    const { 
        license_number,
        issued_date,
        expiry_date,
        license_type,
        issuing_authority,
        status
    } = req.body;

    // Ensure required fields are provided
    if (!id || !license_number || !issued_date || !expiry_date || !license_type || !issuing_authority || !status) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const query = `  
        INSERT INTO driver_license (   
            id_emp,  
            license_number,  
            issued_date,  
            expiry_date,  
            license_type_id,  
            issuing_authority,  
            status 
        ) VALUES (
            @id_emp, 
            @license_number, 
            @issued_date, 
            @expiry_date, 
            @license_type_id, 
            @issuing_authority, 
            @status 
        )`;

    const values = {
        id_emp: id,
        license_number,
        issued_date,
        expiry_date,
        license_type_id: license_type,
        issuing_authority,
        status,
    };

    try {
        // Execute the query with the provided values
        const result = await executeQueryEmployeeAccessDB(query, values);

        // Check if the insert was successful
        if (result.affectedRows > 0) {
            return res.status(201).json({ message: "Driver license added successfully." });
        } else {
            return res.status(500).json({ message: "Failed to add driver license." });
        }
    } catch (error) {
        // Log and respond with a detailed error message
        console.error("Database query failed:", error);
        return res.status(500).json({ message: "Database query failed", error: error.message });
    }
},



    // update data
updateDriverLicense: async (req, res) => {
    const { id } = req.params;  // Fixed: 'params' instead of 'parame'
    const {
        license_number,
        issued_date,
        expiry_date,
        license_type_id,
        issuing_authority,
        status
    } = req.body;

    const parame = {
        license_number,
        issued_date,
        expiry_date,
        license_type_id,
        issuing_authority,
        status,
        id
    };

    // Fixed: Corrected the query syntax for 'license_number' 
    const query = `
        UPDATE driver_license SET
            license_number = @license_number,
            issued_date = @issued_date,
            expiry_date = @expiry_date,
            license_type_id = @license_type_id,
            issuing_authority = @issuing_authority,
            status = @status
        WHERE id_driver = @id
    `;

    try {
        const result = await executeQueryEmployeeAccessDB(query, parame);
        if (result && result.affectedRows > 0) {
            res.status(200).json({ message: "แก้ไขข้อมูลใบขับขี่สำเร็จ" });
        } else {
            res.status(400).json({ message: "ไม่สามารถเพิ่มข้อมูลใบขับขี่ได้" });
        }
    } catch (error) {
        console.error("Error updating driver license:", error); // Corrected the error message
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัพเดตข้อมูลใบขับขี่" });
    }
},



    deleteDriverLicense: async (req, res) => {
        const { id } = req.params; // ดึงค่า id จาก URL params
        console.log('Received ID:', id); // ตรวจสอบค่าที่รับมา
        const value = {id: id}; // ใช้ค่า id ใน array
    
        // ใช้ ? แทนการใช้ @id (สำหรับ MySQL, MariaDB)
        const query = `DELETE FROM driver_license WHERE id_driver = @id`;
        console.log('Query values:', value); // ตรวจสอบค่าที่จะส่งไปยัง query
    
        try {
            // การเรียก executeQueryEmployeeAccessDB
            const result = await executeQueryEmployeeAccessDB(query, value); 
            res.status(200).send("Driver license deleted successfully");
        } catch (error) {
            console.error("Error during query:", error); // แสดงข้อผิดพลาดในการ query
            res.status(500).send("Database query failed");
        }
    },
    
    

    

}


