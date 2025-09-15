const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const fs = require('fs');
const path = require('path');

module.exports = {
    act_update: async (req, res) => {
        try {
            const { id } = req.params;
            const formData = req.body.formData ? JSON.parse(req.body.formData) : {};

            // ตรวจสอบว่ามีไฟล์ใหม่ถูกส่งมาหรือไม่
            const newFile = req.files?.act_doc?.[0]?.filename;

            // กำหนดค่าไฟล์ที่จะใช้: ถ้าไม่มีไฟล์ใหม่ ให้ใช้ไฟล์เดิม
            let fileact_doc = formData.act_doc || null;

            if (newFile) {
                // ถ้ามีไฟล์เก่าอยู่ และมีไฟล์ใหม่ ให้ลบไฟล์เก่า
                if (fileact_doc) {
                    const oldFilePath = path.join(__dirname, "../../../uploads/act_doc", fileact_doc);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                        console.log("ลบไฟล์เก่า:", fileact_doc);
                    }
                }
                fileact_doc = newFile; // ใช้ไฟล์ใหม่
            }
            // ถ้าไม่มีไฟล์ใหม่ ไม่ทำอะไรกับไฟล์เก่า

            const query = `
                UPDATE Truck_vehicle_act
                SET price = @price, act_date_end = @act_date_end, act_doc = @act_doc, act_date_start = @act_date_start
                WHERE act_id = @act_id
            `;

            const actData = {
                act_id: id,
                price: formData.price,
                act_date_start: formData.act_date_start,
                act_date_end: formData.act_date_end,
                act_doc: fileact_doc,
            };

            const result = await executeQueryEmployeeAccessDB(query, actData);
            res.status(200).json({ message: "Update successful", result });

        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },
};
