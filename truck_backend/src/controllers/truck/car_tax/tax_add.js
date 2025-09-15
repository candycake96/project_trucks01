const path = require("path");
const fs = require("fs");
const { executeQueryEmployeeAccessDB } = require("../../../config/db");

module.exports = {
    tax_add: async (req, res) => {
        try {
            const { id } = req.params;

            // รับไฟล์
            const filetax = req.files?.tax_doc?.[0]?.filename || null;

            // รับข้อมูลจาก body
            const { price, tax_date_end } = req.body;

            const query = `
                INSERT INTO Truck_vehicle_tax (reg_id, price, tax_date_end, tax_doc)
                VALUES (@reg_id, @price, @tax_date_end, @tax_doc)
            `;

            const taxData = {
                reg_id: id,
                price: price ? parseFloat(price) : null, // ✅ แปลงเป็นตัวเลข
                tax_date_end: tax_date_end || null,
                tax_doc: filetax,
            };

            const result = await executeQueryEmployeeAccessDB(query, taxData);
            res.status(200).json({ message: "Insert successful", result });

        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },
};
