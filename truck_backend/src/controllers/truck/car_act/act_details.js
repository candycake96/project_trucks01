const path = require("path");
const fs = require("fs");
const { executeQueryEmployeeAccessDB } = require("../../../config/db");

module.exports = {
    act_details: async (req, res) => {
        try {
            const { id } = req.params;
            const sql = `
                SELECT * 
                FROM Truck_vehicle_act 
                WHERE reg_id = @reg_id 
                ORDER BY act_date_end ASC
            `;
            const value = { reg_id: id };
            const result = await executeQueryEmployeeAccessDB(sql, value);

            if (result && result.length > 0) {
                const fileUrl = result.map(regact => ({
                    ...regact,
                    act_doc: regact.act_doc
                        ? `${req.protocol}://${req.get("host")}/api/uploads/act_doc/${regact.act_doc}`
                        : null,
                }));

                // ✅ ส่งข้อมูลทั้งหมด ไม่ใช่แค่แถวแรก
                res.status(200).json(fileUrl);
            } else {
                res.status(404).json({ message: "No act data found for this vehicle" });
            }

        } catch (error) {
            console.error("Error fetching act details:", error);
            res.status(500).json({ message: "Error fetching act details", error: error.message });
        }
    },
};
