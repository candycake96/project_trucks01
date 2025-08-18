const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
     maintenance_approval_how_table : async (req, res) => {
        try {
          
            const sqlInsert = `
                SELECT 
                r1.request_id, 
                r1.request_informer_emp_id, 
                r1.request_no, 
                r1.request_date, 
                CASE 
                  WHEN r1.status = 'ผ่านอนุมัตผลตรวจหัวหน้าแผนกช่าง' THEN 'รออนุมัติงานซ่อมบำรุง'
                  ELSE r1.status
                END AS status, 
                r1.reg_id, 
                r1.car_mileage,
                emp.fname ,
                emp.lname,
                v.reg_number
                 FROM Truck_repair_requests r1
                 INNER JOIN employees emp ON emp.id_emp = r1.request_informer_emp_id
                 INNER JOIN Truck_vehicle_registration v ON v.reg_id = r1.reg_id
                    WHERE r1.status  = 'ผ่านอนุมัตผลตรวจหัวหน้าแผนกช่าง'
                 ORDER BY r1.request_id DESC
            `;

            const result =  await executeQueryEmployeeAccessDB(sqlInsert);
            if ( result && result.length > 0 ) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "ไม่มีข้อมูล"})
            }

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด",  error: error.message  });
        }
    },

         maintenance_approval_show_table : async (req, res) => {
        try {
          
            const sqlInsert = `
                SELECT 
                r1.request_id, 
                r1.request_informer_emp_id, 
                r1.request_no, 
                r1.request_date, 
                CASE 
                  WHEN r1.status = 'ผู้จัดการฝ่ายขนส่งและคลังสินค้า' THEN 'อนุมัติงานซ่อมบำรุงแล้ว'
                  ELSE r1.status
                END AS status, 
                r1.reg_id, 
                r1.car_mileage,
                emp.fname ,
                emp.lname,
                v.reg_number
                 FROM Truck_repair_requests r1
                 INNER JOIN employees emp ON emp.id_emp = r1.request_informer_emp_id
                 INNER JOIN Truck_vehicle_registration v ON v.reg_id = r1.reg_id
                    WHERE r1.status  = 'ผู้จัดการฝ่ายขนส่งและคลังสินค้า'
                 ORDER BY r1.request_id DESC
            `;

            const result =  await executeQueryEmployeeAccessDB(sqlInsert);
            if ( result && result.length > 0 ) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "ไม่มีข้อมูล"})
            }

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด",  error: error.message  });
        }
    },

};
