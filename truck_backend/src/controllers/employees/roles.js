const { executeQueryEmployeeAccessDB } = require('../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    getRoles: async (req, res) => {
        const query = `SELECT * FROM Roles`;

        try {
            const result = await executeQueryEmployeeAccessDB(query);

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

    
    updateemployeeroles: async (req, res) => {
        const { id_emp } = req.params;
        const { selectedRoles } = req.body; // รับรายการที่ถูกติ๊กจาก Frontend
    
        if (!Array.isArray(selectedRoles)) {
            return res.status(400).json({ message: "Invalid data format for selectedRoles" });
        }
    
        try {
            // ดึงรายการสิทธิ์ทั้งหมดของพนักงานจากฐานข้อมูล
            const empRolesQuery = `
                SELECT role_id 
                FROM Employee_Roles 
                WHERE id_emp = @id_emp
            `;
            const empRolesResult = await executeQueryEmployeeAccessDB(empRolesQuery, { id_emp });
            const empRoles = empRolesResult.map((row) => row.role_id);
    
            // คำนวณรายการที่ต้องลบ (สิทธิ์ในฐานข้อมูลแต่ไม่ได้ถูกติ๊ก)
            const rolesToRemove = empRoles.filter((role) => !selectedRoles.includes(role));
    
            // ลบรายการที่ไม่ได้ถูกติ๊กออกจากฐานข้อมูล
            if (rolesToRemove.length > 0) {
                const deleteQuery = `
                    DELETE FROM Employee_Roles
                    WHERE id_emp = @id_emp AND role_id IN (${rolesToRemove.map((_, i) => `@roleId${i}`).join(",")})
                `;
    
                const deleteParams = rolesToRemove.reduce(
                    (acc, roleId, index) => ({ ...acc, [`roleId${index}`]: roleId }),
                    { id_emp }
                );
    
                await executeQueryEmployeeAccessDB(deleteQuery, deleteParams);
            }
    
            // เพิ่มรายการที่ถูกติ๊กใหม่
            const rolesToAdd = selectedRoles.filter((role) => !empRoles.includes(role));
            if (rolesToAdd.length > 0) {
                const addQuery = `
                    INSERT INTO Employee_Roles (id_emp, role_id)
                    VALUES ${rolesToAdd.map((_, i) => `(@id_emp, @roleId${i})`).join(",")}
                `;
    
                const addParams = rolesToAdd.reduce(
                    (acc, roleId, index) => ({ ...acc, [`roleId${index}`]: roleId }),
                    { id_emp }
                );
    
                await executeQueryEmployeeAccessDB(addQuery, addParams);
            }
    
            res.status(200).json({ message: "Roles updated successfully" });
        } catch (error) {
            console.error("Error updating roles:", error);
            res.status(500).json({ message: "Error updating roles", error: error.message });
        }
    },
    
    
    

}