const path = require("path");
const fs = require("fs");
const { executeQueryEmployeeAccessDB } = require("../../../config/db");

module.exports = {
    tax_details: async (req, res) => {
        try {
            const { id } = req.params;
            const sql = `
                SELECT * 
                FROM Truck_vehicle_tax 
                WHERE reg_id = @reg_id 
                ORDER BY tax_date_end ASC
            `;
            const value = { reg_id: id };
            const result = await executeQueryEmployeeAccessDB(sql, value);

            if (result && result.length > 0) {
                const fileUrl = result.map(regTax => ({
                    ...regTax,
                    tax_doc: regTax.tax_doc
                        ? `${req.protocol}://${req.get("host")}/api/uploads/tax_doc/${regTax.tax_doc}`
                        : null,
                }));

                // ✅ ส่งข้อมูลทั้งหมด ไม่ใช่แค่แถวแรก
                res.status(200).json(fileUrl);
            } else {
                res.status(404).json({ message: "No tax data found for this vehicle" });
            }

        } catch (error) {
            console.error("Error fetching tax details:", error);
            res.status(500).json({ message: "Error fetching tax details", error: error.message });
        }
    },
};
