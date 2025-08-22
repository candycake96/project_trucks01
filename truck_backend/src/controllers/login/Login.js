const { executeQueryEmployeeAccessDB } = require('../../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../jwt/AuthToken');

module.exports = {
    loginTruck: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'กรุณากรอก email และ password' });
        }

        // ✅ แก้ query ให้รองรับ SQL Server 2012 (แทน STRING_AGG)
        const userQuery = `
        SELECT 
            e.id_emp, e.email, e.fname, e.lname, e.nickname, e.gender, 
            e.date_job, e.id_branch, e.id_department, e.id_position, 
            e.identification_number, e.phone, e.status, p.password, 
            e.company_id, p1.name_position, d.name_department,
            -- ใช้ STUFF + FOR XML PATH แทน STRING_AGG
            STUFF((
                SELECT ',' + CAST(er2.role_id AS VARCHAR)
                FROM employee_roles er2
                WHERE er2.id_emp = e.id_emp
                FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
            , 1, 1, '') AS roles
        FROM employees e
        JOIN password p ON e.id_emp = p.id_emp
        JOIN positions p1 ON p1.id_position = e.id_position
        JOIN departments d ON d.id_department = e.id_department
        WHERE e.email = @email
        GROUP BY 
            e.id_emp, e.email, e.fname, e.lname, e.nickname, e.gender,
            e.date_job, e.id_branch, e.id_department, e.id_position,
            e.identification_number, e.phone, e.status, p.password,
            e.company_id, p1.name_position, d.name_department
        `;

        const permissionQuery = `
        SELECT 
            epa.permission_code,
            f.menu_id,
            f.name AS function_name,
            f.function_id,
            f.code AS function_code,
            s.name AS submenu_name,
            s.module_id,
            m.name AS module_name
        FROM employee_permission_access epa
        LEFT JOIN permission_functions f ON epa.permission_code = f.code
        JOIN permission_submenus s ON f.menu_id = s.menu_id 
        JOIN permission_modules m ON s.module_id = m.module_id 
        WHERE epa.emp_id = @emp_id
        ORDER BY m.module_id, f.menu_id 
        `;

        try {
            const users = await executeQueryEmployeeAccessDB(userQuery, { email });
            if (users.length === 0) {
                return res.status(404).json({ message: 'ไม่พบข้อมูลพนักงานนี้' });
            }

            const user = users[0];
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
            }

            const accessResult = await executeQueryEmployeeAccessDB(permissionQuery, { emp_id: user.id_emp });
            
            const groupedModules = {};

            accessResult.forEach(row => {
                const {
                    module_id,
                    module_name,
                    submenu_id,
                    submenu_name,
                    permission_code
                } = row;

                if (!groupedModules[module_id]) {
                    groupedModules[module_id] = {
                        module_id,
                        module_name,
                        permission_codes: new Set(),
                        submenus: new Map(),
                    };
                }

                if (permission_code) {
                    groupedModules[module_id].permission_codes.add(permission_code);
                }

                if (submenu_id && submenu_name && !groupedModules[module_id].submenus.has(submenu_id)) {
                    groupedModules[module_id].submenus.set(submenu_id, {
                        submenu_id,
                        submenu_name,
                    });
                }
            });

            const uniqueModules = Object.values(groupedModules).map(mod => ({
                module_id: mod.module_id,
                module_name: mod.module_name,
                permission_codes: Array.from(mod.permission_codes),
                submenus: Array.from(mod.submenus.values())
            }));

            const token = generateToken({ id_emp: user.id_emp }, '12h');

            res.status(200).json({
                status: "ok",
                message: "Logged in",
                accessToken: token,
                user: {
                    id_emp: user.id_emp,
                    email: user.email,
                    fname: user.fname,
                    lname: user.lname,
                    start_work: user.date_job,
                    status: user.status,
                    company_id: user.company_id,
                    roles: user.roles,
                    position_name: user.name_position,
                    department_name: user.name_department,
                    permission_codes: accessResult.map(r => r.permission_code).filter(Boolean),
                    module_name: uniqueModules,
                }
            });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
        }

    }
};
