const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {

    // ตารางก่อนตรวจสอบ
    analysis_details: async (req, res) => {
        try {
          
            const sqlInsert = `
                SELECT 
  r1.request_id, 
  r1.request_informer_emp_id, 
  r1.request_no, 
  r1.request_date, 
  CASE 
    WHEN r1.status = 'แผนกจัดรถตรวจสอบ' THEN 'รอการตรวจสอบ'
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
WHERE r1.status = 'แผนกจัดรถตรวจสอบ'
ORDER BY r1.request_id DESC;

            `;

            const result =  await executeQueryEmployeeAccessDB(sqlInsert);
            if ( result && result.length > 0 ) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "ไม่สามารถบันทึกข้อมูลได้"})
            }

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด",  error: error.message  });
        }
    },


    // ตารางเมื่อตรวจสอบแล้ว
 analysis_details_table_active: async (req, res) => {
        try {
          
            const sqlInsert = `
                SELECT 
  r1.request_id, 
  r1.request_informer_emp_id, 
  r1.request_no, 
  r1.request_date, 
  CASE 
    WHEN r1.status = 'วิเคราะห์แผนกซ่อมบำรุง' THEN 'วิเคราะห์แผนกซ่อมบำรุง'
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
WHERE r1.status = 'วิเคราะห์แผนกซ่อมบำรุง'
ORDER BY r1.request_id DESC;
            `;

            const result =  await executeQueryEmployeeAccessDB(sqlInsert);
            if ( result && result.length > 0 ) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "ไม่สามารถบันทึกข้อมูลได้"})
            }

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด",  error: error.message  });
        }
    },



    4: async (req, res) => {
        const {id} = req.params;
        try {
            const values = {request_id: id};
            const sqlRequest = `
                SELECT
                r1.request_id,
                r1.request_informer_emp_id,
                r1.request_no,
                r1.request_date,
                r1.status,
                r1.reg_id,
                r1.car_mileage,
                emp.fname,
                emp.lname,
                v.reg_number
                 FROM Truck_repair_requests r1
                 INNER JOIN employees emp ON emp.id_emp = r1.request_informer_emp_id
                 INNER JOIN Truck_vehicle_registration v ON v.reg_id = r1.reg_id
                 WHERE request_id = @request_id    
                 ORDER BY r1.request_no ASC
                        
            `;

            const sqlParts = `SELECT 
                                p1.parts_used_id,
                                p1.request_id,
                                p1.part_id,
                                p1.repair_part_name,
                                p1.maintenance_type,
                                p1.repair_part_price,
                                p1.repair_part_unit,
                                p1.repair_part_qty,
                                p1.repair_part_vat,
                                p2.system_id,
                                s.system_name
                            FROM  Truck_repair_parts_used p1
                            INNER JOIN Truck_vehicle_parts p2 ON p1.part_id = p2.part_id
                            INNER JOIN Truck_vehicle_systems s ON  p2.system_id = s.system_id
                            WHERE request_id = @request_id `

            const resultRequest =  await executeQueryEmployeeAccessDB(sqlRequest, values);
            const resultParts = await executeQueryEmployeeAccessDB(sqlParts, values);
            if (resultRequest && resultRequest.length > 0) {
                const result = {
                    ...resultRequest[0],
                    parts_used: resultParts
                };
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "ไม่พบข้อมูล request_id นี้" });
            }
            

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด",  error: error.message  });
        } 
    }
    
};
