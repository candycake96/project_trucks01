const generateRepairReport = require('../../../report/maintenance/generate-repair-summary-report');
const { executeSelectQuery } = require('../../../config/db');


module.exports = {
    createRepair: async (req, res) => {
        try {

            const { startDate, endDate, regNumber, repairType } = req.query;

            let conditions = ["r1.status != 'ยกเลิก'"];

            if (startDate && endDate) {
                conditions.push(`r1.request_date BETWEEN '${startDate}' AND '${endDate}'`);
            }
            if (regNumber) {
                conditions.push(`r2.reg_number LIKE '%${regNumber}%'`);
            }
            if (repairType === "PM") {
                conditions.push(`a.is_pm = 'true'`);
            }
            if (repairType === "CM") {
                conditions.push(`a.is_cm = 'true'`);
            }



            let whereClause = "";
            if (conditions.length > 0) {
                whereClause = "WHERE " + conditions.join(" AND ");
            }

            const sqlRequests = `
                          SELECT 
                            r1.request_id,
                            r1.request_informer_emp_id,
                            r1.request_no,
                            r1.request_date,
                            r1.status,
                            r1.created_at,
                            r1.reg_id,
                            r1.car_mileage,
                            r1.request_mileage,

                            e1.fname + ' ' + e1.lname AS request_emp_name,

                            r2.reg_number,
                            b.branch_name, 
                            ct.car_type_name,

                            p.planning_id,
                            p.planning_emp_id,
                            p.planning_vehicle_availability,
                            p.planning_event_date,
                            p.planning_event_time,
                            p.planning_event_remarke,
                            p.planning_created_at_dispatch, 

                            e2.fname + ' ' + e2.lname AS planning_name,

                            a.analysis_id,
                            a.plan_date AS analysis_date,
                            a.plan_time AS analysis_time,
                            a.remark AS analysis_remark,
                            a.is_quotation_required,
                            a.analysis_emp_id,
                            a.urgent_repair,
                            a.inhouse_repair,
                            a.send_to_garage,
                            a.is_pm,
                            a.is_cm,

                            e3.fname + ' ' + e3.lname AS analysis_emp_name,

                            ap.approver_id,
                            ap.approver_emp_id,
                            ap.approver_name,
                            ap.position,
                            ap.approval_status,
                            ap.approval_date,
                            ap.remark AS analysis_approver_remark,

                            e4.fname + ' ' + e4.lname AS approver_emp_name,

                            av.approver_id AS approval_id,
                            av.approver_emp_id AS approval_emp_id,
                            av.approver_name AS approval_name,
                            av.approval_status AS approval_status_end,
                            av.approval_date AS approval_date_end,
                            av.remark AS remark_end,

                            q.quotation_id, 
                            q.quotation_vat,
                            

                            all_vendors.vendor_names_all,

                            ISNULL(qsum.total_approved_cost, 0) AS total_approved_cost,

                              -- คำนวณ total รวม VAT ถ้ามี
                            CASE 
                                WHEN q.quotation_vat IS NOT NULL AND q.quotation_vat > 0 THEN 
                                    ISNULL(qsum.total_approved_cost, 0) * (1 + (q.quotation_vat / 100.0))
                                ELSE 
                                    ISNULL(qsum.total_approved_cost, 0)
                            END AS total_with_vat,

                            sig_request.signature AS request_signature, --ลายเซ็น
                            sig_planning.signature AS planning_signature, --ลายเซ็น
                            sig_analysis.signature AS analysis_signature, --ลายเซ็น
                            sig_ana_approver.signature AS ana_approver_signature, --ลายเซ็น
                            sig_approver.signature AS request_approver --ลายเซ็น

                        FROM Truck_repair_requests r1
                        INNER JOIN employees e1 ON r1.request_informer_emp_id = e1.id_emp
                        INNER JOIN Truck_vehicle_registration r2 ON r1.reg_id = r2.reg_id
                        INNER JOIN branches b ON r2.id_branch = b.id_branch
                        INNER JOIN Truck_car_types ct ON r2.car_type_id = ct.car_type_id

                        LEFT JOIN Truck_repair_planning p ON r1.request_id = p.request_id
                        LEFT JOIN employees e2 ON p.planning_emp_id = e2.id_emp

                        LEFT JOIN Truck_repair_analysis a ON r1.request_id = a.request_id
                        LEFT JOIN employees e3 ON a.analysis_emp_id = e3.id_emp

                        -- แก้ไข: เพิ่มเงื่อนไข q.is_selected เพื่อลดการซ้ำซ้อน และดึงเฉพาะใบเสนอราคาที่ถูกเลือก
                        LEFT JOIN Truck_repair_garage_quotation q ON a.analysis_id = q.analysis_id AND q.is_selected = 'true' 

                        LEFT JOIN Truck_repair_analysis_approver ap ON a.analysis_id = ap.analysis_id
                        LEFT JOIN employees e4 ON ap.approver_emp_id = e4.id_emp

                        LEFT JOIN Truck_repair_approver av ON r1.request_id = av.request_id

                        -- แก้ไข: Subquery qsum ไม่ต้อง join กับ Truck_repair_garage_quotation อีกครั้ง และแก้ไขเงื่อนไข join
                        LEFT JOIN (
                            SELECT 
                                p.quotation_id,
                                SUM((p.part_price * p.part_qty) - p.part_discount + p.part_vat) AS total_approved_cost
                            FROM Truck_repair_quotation_parts p
                            WHERE p.is_approved_part = 'true' 
                            GROUP BY p.quotation_id
                        ) qsum ON q.quotation_id = qsum.quotation_id -- join ด้วย quotation_id
                        -- (ถ้ายังพบปัญหา total_approved_cost เป็น 0 ให้ตรวจสอบข้อมูลใน Truck_repair_quotation_parts ว่ามีรายการที่ is_approved_part เป็น 'true' และมีค่าราคาหรือไม่)

                        --ชื่อ vender แสดงทั้งหมดถ้ามี
                        LEFT JOIN (
                            SELECT 
                                analysis_id,
                                STUFF((
                                    SELECT ', ' + vendor_name
                                    FROM Truck_repair_garage_quotation q2
                                    WHERE q2.analysis_id = q1.analysis_id  AND q2.is_selected = 'true' 
                                    FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS vendor_names_all
                            FROM Truck_repair_garage_quotation q1
                            GROUP BY analysis_id
                        ) all_vendors ON a.analysis_id = all_vendors.analysis_id

                        -- ลายเซ็น 1
                        LEFT JOIN (
                            SELECT emp_id, signature, signature_id
                            FROM emp_signature s1
                            WHERE created_at = (
                                SELECT MAX(created_at)
                                FROM emp_signature s2
                                WHERE s1.emp_id = s2.emp_id
                            )
                        ) sig_request ON sig_request.emp_id = r1.request_informer_emp_id 
                            
                         -- ลายเซ็น 2
                         LEFT JOIN (
                           SELECT emp_id, signature, signature_id
                            FROM emp_signature s1
                            WHERE created_at = (
                                SELECT MAX(created_at)
                                FROM emp_signature s2
                                WHERE s1.emp_id = s2.emp_id
                            )  
                         ) sig_planning ON sig_planning.emp_id =  p.planning_emp_id

                        -- ลายเซ็น 3
                         LEFT JOIN (
                           SELECT emp_id, signature, signature_id
                            FROM emp_signature s1
                            WHERE created_at = (
                                SELECT MAX(created_at)
                                FROM emp_signature s2
                                WHERE s1.emp_id = s2.emp_id
                            )  
                         ) sig_analysis ON sig_planning.emp_id = a.analysis_emp_id

                        -- ลายเซ็น 4
                         LEFT JOIN (
                           SELECT emp_id, signature, signature_id
                            FROM emp_signature s1
                            WHERE created_at = (
                                SELECT MAX(created_at)
                                FROM emp_signature s2
                                WHERE s1.emp_id = s2.emp_id
                            )  
                         ) sig_ana_approver ON sig_planning.emp_id = ap.approver_emp_id

                        -- ลายเซ็น 5
                         LEFT JOIN (
                           SELECT emp_id, signature, signature_id
                            FROM emp_signature s1
                            WHERE created_at = (
                                SELECT MAX(created_at)
                                FROM emp_signature s2
                                WHERE s1.emp_id = s2.emp_id
                            )  
                         ) sig_approver ON sig_planning.emp_id = av.approver_emp_id
                    ${whereClause}
             ORDER BY r1.request_no DESC           

                                `;


            const resultRepuests = await executeSelectQuery(sqlRequests);

            const sqlQuotation = `
                SELECT 
                    q.quotation_id,
                    q.analysis_id,
                    q.vendor_id,
                    q.quotation_date,
                    q.quotation_file,
                    q.note,
                    q.is_selected,
                    q.quotation_vat,
                    q.vendor_name,

                    vd.vendor_type_id,
                    vd.organization_type_id,
                    vd.contact_person,
                    vd.phone,
                    vd.email,
                    vd.address,
                    vd.delivery_address,
                    vd.tax_id,
                    vd.file_vendor,
                    vd.credit_terms,
                    vd.status,
                    vd.warranty_policy,
                    vd.remarks,

                    qp.quotation_parts_id,
                    qp.part_id,
                    qp.part_name,
                    qp.maintenance_type,
                    qp.part_price,
                    qp.part_unit,
                    qp.part_qty,
                    qp.part_discount,
                    qp.is_approved_part,
                    qp.part_vat,
                    qp.approval_checked

                FROM Truck_repair_garage_quotation q 
                JOIN Truck_vendor vd ON vd.vendor_id = q.vendor_id 
                LEFT JOIN Truck_repair_quotation_parts qp ON qp.quotation_id = q.quotation_id 
                WHERE q.analysis_id = @analysis_id AND is_selected = 'True'
`;





const allData = [];

for (const repairData of resultRepuests) {
    const valueAnalysis = { analysis_id: repairData.analysis_id };
    const resultSystems = await executeSelectQuery(sqlQuotation, valueAnalysis);

    let groupedData = [];
    if (resultSystems && resultSystems.length > 0) {
        groupedData = resultSystems.reduce((acc, row) => {
            let existing = acc.find(item => item.quotation_id === row.quotation_id);

            const quotation_vat = parseFloat(row.quotation_vat || 0);
            const discount = parseFloat(row.part_discount || 0);
            const part_qty = parseFloat(row.part_qty || 0);
            const part_price = parseFloat(row.part_price || 0);
            const part_vat = parseFloat(row.part_vat || 0);

            // คำนวณราคาสุทธิ (total_part)
            const total_part = (part_qty * part_price) - discount;
            const part_vat_by_quotation = (total_part * part_vat) / 100;
            const total_price_with_vat = total_part + part_vat_by_quotation;

            const part = row.quotation_parts_id ? {
                quotation_parts_id: row.quotation_parts_id,
                part_id: row.part_id,
                part_name: row.part_name,
                maintenance_type: row.maintenance_type,
                part_price: part_price,
                part_unit: row.part_unit,
                part_qty: part_qty,
                part_discount: discount,
                is_approved_part: row.is_approved_part,
                approval_checked: row.approval_checked,
                total_part: parseFloat(total_part.toFixed(2)),
                part_vat_by_quotation: parseFloat(part_vat_by_quotation.toFixed(2)),
                part_vat: part_vat,
                total_price_with_vat: parseFloat(total_price_with_vat.toFixed(2))
            } : null;

            if (existing) {
                if (part) existing.parts.push(part);
            } else {
                acc.push({
                    quotation_id: row.quotation_id,
                    analysis_id: row.analysis_id,
                    vendor_id: row.vendor_id,
                    quotation_date: row.quotation_date,
                    quotation_file: row.quotation_file,
                    note: row.note,
                    is_selected: row.is_selected,
                    quotation_vat: quotation_vat,
                    vendor_name: row.vendor_name,
                    parts: part ? [part] : []
                });
            }

            return acc;
        }, []);

        // ✅ คำนวณ subtotal, vat, grand total
        groupedData.forEach(item => {
            const subtotal = item.parts.reduce((sum, p) => sum + (p.total_part || 0), 0);
            const vatRate = item.quotation_vat ? parseFloat(item.quotation_vat) : 0;
            const vat_amount = subtotal * (vatRate / 100);
            const grand_total = subtotal + vat_amount;

            item.subtotal = parseFloat(subtotal.toFixed(2));
            item.vat_amount = parseFloat(vat_amount.toFixed(2));
            item.grand_total = parseFloat(grand_total.toFixed(2));
        });
    }

    // push ข้อมูลทั้งหมดเข้า array
    allData.push({
        ...repairData,
        quotations: groupedData
    });
}

// res.status(200).json(allData);
// ✅ ส่งออกทั้งหมด
      const pdfPath = await generateRepairReport(req.body, allData);
        res.download(pdfPath);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            res.status(500).json({ message: "ไม่สามารถสร้างรายงานได้" });
        }
    }
};
