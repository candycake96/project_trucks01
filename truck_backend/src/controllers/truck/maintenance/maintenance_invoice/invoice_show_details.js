const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {

    un_invoice_maintenance: async (req, res) => {
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
                 WHERE r1.status = 'ผู้จัดการอนุมัติ'
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

invoice_maintenance: async (req, res) => {
    try {
        const { id } = req.params;

        // 1️⃣ ดึงข้อมูล invoice
        const sqlInvoice = `
            SELECT 
                t1.invoice_id,
                t1.invoice_no,
                t1.request_id,
                t1.invoice_date,
                t1.invoice_created_emp_id,
                t1.invoice_approver_emp_id,
                t1.invoice_approver_date,
                t1.status,
                t1.created_at,
                t1.updated_at,
                t1.invoice_doc,
                e.fname,
                e.lname
            FROM Truck_Mainternance_invoice t1
            INNER JOIN employees e ON e.id_emp = t1.invoice_created_emp_id
            WHERE invoice_id = @invoice_id
        `;
        const resultInvoice = await executeQueryEmployeeAccessDB(sqlInvoice, { invoice_id: id });

        if (!resultInvoice || resultInvoice.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูลใบแจ้งซ่อม" });
        }

        // 2️⃣ ดึง section ทั้งหมดใน invoice นั้น
        const sqlSection = `
            SELECT 
                invoice_section_id,
                note,
                invoice_id,
                created_at,
                updated_at,
                section_number
            FROM Truck_Mainternance_invoice_section
            WHERE invoice_id = @invoice_id
        `;
        const resultSection = await executeQueryEmployeeAccessDB(sqlSection, { invoice_id: id });

        // 3️⃣ ดึง parts ของแต่ละ section
        const sqlPart = `
            SELECT 
                p1.invoice_parts_id,
                p1.invoice_section_id,
                p1.part_id,
                p1.part_name,
                p1.maintenance_type,
                p1.part_price,
                p1.part_unit,
                p1.part_qty,
                p1.part_discount,
                p1.is_approved_part,
                p1.approval_checked,
                p1.created_at,
                p1.updated_at,
                p1.part_vat,
                p.system_id,
                s.system_name
            FROM Truck_Mainternance_invoice_part p1
                INNER JOIN Truck_vehicle_parts p ON p.part_id = p1.part_id
                INNER JOIN Truck_vehicle_systems s ON s.system_id = p.system_id
            WHERE invoice_section_id = @invoice_section_id
        `;

        // ใช้ Promise.all เพื่อดึง parts ทุก section พร้อมกัน
        const sectionWithParts = await Promise.all(
            resultSection.map(async (section) => {
                const parts = await executeQueryEmployeeAccessDB(sqlPart, {
                    invoice_section_id: section.invoice_section_id,
                });
                return { ...section, parts };
            })
        );

        // 4️⃣ รวมผลทั้งหมดแล้วส่งกลับ
        const response = {
            ...resultInvoice[0],
            sections: sectionWithParts
        };

        res.status(200).json(response);

    } catch (error) {
        console.error("Error in invoice_maintenance:", error);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดระหว่างดึงข้อมูล",
            error: error.message,
        });
    }
},

 // ✅ ตรวจสอบว่ามีข้อมูลอนุมัติอยู่หรือไม่
    invoice_checkApproval: async (req, res) => {
        try {
        
            const { id } = req.params; // invoice_id

            const sqlCheck = `
                SELECT 
                    a.invoice_approved_id,
                    a.invoice_approved_emp_id,
                    a.invoice_id,
                    a.approval_checked,
                    a.is_active,
                    a.created_at,
                    a.updated_at,
                    a.approval_note,
                    e.fname,
                    e.lname
                FROM Truck_Mainternance_invoice_approved a
                INNER JOIN employees e ON e.id_emp = a.invoice_approved_emp_id
                WHERE invoice_id = @invoice_id AND is_active = 1
            `;

            const result = await executeQueryEmployeeAccessDB(sqlCheck, { invoice_id: id });

            if (result.length === 0) {
                res.json({ hasApproval: false }); // ยังไม่มีข้อมูล
            } else {
                res.json({ hasApproval: true, approvalData: result[0] }); // มีข้อมูลแล้ว
            }

        } catch (error) {
            console.error('Error checking approval:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


}
