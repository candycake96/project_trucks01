const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {

    part_un_invoice: async (req, res) => {
        try {
            const query = `SELECT 
            p.part_id,
            p.system_id,
            p.part_name,
            p.part_code,
            p.description,
            p.unit,
            p.brand,
            p.model,
            p.price,
            p.created_at,
            s.system_name
            FROM Truck_vehicle_parts p
            INNER JOIN Truck_vehicle_systems s ON p.system_id = s.system_id
            `;

            const result = await executeQueryEmployeeAccessDB(query); // ต้องมี await
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in parts table" });
            }
        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

}