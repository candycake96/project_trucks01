const generateRepairReport = require('../../../report/maintenance/generate-repair-report');
const { executeSelectQuery } = require('../../../config/db');

module.exports = {
  createRepair: async (req, res) => {
    try {
      const { id } = req.params;

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

                        WHERE r1.request_id = @request_id; 

                                `;


      const valuesRepuests = { request_id: id };
      const resultRepuests = await executeSelectQuery(sqlRequests, valuesRepuests);

const sqlSystems = `
    SELECT 

        s.system_id, 
        s.system_name, 
        STRING_AGG(qp.part_name, ', ') AS part_names 
    FROM 
        Truck_vehicle_systems s 
    LEFT JOIN 
        Truck_repair_quotation_parts qp 
        ON s.system_id = qp.part_id AND qp.quotation_id = @quotation_id 
    GROUP BY 
        s.system_id, s.system_name; 
`;
const repairData = resultRepuests?.[0] || {};
const valueSystems = { quotation_id: repairData.quotation_id };
const resultSystems = await executeSelectQuery(sqlSystems, valueSystems);

console.log('test : ', resultSystems);''
      const pdfPath = await generateRepairReport(req.body, resultRepuests, resultSystems);

      res.download(pdfPath);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      res.status(500).json({ message: "ไม่สามารถสร้างรายงานได้" });
    }
  }
};
                       