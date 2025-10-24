const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {

    invoice_show_table: async (req, res) => {
      try {
          
                        const sqlSelect = ` SELECT 
                            t1.invoice_id,
                            t1.invoice_no,
                            t1.request_id,
                            t1.invoice_date,
                            t1.invoice_created_emp_id,
                            t1.invoice_approver_emp_id,
                            t1.invoice_approver_date,
                            t1.status AS invoice_status,
                            t1.created_at,
                            t1.updated_at,
                            t1.invoice_doc,        
                t2.request_informer_emp_id, 
                t2.request_no, 
                t2.request_date, 
                CASE 
                  WHEN t2.status = 'ใบแจ้งหนี้' THEN 'รออนุมัติใบแจ้งหนี้'
                  ELSE t2.status
                END AS status, 
                t2.reg_id, 
                t2.car_mileage,
                 v.reg_number
            FROM Truck_Mainternance_invoice t1
            INNER JOIN Truck_repair_requests t2 ON t1.request_id = t2.request_id
             INNER JOIN Truck_vehicle_registration v ON v.reg_id = t2.reg_id
             WHERE t1.status = 'draft'
              ORDER BY t1.invoice_id ASC
            `;
            const result =  await executeQueryEmployeeAccessDB(sqlSelect);
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

        invoice_show_table_approval: async (req, res) => {
      try {
          
                        const sqlSelect = ` SELECT 
                            t1.invoice_id,
                            t1.invoice_no,
                            t1.request_id,
                            t1.invoice_date,
                            t1.invoice_created_emp_id,
                            t1.invoice_approver_emp_id,
                            t1.invoice_approver_date,
                            t1.status AS invoice_status,
                            t1.created_at,
                            t1.updated_at,
                            t1.invoice_doc,        
                t2.request_informer_emp_id, 
                t2.request_no, 
                t2.request_date, 
                CASE 
                  WHEN t2.status = 'ใบแจ้งหนี้' THEN 'อนุมัติ'
                  ELSE t2.status
                END AS status, 
                t2.reg_id, 
                t2.car_mileage,
                 v.reg_number
            FROM Truck_Mainternance_invoice t1
            INNER JOIN Truck_repair_requests t2 ON t1.request_id = t2.request_id
             INNER JOIN Truck_vehicle_registration v ON v.reg_id = t2.reg_id
             WHERE t1.status = 'approved'
              ORDER BY t1.invoice_id ASC
            `;
            const result =  await executeQueryEmployeeAccessDB(sqlSelect);
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

}
