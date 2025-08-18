const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    planning_show: async (req, res) => {
        try {
            const sqlInsert = `
                SELECT 
                r1.request_id, 
                r1.request_informer_emp_id, 
                r1.request_no, 
                r1.request_date, 
                r1.status, 
                r1.reg_id, 
                r1.car_mileage,
                emp.fname ,
                emp.lname,
                v.reg_number
                 FROM Truck_repair_requests r1
                 INNER JOIN employees emp ON emp.id_emp = r1.request_informer_emp_id
                 INNER JOIN Truck_vehicle_registration v ON v.reg_id = r1.reg_id
                 WHERE r1.status = 'แจ้งซ่อม'
                 ORDER BY r1.request_id DESC
            `;

            const result = await executeQueryEmployeeAccessDB(sqlInsert);
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "ไม่สามารถบันทึกข้อมูลได้" })
            }

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

        planning_table_submit: async (req, res) => {
        try {
            const sqlInsert = `
SELECT 
  r1.request_id, 
  r1.request_informer_emp_id, 
  r1.request_no, 
  r1.request_date, 
  CASE 
    WHEN r1.status NOT IN ('แจ้งซ่อม', 'ปิดงานซ่อม') THEN 'จัดงานแล้ว'
    ELSE r1.status
  END AS status,
  r1.reg_id, 
  r1.car_mileage,
  emp.fname,
  emp.lname,
  v.reg_number
FROM Truck_repair_requests r1
INNER JOIN employees emp ON emp.id_emp = r1.request_informer_emp_id
INNER JOIN Truck_vehicle_registration v ON v.reg_id = r1.reg_id
WHERE r1.status NOT IN ('แจ้งซ่อม', 'ปิดงานซ่อม')
ORDER BY r1.request_id DESC;
            `;

            const result = await executeQueryEmployeeAccessDB(sqlInsert);
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "ไม่สามารถแสดงข้อมูลได้" })
            }

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

    planning_show_id: async (req, res) => {
        try {
            const sqlInsert = `
                SELECT  TOP 1
                p.planning_id,
                p.request_id, 
                p.planning_emp_id, 
                p.planning_vehicle_availability, 
                p.planning_event_date, 
                p.planning_event_time, 
                p.planning_event_remarke,
                emp.fname,
                emp.lname
                 FROM Truck_repair_planning p
                 INNER JOIN employees emp ON emp.id_emp = p.planning_emp_id
                 WHERE request_id = @request_id
                 ORDER BY p.planning_event_date DESC, p.planning_event_time DESC;
            `;
            const { id } = req.params;
            const value = { request_id: id };

            const result = await executeQueryEmployeeAccessDB(sqlInsert, value);
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "แสดงข้อมูลได้" })
            }

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },


    planning_add: async (req, res) => {
        try {
            const { request_id, planning_emp_id, planning_vehicle_availability, planning_event_date, planning_event_time, planning_event_remarke } = req.body;
            console.log("🟡 req.body:", req.body);
            const sql = `INSERT INTO Truck_repair_planning (
            request_id,
            planning_emp_id,
            planning_vehicle_availability,
            planning_event_date,
            planning_event_time,
            planning_event_remarke
        ) VALUES (
            @request_id,
            @planning_emp_id,
            @planning_vehicle_availability,
            @planning_event_date,
            @planning_event_time,
            @planning_event_remarke
        ) `;
            const value = {
                request_id: request_id,
                planning_emp_id: planning_emp_id,
                planning_vehicle_availability: planning_vehicle_availability,
                planning_event_date: planning_event_date,
                planning_event_time: planning_event_time,
                planning_event_remarke: planning_event_remarke
            };

            const result = await executeQueryEmployeeAccessDB(sql, value);

            // 
            const sqlRQ = `UPDATE Truck_repair_requests SET status = @status WHERE  request_id = @request_id`;
            const valueRQ = {status: "แผนกจัดรถตรวจสอบ", request_id: request_id};
             await executeQueryEmployeeAccessDB(sqlRQ, valueRQ);

            //  

                         const sqlLog = `INSERT INTO Truck_repair_logs ( 
                                request_id,
                                action,
                                action_by,
                                action_by_role,
                                status,
                                remarks
                            ) VALUES (
                                @request_id,
                                @action,
                                @action_by,
                                @action_by_role,
                                @status,
                                @remarks
                            )`;

            const valueLog = {
                request_id: request_id,
                action: 'วางแผนจัดรถ',
                action_by: planning_emp_id,
                action_by_role: 'ผู้จัดรถ ',
                status: 'วางแผน',
                remarks: 'บันทึกจัดรถ'
            };

            await executeQueryEmployeeAccessDB(sqlLog, valueLog);
            
            res.status(200).json({
                message: 'เพิ่มข้อมูลสำเร็จ',
                result
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: 'เกิดข้อผิดพลาด',
                error: error.message
            });
        }
    },


    planning_update: async (req, res) => {
        try {
            const { id } = req.params;
            const { request_id, planning_emp_id, planning_vehicle_availability, planning_event_date, planning_event_time, planning_event_remarke } = req.body;
            console.log("🟡 req.body:", req.body);
            const sql = `UPDATE Truck_repair_planning SET
            planning_emp_id = @planning_emp_id,
            planning_vehicle_availability = @planning_vehicle_availability,
            planning_event_date = @planning_event_date,
            planning_event_time = @planning_event_time,
            planning_event_remarke = @planning_event_remarke
            WHERE planning_id = @planning_id
         `;
         
            const value = {
                planning_emp_id: planning_emp_id,
                planning_vehicle_availability: planning_vehicle_availability,
                planning_event_date: planning_event_date,
                planning_event_time: planning_event_time,
                planning_event_remarke: planning_event_remarke,
                planning_id: id,
            };

            const result = await executeQueryEmployeeAccessDB(sql, value);

            
                         const sqlLog = `INSERT INTO Truck_repair_logs ( 
                                request_id,
                                action,
                                action_by,
                                action_by_role,
                                status,
                                remarks
                            ) VALUES (
                                @request_id,
                                @action,
                                @action_by,
                                @action_by_role,
                                @status,
                                @remarks
                            )`;

            const valueLog = {
                request_id: request_id,
                action: 'แก้ไขวางแผนจัดรถ',
                action_by: planning_emp_id,
                action_by_role: 'ผู้จัดรถ ',
                status: 'วางแผน',
                remarks: 'แก้ไขจัดรถ'
            };

            await executeQueryEmployeeAccessDB(sqlLog, valueLog);

            res.status(200).json({
                message: 'แก้ไขข้อมูลสำเร็จ',
                result
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: 'เกิดข้อผิดพลาด',
                error: error.message
            });
        }
    },
};
