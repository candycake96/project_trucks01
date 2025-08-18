const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    // 1 ข้อมูลระยะทาง + รถ หาค่าล่าสุดเพียงหนึ่งเดียว
    car_mileage_show: async (req, res) => {
        const query = `
        SELECT t1.id, t1.reg_id, t1.true_odometer, t1.odometer, t1.recorded_date, t1.created_at, t3.reg_number
FROM Truck_car_mileage t1
JOIN (
    SELECT reg_id, MAX(recorded_date) AS max_recorded, MAX(created_at) AS max_created
    FROM Truck_car_mileage
    GROUP BY reg_id
) t2 
ON t1.reg_id = t2.reg_id 
JOIN Truck_vehicle_registration t3 ON t1.reg_id = t3.reg_id
AND t1.recorded_date = t2.max_recorded
AND t1.created_at = t2.max_created;
`;

        try {
            const result = await executeQueryEmployeeAccessDB(query);

            if (result.length > 0) {
                res.json({ success: true, data: result });
            } else {
                res.json({ success: false, message: "No mileage records found" });
            }
        } catch (error) {
            console.error("Error fetching mileage records:", error);
            res.status(500).json({ success: false, message: "Failed to fetch mileage records", error: error.message });
        }
    },

    // 2 ข้อมูลระยะทาง + รถ หาค่าล่าสุดเพียงหนึ่งเดียว
    car_mileage_show_id: async (req, res) => {
        const {id} = req.params;
        const value = {reg_id: id};
        const query = `
SELECT 
t1.id, t1.emp_id, t1.reg_id, t1.true_odometer, t1.odometer, t1.recorded_date, t1.created_at, t1.notes, t1.status,
t2.reg_number,
t3.fname, t3.lname 
FROM Truck_car_mileage t1
JOIN Truck_vehicle_registration t2 ON t1.reg_id = t2.reg_id
JOIN employees t3 ON t1.emp_id = t3.id_emp
WHERE t1.reg_id = @reg_id 
ORDER BY t1.recorded_date DESC, t1.created_at DESC;
`;
        try {
            const result = await executeQueryEmployeeAccessDB(query, value);

            if (result.length > 0) {
                res.json({ success: true, data: result });
            } else {
                res.json({ success: false, message: "No mileage records found" });
            }
        } catch (error) {
            console.error("Error fetching mileage records:", error);
            res.status(500).json({ success: false, message: "Failed to fetch mileage records", error: error.message });
        }
    },


// 3 รถ + ระยะทาง แสดงรถทั้งหมดพร้อมหาค่าไมล์รถล่าสุด
car_mileage_show_tbl_all: async (req, res) => {
    const query = `
SELECT 
    t.*, 
    vt.*, 
    ut.*, 
    ct.car_type_id AS car_id, 
    ct.car_type_name,
    b.id_branch AS branch, 
    b.branch_name,
    b.company_id,
    lm.true_odometer, 
    lm.odometer, 
    lm.recorded_date, 
    lm.created_at
FROM Truck_vehicle_registration t
INNER JOIN Truck_vehicle_types vt ON t.vehicle_type_id = vt.vehicle_type_id
INNER JOIN Truck_vehicle_usage_type ut ON t.usage_type_id = ut.usage_type_id
INNER JOIN Truck_car_types ct ON t.car_type_id = ct.car_type_id
INNER JOIN branches b ON t.id_branch = b.id_branch
OUTER APPLY (
    SELECT TOP 1 reg_id, true_odometer, odometer, recorded_date, created_at
    FROM Truck_car_mileage 
    WHERE Truck_car_mileage.reg_id = t.reg_id
    ORDER BY recorded_date DESC, created_at DESC
) lm;


    `;

    try {
        const result = await executeQueryEmployeeAccessDB(query);

        if (result.length > 0) {
            // สร้างตัวแปรใหม่เพื่อประมวลผลข้อมูลก่อนส่ง response
            const filteredData = result.map(item => {
                return {
                    ...item, // ใช้ spread operator เพื่อคัดลอกข้อมูลทั้งหมด
                    fullDetails: `${item.car_type_name} - ${item.branch_name}`, // ตัวอย่างการสร้างข้อมูลใหม่
                    mileageStatus: item.true_odometer > 500000 ? 'High Mileage' : 'Low Mileage' // ตัวอย่างการคำนวณสถานะ
                    
                };
            });

            const data = result[0];

            // ส่งข้อมูลที่ถูกประมวลผลแล้ว
            res.json({
                success: true,
                data: result.map(data => ({
                    reg_id: data.reg_id,
                    reg_date: data.reg_date,
                    reg_number: data.reg_number,
                    province: data.province,
                    fuel: data.fuel,
                    car_type_id: data.car_type_id,
                    chassis_number: data.chassis_number,
                    true_odometer: data.true_odometer, // เพิ่มข้อมูลไมล์ล่าสุด
                    odometer: data.odometer,
                    branch_id : data.branch,
                    branch_name : data.branch_name,
                    branch_id : data.branch,
                    branch_name : data.branch_name,
                    company_id : data.company_id,
                    car_type_name : data.car_type_name,
                    car_type_id : data.car_id,
                    recorded_date : data.recorded_date,

                }))
            });
        } else {
            res.json({ success: false, message: "No mileage records found" });
        }
    } catch (error) {
        console.error("Error fetching mileage records:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch mileage records",
            error: error.message
        });
    }
},


// ???????

car_mileage_show_tbl_all_one: async (req, res) => {
    const query = `
        SELECT 
            t.*, 
            vt.*, 
            ut.*, 
            ct.car_type_id AS car_id, 
            ct.car_type_name,
            b.id_branch AS branch, 
            b.branch_name,
            b.company_id
        FROM Truck_vehicle_registration t
        INNER JOIN Truck_vehicle_types vt ON t.vehicle_type_id = vt.vehicle_type_id
        INNER JOIN Truck_vehicle_usage_type ut ON t.usage_type_id = ut.usage_type_id
        INNER JOIN Truck_car_types ct ON t.car_type_id = ct.car_type_id
        INNER JOIN branches b ON t.id_branch = b.id_branch;
    `;

    const queryMileage = `
        SELECT 
            t1.reg_id, 
            t1.emp_id, 
            t1.recorded_date, 
            t1.odometer, 
            t1.status, 
            t1.notes, 
            t1.created_at, 
            t1.updated_at,
            t2.fname,
            t2.lname
        FROM Truck_car_mileage t1
        JOIN employees t2 ON t1.emp_id = t2.id_emp
        WHERE reg_id = @reg_id
        ORDER BY recorded_date;
    `;

    try {
        const vehicles = await executeQueryEmployeeAccessDB(query);

        if (vehicles.length === 0) {
            return res.json({ success: false, message: "No vehicle records found" });
        }

        // Fetch mileage for all vehicles concurrently
        const mileageResults = await Promise.all(
            vehicles.map(async (vehicle) => {
                const mileageData = await executeQueryEmployeeAccessDB(queryMileage, { reg_id: vehicle.reg_id });

                if (mileageData.length === 0) {
                    return { 
                        ...vehicle, 
                        mileage: [],
                        total_distance: 0 
                    };
                }

                let prev_odometer = 0;
                let total_distance = 0;
                const reset_point = 100000;  

                // Process mileage data and calculate distances
                const mileageProcessed = mileageData
                    .sort((a, b) => new Date(a.recorded_date) - new Date(b.recorded_date))
                    .map((item, index) => {
                        let distance = 0;

                        if (item.status === "รีเซ็ท") {
                            prev_odometer = 0;
                            distance = item.odometer;
                        } else if (item.status === "ย้อนกลับ") {
                            distance = null;
                        } else if (index === 0) {
                            distance = item.odometer;
                        } else if (item.odometer >= prev_odometer && item.status === "ปกติ") {
                            distance = item.odometer - prev_odometer;
                        } else {
                            distance = (reset_point - prev_odometer) + item.odometer;
                        }

                        if (item.status !== "ย้อนกลับ" && distance !== null) {
                            total_distance += distance;
                        }

                        if (item.status !== "เสีย") {
                            prev_odometer = item.odometer;
                        }

                        return { ...item, prev_odometer, total_distance, distance };
                    });

                    // Get the last odometer value from the processed mileage data
                const lastOdometer = mileageProcessed.length > 0 ? mileageProcessed[mileageProcessed.length - 1].odometer : 0;
                const lastRecordeddate = mileageProcessed.length > 0 ? mileageProcessed[mileageProcessed.length - 1].recorded_date : 0;
                const lastFname = mileageProcessed.length > 0 ? mileageProcessed[mileageProcessed.length - 1].fname : 0;
                const lastLname = mileageProcessed.length > 0 ? mileageProcessed[mileageProcessed.length - 1].Lname : 0;
                // Return the final result with the accumulated total distance
                return { 
                    ...vehicle, 
                    mileage: mileageProcessed, 
                    total_distance: mileageProcessed.length > 0 ? total_distance : 0 ,
                    last_odometer: lastOdometer ,
                    lastRecorded_date: lastRecordeddate,
                    lastFname: lastFname,
                    lastLname: lastLname
                };
            })
        );

        res.json({
            success: true,
            data: mileageResults.map(data => ({
                reg_id: data.reg_id,
                reg_date: data.reg_date,
                reg_number: data.reg_number,
                province: data.province,
                fuel: data.fuel,
                car_type_id: data.car_id,
                chassis_number: data.chassis_number,
                branch_id: data.branch,
                branch_name: data.branch_name,
                company_id: data.company_id,
                car_type_name: data.car_type_name,
                fullDetails: `${data.car_type_name} - ${data.branch_name}`,
                total_distance: data.total_distance,
                odometer: data.last_odometer || null,
                recorded_date: data.lastRecorded_date || null,
                fname: data.fname || null,
                lname: data.lname || null
            }))
        });
    } catch (error) {
        console.error("Error fetching mileage records:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch mileage records",
            error: error.message,
            stack: error.stack // Added to log stack trace for better debugging
        });
    }
},







// คำนวณทุกอันแต่ใช้ where id = id แสดงทั้งหมด
getMileageData: async (req, res) => {
    const {id} = req.params;
    const value = {reg_id: id};
    const query = `
        SELECT 
            t1.id,
            t1.reg_id, 
            t1.emp_id, 
            t1.recorded_date, 
            t1.odometer, 
            t1.status, 
            t1.notes, 
            t1.created_at, 
            t1.updated_at,
            t2.fname,
            t2.lname
        FROM Truck_car_mileage t1
        JOIN employees t2 ON t1.emp_id = t2.id_emp
        WHERE reg_id = @reg_id
       ORDER BY recorded_date;
    `;

    try {
        const result = await executeQueryEmployeeAccessDB(query, value);

        if (result.length > 0) {
            let prev_odometer = result[0].odometer;
            let total_distance = 0;
            const reset_point = 100000;            

            let mileageData = result.map((item, index) => {
                let distance = 0;


                //หาข้อมูล distance
                if (item.status === "รีเซ็ท") {
                    distance = item.odometer;
                } else if (item.status === "ย้อนกลับ") {
                    distance = null;
                } else if (index === 0 && item.status === "ปกติ") {
                    distance = item.odometer; // เริ่มต้น 0 
                } else if (item.odometer >= prev_odometer && item.status === "ปกติ") {
                    distance = item.odometer - prev_odometer;
                } else {
                    distance = (reset_point - prev_odometer) + item.odometer; //ปกติ มีการรีเซ็ต
                }
                

                // หาข้อมูล total_distance
                if (item.status === "รีเซ็ท") {
                    total_distance += distance;
                } else if (item.status === "ย้อนกลับ") {
                    total_distance 
                } else if (item.status === "ปกติ") {
                    total_distance += distance;
                } else {
                    total_distance += item.odometer;
                }
                

                let resultItem = {
                    ...item,
                    prev_odometer,
                    total_distance,
                    distance
                };

                if (item.status !== "เสีย") {
                    prev_odometer = item.odometer;
                }
                return resultItem;
            });

            mileageData.sort((a, b) => {
                const dateDiff = new Date(b.recorded_date) - new Date(a.recorded_date);
                if (dateDiff === 0) {
                    return b.id - a.id; // ถ้าวันที่เท่ากัน ให้เรียงตาม id จากมากไปน้อย
                }
                return dateDiff;
            });
            // จัดเรียงข้อมูลใหม่ตาม recorded_date ในลำดับ DESC
            res.json({
                success: true,
                data: mileageData
            });
        } else {
            res.json({ success: false, message: "No mileage records found" });
        }
    } catch (error) {
        console.error("Error fetching mileage records:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch mileage records",
            error: error.message
        });
    }
},

// กำหนด ซ่อม
getMileageDataTow: async (req, res) => {

},


getMileageData2:  async (req, res) => {
   
},


};
