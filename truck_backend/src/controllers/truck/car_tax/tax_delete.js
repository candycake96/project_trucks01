const { executeQueryEmployeeAccessDB } = require("../../../config/db");
const fs = require('fs');
const path = require('path');

module.exports = {
    tax_delete: async (req, res) => {
        try {
            const { id } = req.params;

            // ดึงชื่อไฟล์เก่า (ถ้ามี)
            const querySelect = `SELECT tax_doc FROM Truck_vehicle_tax WHERE tax_id = @tax_id`;
            const resultSelect = await executeQueryEmployeeAccessDB(querySelect, { tax_id: id });

            if (resultSelect.length > 0 && resultSelect[0].tax_doc) {
                const filePath = path.join(__dirname, "../../../uploads/tax_doc", resultSelect[0].tax_doc);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // ลบไฟล์
            }

            // ลบข้อมูลจากฐานข้อมูล
            const queryDelete = `DELETE FROM Truck_vehicle_tax WHERE tax_id = @tax_id`;
            await executeQueryEmployeeAccessDB(queryDelete, { tax_id: id });

            res.status(200).json({ message: "ลบข้อมูลเรียบร้อยแล้ว" });

        } catch (error) {
            console.error("Error deleting tax:", error);
            res.status(500).json({ message: "ลบข้อมูลไม่สำเร็จ", error: error.message });
        }
    },
};
