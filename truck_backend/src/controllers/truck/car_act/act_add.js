const path = require("path");
const fs = require("fs");
const { executeQueryEmployeeAccessDB } = require("../../../config/db");

module.exports = {
    act_add: async (req, res) => {
        try {
            const { id } = req.params;

            // รับไฟล์
            const fileact = req.files?.act_doc?.[0]?.filename || null;

            // รับข้อมูลจาก body
            const { price, act_date_end, act_date_start } = req.body;

            const query = `
                INSERT INTO Truck_vehicle_act (reg_id, price, act_date_start, act_date_end, act_doc)
                VALUES (@reg_id, @price, @act_date_start, @act_date_end, @act_doc)
            `;

            const actData = {
                reg_id: id,
                price: price ? parseFloat(price) : null, // ✅ แปลงเป็นตัวเลข
                act_date_start: act_date_start || null,
                act_date_end: act_date_end || null,
                act_doc: fileact,
            };

            const result = await executeQueryEmployeeAccessDB(query, actData);
            res.status(200).json({ message: "Insert successful", result });

        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },
};
