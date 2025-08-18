const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    depastment_add_data: async (req, res) => {
        const { name_department, company_id } = req.body;
        const department_status = "Active";
        try {
            const values = { name_department, company_id, department_status };
            const query = `INSERT INTO departments (name_department, company_id, department_status) VALUES (@name_department, @company_id, @department_status)`;
            const result = await executeQueryEmployeeAccessDB(query, values);
            
            res.status(200).json({ message: 'เพิ่มแผนกสำเร็จ' });
        } catch (error) {
            console.error("Error inserting departments:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มแผนก' });
        }
    },

    depastment_update_data: async (req, res) => {
        const { id }=req.params;
        const { name_department } = req.body;  // ควรรับค่า branch_id ด้วย
        try {
            const query = `UPDATE departments SET 
            name_department = @name_department 
        WHERE id_department = @id_department`;  // เพิ่มเงื่อนไข WHERE
            
            const values = { id_department: id, name_department }; // เปลี่ยนจาก value เป็น values
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            res.status(200).json({ message: 'อัปเดตแผนกสำเร็จ' });  // แก้ข้อความ Response
        } catch (error) {
            console.error("Error updating department:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตแผนก' });
        }
    },

    depastment_update_status: async (req, res) => {
        const { id }=req.params;
        const department_status = "Inactive";
        try {
            const query = `UPDATE departments SET 
                department_status = @department_status
            WHERE id_department = @id_department`;  // เพิ่มเงื่อนไข WHERE
            
            const values = { department_status, id_department: id }; // เปลี่ยนจาก value เป็น values
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            res.status(200).json({ message: 'อัปเดตสาขาสำเร็จ' });  // แก้ข้อความ Response
        } catch (error) {
            console.error("Error updating department_status:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสาขา' });
        }
    }
    
    
}