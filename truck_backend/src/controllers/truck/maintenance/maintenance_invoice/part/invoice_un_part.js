const { executeQueryEmployeeAccessDB } = require('../../../../../config/db');

module.exports = {

    invoice_un_part: async (req, res) => {2
        const {id} = req.params;
     try {
            const sqlInsert = `
                                SELECT
                                    p.quotation_parts_id,
                                    p.quotation_id,
                                    p.part_id,
                                    p.part_name,
                                    p.maintenance_type,
                                    p.part_price,
                                    p.part_unit,
                                    p.part_qty,
                                    p.part_discount,
                                    p.is_approved_part,
                                    p.part_vat,
                                    p.approval_checked,
                                    p.item_id,
                                    q.vendor_name,
                                    q.analysis_id,
                                    a.request_id,
                                    s.system_name
                                FROM Truck_repair_quotation_parts p
                                LEFT JOIN Truck_repair_garage_quotation q 
                                    ON p.quotation_id = q.quotation_id
                                LEFT JOIN Truck_repair_analysis a 
                                    ON q.analysis_id = a.analysis_id
                                LEFT JOIN Truck_vehicle_parts vp
                                    ON p.part_id = vp.part_id         -- join ผ่าน table mapping
                                LEFT JOIN Truck_vehicle_systems s
                                    ON vp.system_id = s.system_id     -- join กับระบบจริง
                                WHERE p.approval_checked = 1          -- ใช้ 1 สำหรับ BIT/Boolean
                                  AND a.request_id = @request_id
                                ORDER BY q.quotation_id, s.system_name, p.part_id;  -- จัดเรียงให้อ่านง่าย

            `;

            const result = await executeQueryEmployeeAccessDB(sqlInsert,{request_id: id});
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

}
