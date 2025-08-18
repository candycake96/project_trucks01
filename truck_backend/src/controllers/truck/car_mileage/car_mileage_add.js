const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    car_mileage_add_incorrect: async (req, res) => {
        const { reg_id, emp_id, recorded_date, odometer, notes } = req.body;
        const values = { reg_id: reg_id };

        try {
            
            // ค้นหาข้อมูลเลขไมล์ล่าสุดของรถ
            const latestRecordQuery = "SELECT TOP 1 true_odometer, odometer FROM Truck_car_mileage WHERE reg_id = @reg_id ORDER BY recorded_date DESC, created_at DESC";
            const latestRecord = await executeQueryEmployeeAccessDB(latestRecordQuery, values);

            let trueOdometer = parseFloat(odometer);  // กำหนดค่าเริ่มต้นให้เป็น odometer ที่ส่งมา

            if (latestRecord.length > 0) {
                
                const { true_odometer, odometer: lastOdometer } = latestRecord[0];
                const trueOdometerNumeric = parseFloat(true_odometer); // แปลงเป็นตัวเลข
                const lastOdometerNumeric = parseFloat(lastOdometer); // แปลงเป็นตัวเลข

                console.log("🔍 True Odometer:", trueOdometerNumeric, "| Last Odometer:", lastOdometerNumeric);
                console.log("⚠️ test trueOdometer :", trueOdometer);
                // เงื่อนไขที่ 1: การคำนวณปกติ
                if (trueOdometer >= lastOdometerNumeric) {
                    console.log("📌 Normal condition met.");
                    trueOdometer = trueOdometerNumeric + (trueOdometer - lastOdometerNumeric);
                }
                // เงื่อนไขที่ 2: ตรวจสอบการรีเซ็ตเลขไมล์
                else if (trueOdometer < lastOdometerNumeric) {
                    
                    trueOdometer = trueOdometerNumeric + (100000 - lastOdometerNumeric) + trueOdometer;
                    console.log("⚠️ Odometer reset detected: ", trueOdometer);
                }
                // เงื่อนไขที่ 3: รถเสียเลขไม่ตรง
                else {
                    console.log("❌ Error: Invalid odometer reading.");
                    return res.status(400).json({ message: "Invalid odometer reading" });
                }
            } else {
                // กรณีไม่มีข้อมูลเลขไมล์ก่อนหน้า
                trueOdometer = odometer;
            }

            const value = {
                reg_id,
                recorded_date,
                odometer,
                trueOdometer,
                emp_id,
                notes
            };

            // **บันทึกข้อมูล**
            const insertQuery = "INSERT INTO Truck_car_mileage (reg_id, recorded_date, odometer, true_odometer, emp_id, notes) VALUES (@reg_id, @recorded_date, @odometer, @trueOdometer, @emp_id, @notes)";
            await executeQueryEmployeeAccessDB(insertQuery, value);

            res.json({ message: "Mileage updated successfully", trueOdometer });

        } catch (error) {
            console.error("❌ Error updating mileage:", error);
            res.status(500).json({ message: "Failed to update mileage", error: error.message });
        }
    },


    car_mileage_reset: async (req, res) => {
        const { reg_id, emp_id, recorded_date, odometer, notes } = req.body;
        const values = { reg_id: reg_id };
    
        try {
            const latestRecordQuery = "SELECT TOP 1 true_odometer, odometer FROM Truck_car_mileage WHERE reg_id = @reg_id ORDER BY recorded_date DESC";
            const latestRecord = await executeQueryEmployeeAccessDB(latestRecordQuery, values);
    
            let trueOdometer = odometer;
    
            if (odometer >= 100000) {
                console.log("⚠️ Odometer reset condition met. Resetting odometer to 1.");
                trueOdometer = 1000000 + (odometer - 100000);  // ค่าเริ่มต้นที่ 1 ล้าน
            } else if (latestRecord.length > 0) {
                const { true_odometer, odometer: lastOdometer } = latestRecord[0];
                const trueOdometerNumeric = parseFloat(true_odometer);
                const lastOdometerNumeric = parseFloat(lastOdometer);
    
                if (odometer >= lastOdometerNumeric) {
                    trueOdometer = trueOdometerNumeric + (odometer - lastOdometerNumeric);
                } else {
                    return res.status(400).json({ message: "Invalid odometer reading" });
                }
            }
    
            const value = { reg_id, recorded_date, odometer, trueOdometer, emp_id, notes };
            const insertQuery = "INSERT INTO Truck_car_mileage (reg_id, recorded_date, odometer, true_odometer, emp_id, notes) VALUES (@reg_id, @recorded_date, @odometer, @trueOdometer, @emp_id, @notes)";
            await executeQueryEmployeeAccessDB(insertQuery, value);
    
            res.json({ message: "Mileage updated successfully", trueOdometer });
    
        } catch (error) {
            console.error("Error updating mileage:", error);
            res.status(500).json({ message: "Failed to update mileage", error: error.message });
        }
    },

    // ใช้เพิ่มข้อมูล
    car_mileage_add_data: async (req,res) => {
        const { reg_id, emp_id, recorded_date, odometer, notes, status } = req.body;
         // ตรวจสอบค่าที่จำเป็นต้องมี
    if (!reg_id || !emp_id || !recorded_date || !odometer || !status) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // ตรวจสอบว่า odometer เป็นตัวเลข
    if (isNaN(odometer)) {
        return res.status(400).json({ message: "Odometer must be a number" });
    }

        const values = { 
            reg_id: reg_id,
            emp_id: emp_id,
            recorded_date: recorded_date,
            odometer: odometer,
            notes: notes || "", // ป้องกันค่า null
            status: status,
        };
        const query = `
        INSERT INTO Truck_car_mileage (reg_id, emp_id, recorded_date, odometer, notes, status) 
VALUES (@reg_id, @emp_id, @recorded_date, @odometer, @notes, @status)

        `;
try {
    const result = await executeQueryEmployeeAccessDB(query, values);
    
    if (result.affectedRows > 0) { 
        res.status(200).json({ message: 'Mileage added successfully' });
    } else {
        res.status(500).json({ message: "Failed to add mileage" });
    }
} catch (error) {
    console.error("Error inserting mileage:", error);
    res.status(500).json({ message: "Failed to insert mileage", error: error.message });
}
    },

    mileage_excel_uploader: async (req, res) => {
        try {
            const { data } = req.body;
    
            // ตรวจสอบว่า data มีค่าหรือไม่
            if (!data || data.length === 0) {
                return res.status(400).json({ message: "ไม่มีข้อมูลที่ส่งมา" });
            }
    
            const query = `
                INSERT INTO Truck_car_mileage (reg_id, emp_id, recorded_date, odometer, notes, status) 
                VALUES (@reg_id, @emp_id, @recorded_date, @odometer, @notes, @status)
            `;
        
            const querySearch = `
                SELECT reg_number, reg_id FROM Truck_vehicle_registration WHERE reg_number = @reg_number
            `;
        
            for (const row of data) {
                const { reg_number, recorded_date, odometer, notes, status, emp_id } = row;
    
                // ตรวจสอบข้อมูลที่จำเป็น
                if (!emp_id || !reg_number || !recorded_date || !odometer || !status) {
                    console.log(`Missing required data for reg_number: ${reg_number}`);
                    return res.status(400).json({ message: `ข้อมูลไม่ครบถ้วนสำหรับ reg_number: ${reg_number}` });
                }
    
                const valueSearch = { reg_number };
                const resultSearch = await executeQueryEmployeeAccessDB(querySearch, valueSearch);
        
                if (resultSearch && resultSearch.length > 0) {
                    const reg_id = resultSearch[0].reg_id;
        
                    // Proceed to insert into Truck_car_mileage
                    const valueInsert = { 
                        reg_id, 
                        emp_id,
                        recorded_date, 
                        odometer, 
                        notes, 
                        status 
                    };
                    console.log('Inserting value:', valueInsert);
                    await executeQueryEmployeeAccessDB(query, valueInsert);
                } else {
                    console.log(`No matching vehicle found for reg_number: ${reg_number}`);
                    return res.status(404).json({ message: `ไม่พบข้อมูลของรถที่ทะเบียน: ${reg_number}` });
                }
            }
        
            res.status(200).json({ message: "Mileage data successfully uploaded" });
        
        } catch (error) {
            console.error("Error inserting mileage:", error);
            res.status(500).json({ message: "Failed to insert mileage", error: error.message });
        }
    }
    
    
    
    
};
