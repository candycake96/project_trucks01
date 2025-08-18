CREATE TABLE company (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_address TEXT NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    company_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    company_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    company_logo VARCHAR(255) NULL
);

CREATE TABLE branches (
    id_branches INT AUTO_INCREMENT PRIMARY KEY,  -- รหัสสาขา (Primary Key)
    branch_name VARCHAR(100) NOT NULL,          -- ชื่อสาขา
    branch_address TEXT NOT NULL,                -- ที่อยู่สาขา
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- วันที่สร้างข้อมูล
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- วันที่อัปเดตข้อมูล
    branch_status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',  -- สถานะสาขา
    company_id INT,  -- FK ไปยังตาราง company
    CONSTRAINT fk_branches_company FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
);

CREATE TABLE departments (
    id_department INT AUTO_INCREMENT PRIMARY KEY,
    name_department VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    department_status VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    company_id INT,
    CONSTRAINT fk_departments_company FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
);


CREATE TABLE positions (
    id_positions INT AUTO_INCREMENT PRIMARY KEY,
    name_position VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    company_id INT,
    position_status VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    CONSTRAINT fk_positions_company FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
);




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

    av.approver_emp_id AS approval_emp_id,
    av.approver_name AS approval_name,
    av.approval_status AS approval_status_end,
    av.approval_date AS approval_date_end,
    av.remark AS remark_end,

    q.quotation_id, 
    
    ISNULL(qsum.total_approved_cost, 0) AS total_approved_cost

FROM Truck_repair_requests r1
INNER JOIN employees e1 ON r1.request_informer_emp_id = e1.id_emp
INNER JOIN Truck_vehicle_registration r2 ON r1.reg_id = r2.reg_id
INNER JOIN branches b ON r2.id_branch = b.id_branch
INNER JOIN Truck_car_types ct ON r2.car_type_id = ct.car_type_id

LEFT JOIN Truck_repair_planning p ON r1.request_id = p.request_id
LEFT JOIN employees e2 ON p.planning_emp_id = e2.id_emp

LEFT JOIN Truck_repair_analysis a ON r1.request_id = a.request_id
LEFT JOIN employees e3 ON a.analysis_emp_id = e3.id_emp

LEFT JOIN Truck_repair_analysis_approver ap ON a.analysis_id = ap.analysis_id
LEFT JOIN employees e4 ON ap.approver_emp_id = e4.id_emp

LEFT JOIN Truck_repair_approver av ON r1.request_id = av.request_id

LEFT JOIN Truck_repair_garage_quotation q ON a.analysis_id = q.analysis_id


-- รวมยอดราคาสุทธิของอะไหล่ที่อนุมัติแล้ว (เฉพาะใบเสนอราคาที่ถูกเลือก)
LEFT JOIN (
    SELECT 
        q.quotation_id,
        SUM((p.part_price * p.part_qty) - p.part_discount + p.part_vat) AS total_approved_cost
    FROM Truck_repair_quotation_parts p
    INNER JOIN Truck_repair_garage_quotation q ON p.quotation_id = q.quotation_id
    WHERE p.is_approved_part = 'true' AND q.is_selected = 'true'
    GROUP BY q.quotation_id
) qsum ON r1.request_id = qsum.quotation_id

WHERE r1.request_id = 40;


