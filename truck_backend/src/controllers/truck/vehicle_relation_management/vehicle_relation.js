const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

vehicle_relation_shows: async (req, res) => {
    let { reg_id, car_type_id } = req.params;
    car_type_id = Number(car_type_id); // แปลงค่าเป็นตัวเลข

    try {
        console.log('test data error : ', reg_id, ' ', car_type_id);

        let query = ""; // กำหนดค่าเริ่มต้น

        if (car_type_id === 1) {
            query = `SELECT p.*,v1.reg_number AS reg_number_1, v2.reg_number AS reg_number_2
            FROM Truck_vehicle_pairing p
            INNER JOIN Truck_vehicle_registration v1 ON p.reg_id_1 = v1.reg_id
            INNER JOIN Truck_vehicle_registration v2 ON p.reg_id_2 = v2.reg_id
            WHERE reg_id_1 = @reg_id AND end_date IS NULL`;
        } else if (car_type_id === 2) {
            query = `SELECT p.*,v1.reg_number AS reg_number_1, v2.reg_number AS reg_number_2
            FROM Truck_vehicle_pairing p
            INNER JOIN Truck_vehicle_registration v1 ON p.reg_id_1 = v1.reg_id
            INNER JOIN Truck_vehicle_registration v2 ON p.reg_id_2 = v2.reg_id
            WHERE reg_id_2 = @reg_id AND end_date IS NULL`;
        } else {
            return res.status(400).json({ message: "Invalid car_type_id" });
        }

        const values = { reg_id: reg_id };
        const result = await executeQueryEmployeeAccessDB(query, values);

        if (result && result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No data found in Truck_vehicle_pairing table" });
        }
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).json({ message: "Database query failed", error: error.message });
    }
},


    vehicle_relation_add: async (req, res) => {
        const { car_type_id, reg_number, reg_id_1 } = req.body; // รับ reg_id_1 จาก body
        let queryReg = "";
        let queryCar = "";
        let queryRelation = "";

        // ตรวจสอบค่า car_type_id
        if (car_type_id === 1) {
            queryReg = `SELECT * FROM Truck_vehicle_registration WHERE reg_number = @reg_number AND car_type_id = 2`;
            queryCar = `SELECT * FROM Truck_vehicle_pairing WHERE reg_id_2 = @reg_id_2 AND end_date IS NULL`;
            queryRelation = `INSERT INTO Truck_vehicle_pairing (reg_id_1, reg_id_2, start_date) VALUES (@reg_id_1, @reg_id_2, @start_date) `;
        } else if (car_type_id === 2) {
            queryReg = `SELECT * FROM Truck_vehicle_registration WHERE reg_number = @reg_number AND car_type_id = 1`;
            queryCar = `SELECT * FROM Truck_vehicle_pairing WHERE reg_id_1 = @reg_id_1 AND end_date IS NULL`;
            queryRelation = `INSERT INTO Truck_vehicle_pairing (reg_id_1, reg_id_2, start_date) VALUES (@reg_id_1, @reg_id_2, @start_date) `;
        } else {
            return res.status(402).json({ message: "Invalid car_type_id" });
        }

        try {
            // ใช้ queryReg เพื่อค้นหาข้อมูลการจดทะเบียนรถ
            const valuesReg = { reg_number };
            const resultReg = await executeQueryEmployeeAccessDB(queryReg, valuesReg);

            if (resultReg && resultReg.length > 0) {
                // ดึงข้อมูล reg_id จากผลลัพธ์ที่ได้
                const reg_id = resultReg[0].reg_id;

                // ตรวจสอบว่ารถคันที่จับคู่มีอยู่ในตาราง Truck_vehicle_pairing หรือไม่
                let valuesCar;
                if (car_type_id === 1) {
                    // car_type_id = 1 (หมายถึงเป็นรถที่ car_type_id = 2) => ใช้ reg_id_2
                    valuesCar = { reg_id_2: reg_id }; // ใช้ reg_id จากผลลัพธ์ที่ได้
                } else {
                    // car_type_id = 2 (หมายถึงเป็นรถที่ car_type_id = 1) => ใช้ reg_id_1
                    valuesCar = { reg_id_1: reg_id }; // ใช้ reg_id จากผลลัพธ์ที่ได้
                }

                const resultCar = await executeQueryEmployeeAccessDB(queryCar, valuesCar);

                if (resultCar && resultCar.length > 0) {
                    // ถ้ามีการจับคู่แล้ว ก็ส่งกลับข้อความว่า "Already paired"
                    res.status(400).json({ message: "Vehicle already paired // ข้อมูลถูกให้งานแล้วหรือทะเบียนที่กรอกอาจผิดพลาดกรุณาตรวจสอบอีกครั้ง" });
                } else {
                    // ถ้ายังไม่มีการจับคู่ จะใช้ reg_id_1 และ reg_id ที่ได้มา
                    const valuesRelation = {
                        reg_id_1: car_type_id === 1 ? reg_id_1 : reg_id, // ถ้า car_type_id = 1 ให้ reg_id_1 เป็นค่าที่ส่งมา
                        reg_id_2: car_type_id === 1 ? reg_id : reg_id_1, // ถ้า car_type_id = 1 ให้ reg_id_2 เป็น reg_id ที่ดึงมา
                        start_date: new Date(),
                    };

                    await executeQueryEmployeeAccessDB(queryRelation, valuesRelation);
                    res.status(200).json({ message: "Vehicle pairing successful || จับคู่ยานพาหนะสำเร็จ" });
                }
            } else {
                res.status(404).json({ message: "Vehicle registration not found" });
            }
        } catch (error) {
            console.error("Database query failed", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    vehicle_relation_delete: async (req, res) => {
        const {id} = req.params;
        // ตรวจสอบว่า id ถูกส่งมา
        if (!id) {
            return res.status(400).json({ message: 'กรุณาระบุ ID ที่ต้องการลบ' });
        }
    
        try {
            const query = `DELETE FROM Truck_vehicle_pairing WHERE pair_id = @pair_id`
        // ระบุค่าของ id ในคำสั่ง SQL
        const values = { pair_id: id };
    
        // เรียกใช้ executeQueryEmployeeAccessDB เพื่อประมวลผลคำสั่ง SQL
        const result = await executeQueryEmployeeAccessDB(query, values);

        // ถ้ามีการลบข้อมูลสำเร็จ
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'ข้อมูลถูกลบเรียบร้อยแล้ว' });
        } else {
            // หากไม่พบข้อมูลในตาราง
            console.warn("⚠️ ไม่พบข้อมูลที่ตรงกับ ID ที่ต้องการลบ");
            res.status(404).json({ message: "ไม่พบข้อมูลที่ตรงกับ ID ที่ต้องการลบ" });
        }
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).json({ message: "ไม่สามารถลบข้อมูลได้", error: error.message });
    }
},

};




