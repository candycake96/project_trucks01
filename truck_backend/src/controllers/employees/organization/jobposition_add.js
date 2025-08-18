const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    positions_add_data: async (req, res) => {
        const { name_position, company_id } = req.body;
        const position_status = "Active";

        try {
            const values = { name_position, company_id, position_status };
            const query = `INSERT INTO positions (name_position, company_id, position_status) VALUES (@name_position, @company_id, @position_status)`;
            const result = await executeQueryEmployeeAccessDB(query, values);
            
            res.status(200).json({ message: 'เพิ่มแผนกสำเร็จ' });
        } catch (error) {
            console.error("Error inserting positions:", error);
         }
    },

    positions_update_data: async (req, res) => {
        const { id }=req.params;
        const { name_position } = req.body;  // ควรรับค่า branch_id ด้วย
        if (!name_position) {
            return res.status(400).json({ message: "Name position is required" });
          }
        try {
            const query = `UPDATE positions SET 
                name_position = @name_position
            WHERE id_position = @id_position`;  // เพิ่มเงื่อนไข WHERE
            
            const values = { id_position: id, name_position}; // เปลี่ยนจาก value เป็น values
            const result = await executeQueryEmployeeAccessDB(query, values);
            if (!result) {
                return res.status(404).json({ message: "Job position not found" });
              }
            res.status(200).json({ message: 'อัปเดตแผนกสำเร็จ' });  // แก้ข้อความ Response
        } catch (error) {
            console.error("Error updating position:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตแผนก' });
        }
    },

    positions_update_status: async (req, res) => {
        const { id }=req.params;
        const position_status = "Inactive";
        try {
            const query = `UPDATE positions SET 
                position_status = @position_status
            WHERE id_position = @id_position`;  // เพิ่มเงื่อนไข WHERE
            
            const values = { position_status, id_position : id }; // เปลี่ยนจาก value เป็น values
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            res.status(200).json({ message: 'อัปเดตสาขาสำเร็จ' });  // แก้ข้อความ Response
        } catch (error) {
            console.error("Error updating position_status:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสาขา' });
        }
    }
    
    
}