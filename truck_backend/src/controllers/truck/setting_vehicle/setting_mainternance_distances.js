const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    setting_mainternance_distances_show: async (req, res) => {
        try {
            const sql = `SELECT distance_id, distance_km FROM Truck_maintenance_distances ORDER BY distance_km ASC`;
            const result = await executeQueryEmployeeAccessDB(sql);
            res.status(200).json(result);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            res.status(500).json({
                success: false,
                message: "ไม่สามารถดึงข้อมูลระยะทางซ่อมบำรุงได้",
                error: error.message
            });
        }
    },


    setting_mainternance_distances_add: async (req, res) => {
        try {
            const { distance_km } = req.body;

            const sqlItem = `
        INSERT INTO Truck_maintenance_distances ( distance_km)
        VALUES ( @distance_km)
      `;
            const valueItem = {
                distance_km: distance_km
            };

            await executeQueryEmployeeAccessDB(sqlItem, valueItem);

            // ส่ง response กลับไปให้ client
            res.status(200).json({
                success: true,
                message: "เพิ่มรายการระยะทางบำรุงสำเร็จ"
            });
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);

            res.status(500).json({
                success: false,
                message: "ไม่สามารถเพิ่มรายการระยะทางบำรุงได้",
                error: error.message
            });
        }
    },



    setting_mainternance_distances_update: async (req, res) => {
        try {

            const { distance_id, distance_km } = req.body;
            const { id } = req.params; // รับรหัสพนักงานเพื่อเก็บ log

                const sql = `
                  UPDATE Truck_maintenance_items
                  SET distance_km = @distance_km
                  WHERE distance_id = @distance_id
                `;

            const values = {
                distance_id: distance_id,
                distance_km: distance_km
            };

            await executeQueryEmployeeAccessDB(sql, values);

            res.status(200).json({
                success: true,
                message: "อัปเดตรายการระยะทาบำรุงสำเร็จ"
            });
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอัปเดต:", error);
            res.status(500).json({
                success: false,
                message: "ไม่สามารถอัปเดตรายการระยะทาบำรุงได้",
                error: error.message
            });
        }
    },



};
