const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    tax_managment_show: async (req, res) => {
        const query = `
        SELECT t1.reg_id, CONVERT(VARCHAR, t1.tax_end, 23) AS tax_end_date, t1.reg_number, t2.car_type_name,
          CASE 
                WHEN t1.tax_end < GETDATE() THEN 'ทะเบียนหมดอายุ'
                WHEN t1.tax_end BETWEEN GETDATE() AND DATEADD(MONTH, 1, GETDATE()) THEN 'ทะเบียนใกล้หมดอายุ'
                ELSE 'ยังไม่หมดอายุ'
            END AS status
         FROM Truck_vehicle_registration t1
         INNER JOIN Truck_car_types t2 ON t1.car_type_id = t2.car_type_id
         WHERE tax_end <= DATEADD(DAY, 30, GETDATE()) AND status = 'active'
         ORDER BY tax_end_date DESC
         `;
        try {
            const result = await executeQueryEmployeeAccessDB(query);
            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in tax car table" });
            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    tax_managment_show_all: async (req, res) => {
        const query = `
        SELECT 
            t1.reg_id,
            CONVERT(VARCHAR, t1.tax_end, 23) AS tax_end_date, 
            t1.reg_number, 
            t2.car_type_name,
            CASE 
                WHEN t1.tax_end < GETDATE() THEN 'ทะเบียนหมดอายุ'
                WHEN t1.tax_end BETWEEN GETDATE() AND DATEADD(MONTH, 1, GETDATE()) THEN 'ทะเบียนใกล้หมดอายุ'
                ELSE 'ยังไม่หมดอายุ'
            END AS status
        FROM Truck_vehicle_registration t1
        INNER JOIN Truck_car_types t2 ON t1.car_type_id = t2.car_type_id
        WHERE status = 'active'
        ORDER BY tax_end_date DESC;
    `;
    
    try {
        const result = await executeQueryEmployeeAccessDB(query);
        if (result && result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No data found in tax car table" });
        }
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).json({ message: "Database query failed", error: error.message });
    }
    
    },

};


