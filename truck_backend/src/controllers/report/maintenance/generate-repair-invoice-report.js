const generateRepairReport = require('../../../report/maintenance/generate-repair-invoice-report');
const { executeSelectQuery } = require('../../../config/db');

module.exports = {
    createRepair: async (req, res) => {
        try {
            const { id } = req.params;

            const sqlInvoice = `
                SELECT 
                    t1.invoice_id,
                    t1.invoice_no,
                    t1.request_id,
                    t1.invoice_date,
                    t1.invoice_created_emp_id,
                    t1.status,
                    t1.created_at AS created_date,
                    t1.updated_at,
                    t1.invoice_doc,
                    emp1.fname AS created_fname,
                    emp1.lname AS created_lname,
                    b1.branch_name,
                    emp2.fname AS approved_fname,
                    emp2.lname AS approved_lname,
                	t2.invoice_approved_id,
                	t2.invoice_approved_emp_id,
                	t2.approval_checked,
                	t2.created_at AS approval_date,
                	t2.approval_note
                FROM Truck_Mainternance_invoice t1
                INNER JOIN employees emp1 ON emp1.id_emp = t1.invoice_created_emp_id
                INNER JOIN branches b1 ON b1.id_branch = emp1.id_branch
                LEFT JOIN Truck_Mainternance_invoice_approved t2 ON t1.invoice_id = t2.invoice_id AND t2.is_active = 1
                LEFT JOIN employees emp2 ON emp2.id_emp = t2.invoice_approved_emp_id
                WHERE t1.invoice_id = @invoice_id;
            `;

            const resultInvoice = await executeSelectQuery(sqlInvoice, { invoice_id: id });

            if (!resultInvoice || resultInvoice.length === 0) {
                return res.status(404).json({ message: "ไม่พบข้อมูลใบแจ้งหนี้" });
            }

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

            const resultSection = await executeSelectQuery(sqlSection, { invoice_id: id });

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

            const sectionWithParts = await Promise.all(
                resultSection.map(async (section) => {
                    const parts = await executeSelectQuery(sqlPart, {
                        invoice_section_id: section.invoice_section_id,
                    });
                    return { ...section, parts };
                })
            );

            const response = {
                invoice: {
                    ...resultInvoice[0],
                    created_by: `${resultInvoice[0].created_fname} ${resultInvoice[0].created_lname}`,
                    approved_by: resultInvoice[0].approved_fname
                        ? `${resultInvoice[0].approved_fname} ${resultInvoice[0].approved_lname}`
                        : null
                },
                sections: sectionWithParts
            };

            // res.status(200).json(response);

            // ✅ ส่งออกทั้งหมด
            const pdfPath = await generateRepairReport({
                invoice: response.invoice,
                sections: response.sections
            });

            res.download(pdfPath);

        } catch (error) {
            console.error("PDF Generation Error:", error);
            res.status(500).json({ message: "ไม่สามารถสร้างรายงานได้" });
        }
    }
};


