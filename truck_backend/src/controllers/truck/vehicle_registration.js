const { executeQuery } = require('../../config/db');

module.exports = {

    addVehicleRegistration: async (req, res) => {
        // Logic สำหรับเพิ่มข้อมูล
        const {
            reg_date, reg_number, province, car_type_id, chassis_number, usage_type, model_no,
            chassis_no, color, engine_brand, engine_no, cylinders, veh_weight, max_load, gross_weight,
            possession_date, operators, reg_doc, nation, addr, trans_type, license_no, license_expiry,
            rights_to_use, owner_name, address, passenger_count, file_download
        } = req.body; // แก้ไขจาก rep.body เป็น req.body

        const query = `INSERT INTO vehicle_registration (
            reg_date, reg_number, province, car_type_id, chassis_number, usage_type, model_no, 
            chassis_no, color, engine_brand, engine_no, cylinders, veh_weight, max_load, gross_weight,
            possession_date, operators, reg_doc, nation, addr, trans_type, license_no, license_expiry,
            rights_to_use, owner_name, address, passenger_count, file_download
            ) VALUES (
            @reg_date, @reg_number, @province, @car_type_id, @chassis_number, @usage_type, @model_no, 
            @chassis_no, @color, @engine_brand, @engine_no, @cylinders, @veh_weight, @max_load, @gross_weight,
            @possession_date, @operators, @reg_doc, @nation, @addr, @trans_type, @license_no, @license_expiry,
            @rights_to_use, @owner_name, @address, @passenger_count, @file_download
            )`;

        try {
            const result = await executeQuery(query, req.body); // ใช้ req.body เพื่อส่งค่าพารามิเตอร์
            res.status(200).json({ message: 'Vehicle registration added successfully' });
        } catch (error) {
            console.error("Error inserting vehicle registration:", error);
            res.status(500).json({ message: 'Error inserting vehicle registration' });
        }
    },


    deleteVehicleRegistration: async (req, res) => {
        // Logic สำหรับลบข้อมูล
        const { id } = req.params;
          // ตรวจสอบว่ามีการส่ง id มาหรือไม่
    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

        // 
        const selectQuery = `SElECT * FROM  vehicle_registration WHERE id_reg = @id`;
        const values = {id : id};

        try {
            const selectResult = await executeQuery(selectQuery, values);

            if(selectResult.length === 0 ) {
                return res.status(404).json({message: "vehicle registration not found"})
            }
            // ถ้ามีข้อมูลให้
            const deleteQuery = `DELETE FROM vehicle_registration WHERE id_reg = @id`
            await executeQuery(deleteQuery, values);

            res.status(200).json({message: "vehicle registration delete successfully"});
        } catch (error) {
            console.error(error);
            res.status(500).send("Database query failed");
        }    
    },


    updateVehicleRegistration: async (req, res) => {
        // Logic สำหรับแก้ไขข้อมูล
        const { id } = req.params;
        const  {
            reg_date, reg_number, province, car_type_id, chassis_number, usage_type, model_no,
            chassis_no, color, engine_brand, engine_no, cylinders, veh_weight, max_load, gross_weight,
            possession_date, operators, reg_doc, nation, addr, trans_type, license_no, license_expiry,
            rights_to_use, owner_name, address, passenger_count, file_download
        } = req.body;

        const values = {
            reg_date, reg_number, province, car_type_id, chassis_number, usage_type, model_no,
            chassis_no, color, engine_brand, engine_no, cylinders, veh_weight, max_load, gross_weight,
            possession_date, operators, reg_doc, nation, addr, trans_type, license_no, license_expiry,
            rights_to_use, owner_name, address, passenger_count, file_download,
            id 
        };

        const query = `UPDATE vehicle_registration 
        SET 
        reg_date = @reg_date, 
        reg_number = @reg_number, 
        province = @province, 
        car_type_id = @car_type_id, 
        chassis_number = @chassis_number, 
        usage_type = @usage_type, 
        model_no = @model_no,
        chassis_no = @chassis_no, 
        color = @color, 
        engine_brand = @engine_brand, 
        engine_no = @engine_no, 
        cylinders = @cylinders, 
        veh_weight = @veh_weight, 
        max_load = @max_load, 
        gross_weight = @gross_weight,
        possession_date = @possession_date, 
        operators = @operators, 
        reg_doc = @reg_doc, 
        nation = @nation, 
        addr = @addr, 
        trans_type = @trans_type, 
        license_no = @license_no, 
        license_expiry = @license_expiry,
        rights_to_use = @rights_to_use, 
        owner_name = @owner_name, 
        address = @address, 
        passenger_count = @passenger_count, 
        file_download = @file_download 
        WHERE  id_reg = @id `

        try {
            const result = await executeQuery(query, values);
            res.status(200).json({ message: "Car type updated successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).send("Database query failed");
        }
    },

    // ฟังก์ชันสำหรับดึงข้อมูลทั้งหมด
    getCarVehicleRegistration: async (req, res) => {
        const query = `SELECT * FROM vehicle_registration`;

        try {
            // เรียกใช้ฟังก์ชัน executeQuery เพื่อดึงข้อมูล
            const result = await executeQuery(query);

            if (result && result.length > 0) {
                res.status(200).json(result);  // ส่งข้อมูลในรูปแบบ JSON
            } else {
                res.status(404).json({ message: "No data found in vehicle_registration table" });
            }
        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).send("Database query failed");
        }
    }

};
