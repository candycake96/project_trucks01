const { executeQueryEmployeeAccessDB } = require("../../../config/db");
const fs = require('fs');
const path = require('path');

module.exports = {
    act_delete: async (req, res) => {
        try {
            const { id } = req.params;

            // ดึงชื่อไฟล์เก่า (ถ้ามี)
            const querySelect = `SELECT act_doc FROM Truck_vehicle_act WHERE act_id = @act_id`;
            const resultSelect = await executeQueryEmployeeAccessDB(querySelect, { act_id: id });

            if (resultSelect.length > 0 && resultSelect[0].act_doc) {
                const filePath = path.join(__dirname, "../../../uploads/act_doc", resultSelect[0].act_doc);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // ลบไฟล์
            }

            // ลบข้อมูลจากฐานข้อมูล
            const queryDelete = `DELETE FROM Truck_vehicle_act WHERE act_id = @act_id`;
            await executeQueryEmployeeAccessDB(queryDelete, { act_id: id });

            res.status(200).json({ message: "ลบข้อมูลเรียบร้อยแล้ว" });

        } catch (error) {
            console.error("Error deleting act:", error);
            res.status(500).json({ message: "ลบข้อมูลไม่สำเร็จ", error: error.message });
        }
    },
};
