const fs = require('fs');
const path = require('path');
const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    car_insurance_delete: async (req, res) => {
        try {
            const { id } = req.params;

            // 1. ดึงข้อมูลไฟล์ก่อน
            const query = `
                SELECT insurance_file 
                FROM Truck_car_insurance 
                WHERE insurance_id = @insurance_id
            `;
            const value = { insurance_id: id };

            const result = await executeQueryEmployeeAccessDB(query, value);

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "Insurance not found" });
            }

            const insuranceFile = result[0].insurance_file;
            
            // 2. ถ้ามีชื่อไฟล์ => ลบไฟล์ในโฟลเดอร์
            if (insuranceFile) {
                const filePath = path.join(__dirname, '../upload/insurance_doc', insuranceFile); // ปรับ path

                // ตรวจสอบว่ามีไฟล์อยู่จริงก่อนลบ
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // ลบไฟล์
                    console.log("📁 Deleted file:", insuranceFile);
                } else {
                    console.log("⚠️ File not found:", filePath);
                }
            }

            // 3. ลบข้อมูลจากฐานข้อมูล (ถ้าต้องการ)
            const deleteQuery = `
                DELETE FROM Truck_car_insurance 
                WHERE insurance_id = @insurance_id
            `;
            await executeQueryEmployeeAccessDB(deleteQuery, value);

            res.status(200).json({ success: true, message: "Insurance and file deleted successfully" });

        } catch (error) {
            console.error("Error deleting insurance:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};
