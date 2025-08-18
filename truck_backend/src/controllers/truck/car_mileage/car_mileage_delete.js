const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    car_mileage_delete: async (req, res) => {
        const {id} = req.params;
        // ตรวจสอบว่า id ถูกส่งมา
        if (!id) {
            return res.status(400).json({ message: 'กรุณาระบุ ID ที่ต้องการลบ' });
        }
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูลจากตาราง 
            const query = `DELETE FROM Truck_car_mileage WHERE id = @id`;

            // ระบุค่าของ id ในคำสั่ง SQL
            const values = { id: id };
    
            // เรียกใช้ executeQueryEmployeeAccessDB เพื่อประมวลผลคำสั่ง SQL
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            // ถ้ามีการลบข้อมูลสำเร็จ
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'ข้อมูลถูกลบเรียบร้อยแล้ว' });
            } else {
                // หากไม่พบข้อมูลในตาราง
                console.warn("⚠️ ไม่พบข้อมูลที่ตรงกับ ID ที่ต้องการลบ");
                res.status(404).json({ message: "ไม่พบข้อมูลที่ตรงกับ ID ที่ต้องการลบ" });
            }

        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "ไม่สามารถลบข้อมูลได้", error: error.message });
        }
    }
};
