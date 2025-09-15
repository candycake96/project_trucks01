const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const fs = require('fs');
const path = require('path');

module.exports = {
    tax_update: async (req, res) => {
        try {
            const { id } = req.params;
            const formData = req.body.formData ? JSON.parse(req.body.formData) : {};

            // ตรวจสอบว่ามีไฟล์ใหม่ถูกส่งมาหรือไม่
            const newFile = req.files?.tax_doc?.[0]?.filename;

            // กำหนดค่าไฟล์ที่จะใช้: ถ้าไม่มีไฟล์ใหม่ ให้ใช้ไฟล์เดิม
            let fileTax_doc = formData.tax_doc || null;

            if (newFile) {
                // ถ้ามีไฟล์เก่าอยู่ และมีไฟล์ใหม่ ให้ลบไฟล์เก่า
                if (fileTax_doc) {
                    const oldFilePath = path.join(__dirname, "../../../uploads/tax_doc", fileTax_doc);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                        console.log("ลบไฟล์เก่า:", fileTax_doc);
                    }
                }
                fileTax_doc = newFile; // ใช้ไฟล์ใหม่
            }
            // ถ้าไม่มีไฟล์ใหม่ ไม่ทำอะไรกับไฟล์เก่า

            const query = `
                UPDATE Truck_vehicle_tax
                SET price = @price, tax_date_end = @tax_date_end, tax_doc = @tax_doc
                WHERE tax_id = @tax_id
            `;

            const taxData = {
                tax_id: id,
                price: formData.price,
                tax_date_end: formData.tax_date_end,
                tax_doc: fileTax_doc,
            };

            const result = await executeQueryEmployeeAccessDB(query, taxData);
            res.status(200).json({ message: "Update successful", result });

        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },
};
