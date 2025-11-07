const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    waiting_closing_list_table: async (req, res) => {
        try {
            const sqlInsert = `
                            SELECT 
                                r1.request_id, 
                                r1.request_informer_emp_id, 
                                r1.request_no, 
                                r1.request_date, 
                                r1.status AS invoiceStatus,
                                CASE 
                                    WHEN r1.status = 'ใบแจ้งหนี้' THEN 'รออนุมัติใบแจ้งหนี้'
                                    ELSE r1.status
                                END AS status_display,
                                r1.reg_id, 
                                r1.car_mileage,
                                emp.fname,
                                emp.lname,
                                v.reg_number
                            FROM Truck_repair_requests r1
                            INNER JOIN employees emp ON emp.id_emp = r1.request_informer_emp_id
                            INNER JOIN Truck_vehicle_registration v ON v.reg_id = r1.reg_id
                            WHERE r1.status = 'ใบแจ้งหนี้'
                            ORDER BY r1.request_id DESC;
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

        close_job_show_id: async (req, res) => {
        try {
            const {id}=req.params;
            const sql = `
SELECT TOP 1
    c.close_id,
    c.request_id,
    c.close_date,
    c.close_remark,
    c.closed_by,
    c.close_file,
    c.status_after_close,
    c.created_at,
    r.request_no
FROM Truck_repair_close c
INNER JOIN Truck_repair_requests r ON  r.request_id = c.request_id
WHERE c.request_id = @request_id
ORDER BY c.created_at DESC

            `;

            const result = await executeQueryEmployeeAccessDB(sql, {request_id: id});
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

        // ปิดไปแล้ว
        closing_list_table: async (req, res) => {
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
                WHERE r1.status = 'ปิดงานซ่อม'
                ORDER BY r1.request_id DESC
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


};
