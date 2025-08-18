const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    setting_mainternance_item_show: async (req, res) => {
        try {
            const sql = `SELECT t.item_id, t.item_name, t.part_id, p.part_name
            FROM Truck_maintenance_items t
            JOIN Truck_vehicle_parts p ON p.part_id = t.part_id
            ORDER BY item_id ASC`;
            const result = await executeQueryEmployeeAccessDB(sql);

            res.status(200).json(result);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            res.status(500).json({
                success: false,
                message: "ไม่สามารถดึงข้อมูลรายการซ่อมบำรุงได้",
                error: error.message
            });
        }
    },


    setting_mainternance_item_add: async (req, res) => {
        try {
            const { item_name, part_id } = req.body;

            const sqlItem = `
        INSERT INTO Truck_maintenance_items ( item_name, part_id)
        VALUES ( @item_name, @part_id)
      `;
            const valueItem = {
                item_name: item_name,
                part_id: part_id
            };

            await executeQueryEmployeeAccessDB(sqlItem, valueItem);

            // ส่ง response กลับไปให้ client
            res.status(200).json({
                success: true,
                message: "เพิ่มรายการซ่อมบำรุงสำเร็จ"
            });
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);

            res.status(500).json({
                success: false,
                message: "ไม่สามารถเพิ่มรายการซ่อมบำรุงได้",
                error: error.message
            });
        }
    },



    setting_mainternance_item_update: async (req, res) => {
        try {

            const { item_name, part_id } = req.body;
            const { id } = req.params;

            const sql = `
        UPDATE Truck_maintenance_items
        SET item_name = @item_name, part_id = @part_id
        WHERE item_id = @item_id
      `;

            const values = {
                item_id: id,
                item_name: item_name,
                part_id: part_id
            };

            await executeQueryEmployeeAccessDB(sql, values);

            res.status(200).json({
                success: true,
                message: "อัปเดตรายการซ่อมบำรุงสำเร็จ"
            });
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอัปเดต:", error);
            res.status(500).json({
                success: false,
                message: "ไม่สามารถอัปเดตรายการซ่อมบำรุงได้",
                error: error.message
            });
        }
    },
    
};
