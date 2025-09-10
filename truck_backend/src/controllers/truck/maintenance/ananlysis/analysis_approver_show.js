const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    ananlysis_approver_show: async (req, res) => {
        try {
            const { id } = req.params;

            // 1. ดึง quotations ทั้งหมดของ analysis นี้
            const sqlQuotations = `SELECT 
                    q.quotation_id,
                    q.analysis_id,
                    q.vendor_id,
                    q.quotation_date, 
                    q.quotation_file,
                    q.note,
                    q.is_selected,
                    q.quotation_vat,
                    q.vendor_name,
                    a.request_id
             FROM Truck_repair_garage_quotation q
            INNER JOIN Truck_repair_analysis a ON a.analysis_id = q.analysis_id
            WHERE a.request_id  = @request_id AND q.is_selected = 'true' `;
            const quotations = await executeQueryEmployeeAccessDB(sqlQuotations, { request_id: id });

            // 2. ดึง parts ของแต่ละ quotation
            const sqlParts = `SELECT 
              p1.quotation_parts_id,
                    p1.item_id,
                    p1.quotation_id,
                    p1.part_id,
                    p1.part_name,
                    p1.maintenance_type,
                    p1.part_price,
                    p1.part_vat,
                    p1.part_unit,
                    p1.part_qty,
                    p1.part_discount,
                    p1.is_approved_part,
                    p1.approval_checked,
                    s.system_name
                FROM Truck_repair_quotation_parts p1
                INNER JOIN Truck_vehicle_systems s ON s.system_id = p1.part_id
             WHERE p1.quotation_id = @quotation_id`;

            // 3. ใส่ parts ลงในแต่ละ quotation
            for (let quotation of quotations) {
                const parts = await executeQueryEmployeeAccessDB(sqlParts, { quotation_id: quotation.quotation_id });
                quotation.parts = parts;
            }

            res.status(200).json({ quotations });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching quotations", error: error.message });
        }
    },

    ananlysis_approver_show_data: async (req, res) => {
        try {
            const { id } = req.params;
            // 1. ดึง quotations ทั้งหมดของ analysis นี้
            const sqlQuotations = `SELECT 
                    q.quotation_id,
                    q.analysis_id,
                    q.vendor_id,
                    q.quotation_date, 
                    q.quotation_file,
                    q.note,
                    q.is_selected,
                    q.quotation_vat,
                    q.vendor_name,                    
                    a.request_id
             FROM Truck_repair_garage_quotation q
            INNER JOIN Truck_repair_analysis a ON a.analysis_id = q.analysis_id
            WHERE a.request_id  = @request_id AND q.is_selected = 'true' `;
            const quotations = await executeQueryEmployeeAccessDB(sqlQuotations, { request_id: id });

            // 2. ดึง parts ของแต่ละ quotation
            const sqlParts = `SELECT 
            p1.item_id,
              p1.quotation_parts_id,
                    p1.quotation_id,
                    p1.part_id,
                    p1.part_name,
                    p1.maintenance_type,
                    p1.part_price,
                    p1.part_vat,
                    p1.part_unit,
                    p1.part_qty,
                    p1.part_discount,
                    p1.is_approved_part,
                    p1.approval_checked,
                    s.system_name
                FROM Truck_repair_quotation_parts p1
                INNER JOIN Truck_vehicle_systems s ON s.system_id = p1.part_id
             WHERE p1.quotation_id = @quotation_id`;

            // 3. ดึงข้อมูล approver
            const sqlApprover = `
            SELECT TOP 1 a1.*, e.fname, e.lname
FROM Truck_repair_analysis_approver a1
INNER JOIN Truck_repair_analysis a ON a.analysis_id = a1.analysis_id
INNER JOIN employees e ON a1.approver_emp_id = e.id_emp
WHERE a.request_id = @request_id
ORDER BY a1.approval_date DESC;
`;
            const approvers = await executeQueryEmployeeAccessDB(sqlApprover, { request_id: id });
            // 3. ใส่ parts ลงในแต่ละ quotation
            for (let quotation of quotations) {
                const parts = await executeQueryEmployeeAccessDB(sqlParts, { quotation_id: quotation.quotation_id });
                quotation.parts = parts;
            }

            res.status(200).json({ quotations, approvers });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching quotations", error: error.message });
        }
    }
};