const { executeQueryEmployeeAccessDB } = require('../../../config/db');


module.exports = {

    Vechicle_Delele : async (req, res) => {
        const {id} = req.params;

        try {
            const query = "DELETE FROM Truck_vehicle_registration WHERE reg_id = @reg_id ";
            const value = {id: id};
            const result = await executeQueryEmployeeAccessDB(query,value);
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