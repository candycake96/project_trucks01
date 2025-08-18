const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {

    systems_show_all: async (req, res) => {
        try {
            const query = `SELECT * FROM Truck_vehicle_systems`;

            const result = await executeQueryEmployeeAccessDB(query); // ต้องมี await
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in systems table" });
            }
        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    systems_add: async (req, res) => {
        try {
            const { system_name } = req.body;
            const values = { system_name: system_name };
            const query = `INSERT INTO Truck_vehicle_systems (system_name) VALUES (@system_name)`;

            const result = await executeQueryEmployeeAccessDB(query, values);

            if (result && result.affectedRows > 0) {
                res.status(200).json({ message: 'successfully' });
            } else {
                res.status(404).json({ message: "ไม่ได้" });
            }
        } catch (error) {
            console.error("Database query failed", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล อาจเกิดจากการทำซ้ำในช่วงเวลาเดียวกัน",
                error: error.message,
            });
        }
    },

    systems_update: async (req, res) => {
        try {
            const { id } = req.params;
            const { system_name } = req.body;
            const values = { system_name: system_name, system_id: id };
            const query = `UPDATE Truck_vehicle_systems SET system_name = @system_name WHERE system_id = @system_id`;

            const result = await executeQueryEmployeeAccessDB(query, values);

            if (result && result.affectedRows > 0) {
                res.status(200).json({ message: 'successfully' });
            } else {
                res.status(404).json({ message: "ไม่ได้" });
            }
        } catch (error) {
            console.error("Database query failed", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล อาจเกิดจากการทำซ้ำในช่วงเวลาเดียวกัน",
                error: error.message,
            });
        }
    },


    systems_delete: async (req, res) => {
        try {
            const { id } = req.params;
            const value = { system_id: id };
    
            const query_check = `SELECT * FROM Truck_vehicle_systems WHERE system_id = @system_id`;
            const check = await executeQueryEmployeeAccessDB(query_check, value);
    
            if (check.length === 0) {
                return res.status(404).json({ message: "ไม่พบข้อมูลระบบนี้" });
            }
    
            const query = `DELETE FROM Truck_vehicle_systems WHERE system_id = @system_id`;
            await executeQueryEmployeeAccessDB(query, value);
    
            res.status(200).json({ message: "ลบข้อมูลระบบเรียบร้อย" }); // แก้จาก .jsun เป็น .json
    
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการลบระบบ:", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
                error: error.message,
            });
        }
    }
    


}
