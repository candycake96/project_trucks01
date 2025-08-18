const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {

    parts_show_all: async (req, res) => {
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

    parts_add: async (req, res) => {
        
        try {
            const { system_id, part_name, part_code, unit, brand, model, price } = req.body;

            const query = `INSERT INTO Truck_vehicle_parts (
                system_id,
                part_name,
                part_code,
                unit,
                brand,
                model,
                price
            ) VALUES (
                @system_id,
                @part_name,
                @part_code,
                @unit,
                @brand,
                @model,
                @price
            ) ;`;
             const value = {
                system_id: system_id,
                part_name: part_name,
                part_code: part_code,
                unit: unit,
                brand: brand,
                model: model,
                price: price
             }

             
             const result =  await executeQueryEmployeeAccessDB(query, value);

             if (result && result.affectedRows > 0) {
                res.status(200).json({ message: 'successfully' });
            } else {
                res.status(404).json({ message: "ไม่สามารถเพิ่มข้อมูลได้" });
            }

        }catch (error) {
                        console.error("Database query failed", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล อาจเกิดจากการทำซ้ำในช่วงเวลาเดียวกัน",
                error: error.message,
            });
        }
    },


    parts_edit: async (req, res) => {
        
        try {
            const {id} = req.params;
            const { system_id, part_name, part_code, unit, brand, model, price } = req.body;

            const query = `UPDATE Truck_vehicle_parts SET 
                system_id = @system_id,
                part_name = @part_name,
                part_code = @part_code,
                unit = @unit,
                brand = @brand,
                model = @model,
                price = @price
                WHERE part_id = @part_id
             ;`;
             const value = {
                system_id: system_id,
                part_name: part_name,
                part_code: part_code,
                unit: unit,
                brand: brand,
                model: model,
                price: price,
                part_id: id
             }

             
             const result =  await executeQueryEmployeeAccessDB(query, value);

             if (result && result.affectedRows > 0) {
                res.status(200).json({ message: 'successfully' });
            } else {
                res.status(404).json({ message: "ไม่สามารถเพิ่มข้อมูลได้" });
            }

        }catch (error) {
                        console.error("Database query failed", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล อาจเกิดจากการทำซ้ำในช่วงเวลาเดียวกัน",
                error: error.message,
            });
        }
    },


    part_delete: async (req, res) => {
        try {
            const { id } = req.params;
            const value = { part_id: id };
    
            const query_check = `SELECT * FROM Truck_vehicle_parts WHERE part_id = @part_id`;
            const check = await executeQueryEmployeeAccessDB(query_check, value);
    
            if (check.length === 0) {
                return res.status(404).json({ message: "ไม่พบข้อมูลระบบนี้" });
            }
    
            const query = `DELETE FROM Truck_vehicle_parts WHERE part_id = @part_id`;
            await executeQueryEmployeeAccessDB(query, value);
    
            res.status(200).json({ message: "ลบข้อมูลระบบเรียบร้อย" }); // แก้จาก .jsun เป็น .json
    
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการลบระบบ:", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
                error: error.message,
            });
        }
    },


    // ค้นหาอะไหล่
    parts_search: async (req, res) => {
        try {
            const { system_id, part_name, part_code } = req.body;
            let sql = `SELECT             
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
                    INNER JOIN Truck_vehicle_systems s ON p.system_id = s.system_id WHERE 1=1`;
            const params = {};
            
            if (system_id && system_id !== '') {
                sql += ` AND p.system_id = @system_id`;
                params.system_id = system_id;
            }
            
            if (part_name && part_name !== '') {
                sql += ` AND p.part_name LIKE @part_name`;
                params.part_name = `%${part_name}%`;
            }
            
            if (part_code && part_code !== '') {
                sql += ` AND p.part_code LIKE @part_code`;
                params.part_code = `%${part_code}%`;
            }
            
            
    
            console.log("SQL:", sql);
            console.log("Params:", params);
    
            const results = await executeQueryEmployeeAccessDB(sql, params);
            res.status(200).json(results);
    
        } catch (error) {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: 'Unexpected server error' });
        }
    }
    
    



}
