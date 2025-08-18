const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    car_mileage_update: async (req, res) => {
        const { id } = req.params;
        const { reg_id, emp_id, recorded_date, odometer, notes, status } = req.body;
    
        // ตรวจสอบว่า ID ถูกส่งมาหรือไม่
        if (!id) {
            return res.status(400).json({ message: "กรุณาระบุ ID ที่ต้องการแก้ไข" });
        }
    
        try {
            // คำสั่ง SQL สำหรับอัปเดตข้อมูล
            const query = `
            UPDATE Truck_car_mileage 
            SET 
                reg_id = @reg_id, 
                emp_id = @emp_id, 
                recorded_date = @recorded_date, 
                odometer = @odometer, 
                notes = @notes, 
                status = @status,
                updated_at = GETDATE()  
            WHERE id = @id
        `;
        
    
            const values = {
                id,
                reg_id,
                emp_id,
                recorded_date,
                odometer,
                notes,
                status
            };
    
            // ประมวลผลคำสั่ง SQL
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            if (result.affectedRows > 0) {
                res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จ!" });
            } else {
                console.warn("⚠️ ไม่พบข้อมูลที่ต้องการแก้ไข");
                res.status(404).json({ message: "ไม่พบข้อมูลที่ตรงกับ ID ที่ต้องการแก้ไข" });
            }
        } catch (error) {
            console.error("❌ Database update failed:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล", error: error.message });
        }
    }
    
};
