const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    branches_add_data: async (req, res) => {
        const { branch_name, company_id, branch_address } = req.body;
        const branch_status = "Active";
        try {
            const values = { branch_name, company_id, branch_address, branch_status };
            const query = `INSERT INTO branches (branch_name, company_id, branch_address, branch_status) VALUES (@branch_name, @company_id, @branch_address, @branch_status)`;
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            res.status(200).json({ message: 'เพิ่มสาขาสำเร็จ' });
        } catch (error) {
            console.error("Error inserting branches:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มสาขา' });
        }
    },

    branches_update_data: async (req, res) => {
        const { id }=req.params;
        const { branch_name, branch_address } = req.body;  // ควรรับค่า branch_id ด้วย
        try {
            const query = `UPDATE branches SET 
                branch_name = @branch_name, 
                branch_address = @branch_address
            WHERE id_branch = @branch_id`;  // เพิ่มเงื่อนไข WHERE
            
            const values = { branch_id: id, branch_name, branch_address }; // เปลี่ยนจาก value เป็น values
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            res.status(200).json({ message: 'อัปเดตสาขาสำเร็จ' });  // แก้ข้อความ Response
        } catch (error) {
            console.error("Error updating branch:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสาขา' });
        }
    },

    branches_update_status: async (req, res) => {
        const { id } = req.params;
        const branch_status = "Inactive"; // Correct status value
    
        try {
            const query = `UPDATE branches SET 
                branch_status = @branch_status
                WHERE id_branch = @branch_id`; // Removed extra comma
    
            const values = { branch_status, branch_id: id }; // Corrected parameter names
    
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            if (result.affectedRows > 0) {
                res.status(200).json({ message: "อัปเดตสาขาสำเร็จ" });
            } else {
                res.status(404).json({ message: "ไม่พบสาขาที่ต้องการอัปเดต" });
            }
        } catch (error) {
            console.error("Error updating branch:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสาขา" });
        }
    },
    
    
    
}