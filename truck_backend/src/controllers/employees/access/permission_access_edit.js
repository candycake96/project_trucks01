const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {
    permission_access_deit: async (req, res) => {
        const { id } = req.params;
        const { permission_codes } = req.body; // เช่น ['VIEW', 'EDIT']
console.log("test: ", id)
console.log("test: ", permission_codes)
console.log("Are they array?", Array.isArray(permission_codes));
        if (!Array.isArray(permission_codes)) {
            return res.status(400).json({ message: 'permission_codes must be an array' });
        }

        try {
console.log("Incoming permission_codes:", permission_codes);
console.log("Are they array?", Array.isArray(permission_codes));
            
            // 1. ดึงสิทธิ์ปัจจุบันจาก DB
            const currentQuery = `SELECT permission_code FROM employee_permission_access WHERE emp_id = @emp_id`;
            const currentResult = await executeQueryEmployeeAccessDB(currentQuery, { emp_id: id });

            const currentPermissions = currentResult.map(row => row.permission_code);
            console.log('currentPermissions : ', currentPermissions);

            // 2. เปรียบเทียบ: หา permission ที่ต้องเพิ่ม
            const permissionsToAdd = permission_codes.filter(code => !currentPermissions.includes(code));

            // 3. เปรียบเทียบ: หา permission ที่ต้องลบ
            const permissionsToRemove = currentPermissions.filter(code => !permission_codes.includes(code));

            // 4. ลบที่ไม่ต้องการ
            if (permissionsToRemove.length > 0) {
                const deleteQuery = `
                    DELETE FROM employee_permission_access
                    WHERE emp_id = @emp_id AND permission_code IN (${permissionsToRemove.map((_, i) => `@del${i}`).join(', ')})
                `;
                const delParams = { emp_id: id };
                permissionsToRemove.forEach((code, i) => {
                    delParams[`del${i}`] = code;
                });
                await executeQueryEmployeeAccessDB(deleteQuery, delParams);
            }

            // 5. เพิ่มที่ยังไม่มี
            if (permissionsToAdd.length > 0) {
                const insertQuery = `
                    INSERT INTO employee_permission_access (emp_id, permission_code)
                    VALUES ${permissionsToAdd.map((_, i) => `(@emp_id, @add${i})`).join(', ')}
                `;
                const addParams = { emp_id: id };
                permissionsToAdd.forEach((code, i) => {
                    addParams[`add${i}`] = code;
                });
                await executeQueryEmployeeAccessDB(insertQuery, addParams);
            }

            return res.status(200).json({
                message: 'Permissions updated successfully',
                added: permissionsToAdd,
                removed: permissionsToRemove
            });

        } catch (error) {
            console.error('Error updating permission access:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};




