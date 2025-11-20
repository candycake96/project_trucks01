const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {

    mainternance_completed_show: async (req, res) => {
        try {
            const query = `
 SELECT r1.*, 
c.close_id,
c.close_date,
c.close_remark,
v.reg_number
FROM Truck_repair_requests r1
INNER JOIN Truck_repair_close c ON c.request_id =  r1.request_id
INNER JOIN Truck_vehicle_registration v ON v.reg_id = r1.reg_id
WHERE r1.status = N'ซ่อมสำเร็จ'
AND Month(c.close_date) = Month(GETDATE());                       

            `;

            const result = await executeQueryEmployeeAccessDB(query); // ต้องมี await
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in  table" });
            }
        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    mainternance_pending_show: async (req, res) => {
        try {
            const query = `
SELECT 
    r1.*
FROM Truck_repair_requests AS r1
WHERE r1.status NOT IN (N'ซ่อมสำเร็จ', N'ยกเลิกงาน')
ORDER BY r1.created_at DESC;

;                       

            `;

            const result = await executeQueryEmployeeAccessDB(query); // ต้องมี await
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in  table" });
            }
        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },


}
