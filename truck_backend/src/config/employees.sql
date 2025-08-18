
CREATE TABLE employee_addresses (
    address_id INT IDENTITY(1,1) PRIMARY KEY, -- รหัสที่อยู่ (Primary Key)
    id_emp INT NOT NULL,                      -- รหัสพนักงาน (Foreign Key)
    address_type NVARCHAR(50) NOT NULL,       -- ประเภทที่อยู่ (current, permanent)
    house_number NVARCHAR(100),               -- หมายเลขบ้าน
    street NVARCHAR(255),                     -- ถนน
    city NVARCHAR(100),                       -- เมือง
    province NVARCHAR(100),                   -- จังหวัด
    postal_code NVARCHAR(10),                 -- รหัสไปรษณีย์
    country NVARCHAR(100),                    -- ประเทศ
    FOREIGN KEY (id_emp) REFERENCES employees(id_emp) -- เชื่อมกับพนักงาน
);


-- driver_licenses
CREATE TABLE driver_license (
    id_driver INT IDENTITY(1,1) PRIMARY KEY,
    id_emp INT NOT NULL FOREIGN KEY REFERENCES employees(id_emp),
    license_number NVARCHAR(50) NOT NULL,
    issued_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    license_type NVARCHAR(50) NOT NULL,
    issuing_authority NVARCHAR(100),
    status NVARCHAR(20) CHECK (status IN ('Active', 'Suspended', 'Expired')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 
CREATE TABLE driving_license_types (
    license_type_id INT IDENTITY(1,1) PRIMARY KEY, -- รหัสประเภทใบขับขี่ (Primary Key)
    license_code NVARCHAR(10) NOT NULL UNIQUE,    -- โค้ดของประเภทใบขับขี่ (ต้องไม่ซ้ำ)
    license_name NVARCHAR(255) NOT NULL           -- ชื่อประเภทใบขับขี่ (เช่น รถยนต์, รถบรรทุก)
);


 -- เงินเดือน
CREATE TABLE salaries (
    salary_id INT PRIMARY KEY IDENTITY(1,1),  -- ค่าของ salary_id จะเพิ่มขึ้นอัตโนมัติ
    id_emp INT,  -- รหัสพนักงาน
    base_salary DECIMAL(18,2),  -- เงินเดือนพื้นฐาน
    effective_date DATE,  -- วันที่เริ่มต้นของเงินเดือน
    CONSTRAINT fk_id_emp FOREIGN KEY (id_emp) REFERENCES employees(id_emp)  -- การเชื่อมโยงกับตาราง employees
);


-- ประกันสังคม
CREATE TABLE social_security (
    ss_id INT PRIMARY KEY IDENTITY(1,1),  -- รหัสการหักประกันสังคม
    id_emp INT,  -- รหัสพนักงาน
    contribution_rate DECIMAL(5,2),  -- อัตราการหัก เช่น 5% 
    contribution_amount DECIMAL(18,2),  -- จำนวนเงินที่หักจริง
    effective_date DATE,  -- วันที่เริ่มต้นที่การหักประกันสังคมมีผล
    last_updated DATETIME DEFAULT GETDATE(),  -- วันที่และเวลาที่แก้ไขล่าสุด
    CONSTRAINT fk_emp_id FOREIGN KEY (id_emp) REFERENCES employees(id_emp)  -- การเชื่อมโยงกับตาราง employees
);  


-- กองทุนสำรองเลี้ยงชีพ
CREATE TABLE provident_funds (
    pf_id INT PRIMARY KEY IDENTITY(1,1), -- รหัสกองทุนสำรองเลี้ยงชีพ
    id_emp INT, -- รหัสพนักงาน
    employee_rate DECIMAL(5,2), -- อัตราการหักจากพนักงาน (%)
    employer_rate DECIMAL(5,2), -- อัตราการสมทบจากนายจ้าง (%)
    employee_contribution DECIMAL(18,2), -- จำนวนเงินที่พนักงานจ่าย
    employer_contribution DECIMAL(18,2), -- จำนวนเงินที่นายจ้างสมทบ
    total_contribution DECIMAL(18,2), -- จำนวนเงินรวม (พนักงาน + นายจ้าง)
    effective_date DATE, -- วันที่เริ่มต้นที่มีผล
    CONSTRAINT fk_id_emp_provident FOREIGN KEY (id_emp) REFERENCES employees(id_emp) -- การเชื่อมโยงกับตาราง employees
);


-- company
CREATE TABLE company (
    company_id INT IDENTITY(1,1) PRIMARY KEY, -- กำหนดคีย์หลักพร้อม IDENTITY
    company_name NVARCHAR(255) NOT NULL,     -- ชื่อบริษัท
    company_address NVARCHAR(255) NOT NULL, -- ที่อยู่บริษัท
    status NVARCHAR(20) CHECK (status IN ('Active', 'Suspended', 'Expired')), -- สถานะบริษัท
    created_at DATETIME DEFAULT GETDATE(),  -- วันที่สร้าง (ใช้ GETDATE() แทน CURRENT_TIMESTAMP)
    updated_at DATETIME DEFAULT GETDATE()   -- วันที่แก้ไขล่าสุด
);

--  
CREATE TABLE Truck_vehicle_types (
    vehicle_type_id INT IDENTITY(1,1) PRIMARY KEY,
    vehicle_type_name VARCHAR(50) NOT NULL UNIQUE
);

-- 
CREATE TABLE Truck_car_types (
    car_type_id INT IDENTITY(1,1) PRIMARY KEY,
    car_type_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Truck_vehicle_usage_type (
    usage_type_id INT IDENTITY(1,1) PRIMARY KEY,
    usage_type NVARCHAR(50)  -- ลักษณะการใช้งานเก็บเป็นข้อความปกติ
);


CREATE TABLE Truck_vehicle_registration (
    reg_id           INT IDENTITY(1,1) PRIMARY KEY,  -- รหัสลงทะเบียน
    reg_date         DATE NOT NULL,                  -- วันที่ลงทะเบียน
    reg_number       VARCHAR(20) NOT NULL UNIQUE,    -- เลขทะเบียนรถ
    province         NVARCHAR(50) NOT NULL,          -- จังหวัดที่จดทะเบียน
    car_type_id      INT NOT NULL,                   -- FK ไปยังตาราง car_types
    chassis_number   VARCHAR(50) NOT NULL UNIQUE,    -- เลขตัวถัง
    usage_type_id    NVARCHAR(50),                   -- ลักษณะการใช้งาน
    car_brand        NVARCHAR(255),                  --ยี่ห้อรถ 
    model_no         NVARCHAR(50),                   -- รุ่นของรถ
    color            NVARCHAR(20),                   -- สีของรถ
    engine_brand     NVARCHAR(50),                   -- ยี่ห้อเครื่องยนต์
    engine_no        VARCHAR(50) UNIQUE,             -- เลขเครื่องยนต์
    cylinders        INT,                             -- จำนวนลูกสูบ
    veh_weight       DECIMAL(10,2),                  -- น้ำหนักรถ (ตัน)
    max_load         DECIMAL(10,2),                  -- น้ำหนักบรรทุก (ตัน)
    gross_weight     DECIMAL(10,2),                  -- น้ำหนักรวม (ตัน)
    possession_date  DATE,                            -- วันที่ครอบครอง 
    operators        NVARCHAR(100),                  -- ชื่อผู้ประกอบการ
    reg_doc_number   NVARCHAR(20),                   -- หนังสือสำคัณแสดงการจดทะเบียน
    nation           NVARCHAR(50),                   -- สัญชาติ
    addr             NVARCHAR(255),                   -- ที่อยู่
    trans_type       NVARCHAR(50),                   -- ประเภทการขนส่ง
    license_no       VARCHAR(50),                    -- เลขใบอนุญาต
    license_expiry   DATE,                            -- วันหมดอายุใบอนุญาต
    rights_to_use    NVARCHAR(255),                  -- สิทธิครอบครองรถ
    owner_name       NVARCHAR(100),                  -- เจ้าของกรรมสิทธิ์
    address          NVARCHAR(255),                  -- ที่อยู่ของเจ้าของ
    passenger_count  INT DEFAULT 0,                  -- จำนวนที่นั่ง
    file_download    VARCHAR(255),                   -- ไฟล์ .pdf เอกสาร
    engine_on_location  NVARCHAR(40),   --ที่อยู่เครื่อง
    chassis_number_location VARCHAR(255),  -- ที่อยู่ของเลขที่อยู่ตัวถัง
    engine_power        INT DEFAULT 0,                 -- แรงม้า
    vehicle_type_id     INT NOT NULL,                   -- FK ประเภทของรถ
    inspection_code     NVARCHAR(50), -- รหัสตรวจสภาพ
    document_order      INT NOT NULL, -- ลำดับ
    power_kw            DECIMAL(10,2),  -- กำลังเครื่องยนต์ (กิโลวัตต์)
    axle_count          INT,          -- จำนวนเพลา
    wheel_count         INT,         -- จำนวนล้อ
    tire_count          INT           -- จำนวนยาง


    FOREIGN KEY (car_type_id) REFERENCES Truck_car_types(car_type_id),
    FOREIGN KEY (vehicle_type_id) REFERENCES Truck_vehicle_types(vehicle_type_id)
);


CREATE TABLE Truck_auto_loans (
    finance_id INT IDENTITY(1,1) PRIMARY KEY,
    reg_id INT NOT NULL,
    loan_amount DECIMAL(10,2) NOT NULL, -- จำนวนเงินกู้
    interest_rate DECIMAL(5,2) NOT NULL, -- อัตราดอกเบี้ย (%)
    monthly_payment DECIMAL(10,2) NOT NULL, -- ค่างวดรายเดือน
    start_date DATE NOT NULL, -- วันที่เริ่มต้น
    end_date DATE NOT NULL, -- วันที่สิ้นสุด
    insurance_company VARCHAR(255) NOT NULL, -- เพิ่มชื่อบริษัทประกัน
    file_finance VARCHAR(255), -- ไฟล์แนบเอกสารทางการเงิน
    created_at DATETIME2 DEFAULT GETDATE(),  -- ✅ เปลี่ยนจาก TIMESTAMP เป็น DATETIME2
    updated_at DATETIME2 DEFAULT GETDATE(),  -- ✅ เพิ่มวันที่แก้ไขล่าสุด
    FOREIGN KEY (reg_id) REFERENCES Truck_vehicle_registration(reg_id) 
);

-- รถ + รถ
CREATE TABLE Truck_vehicle_pairing (
    pair_id          INT IDENTITY(1,1) PRIMARY KEY, -- รหัสจับคู่
    reg_id_1        INT NOT NULL,  -- รหัสลงทะเบียนของรถคันที่ 1 หัว
    reg_id_2        INT NOT NULL,  -- รหัสลงทะเบียนของรถคันที่ 2 หาง
    -- pairing_type    NVARCHAR(50) NOT NULL, -- ประเภทการจับคู่ (เช่น 'หัวลาก-หางพ่วง')
    start_date      DATE,  -- วันที่เริ่มจับคู่
    -- end_date        DATE,  -- วันที่สิ้นสุด (ถ้ามี)
    FOREIGN KEY (reg_id_1) REFERENCES Truck_vehicle_registration(reg_id),
    FOREIGN KEY (reg_id_2) REFERENCES Truck_vehicle_registration(reg_id),
    UNIQUE (reg_id_1, reg_id_2) -- ป้องกันการจับคู่ซ้ำ
);

-- คนขับรถ + รถ
CREATE TABLE Truck_driver_assignment (
    driver_assignment_id  INT IDENTITY(1,1) PRIMARY KEY, -- รหัสจับคู่
    reg_id               INT NOT NULL, -- รหัสลงทะเบียนรถ
    driver_id            INT NOT NULL, -- รหัสพนักงานขับรถ
    assigned_date        DATE NOT NULL, -- วันที่มอบหมาย
    end_date             DATE NULL, -- วันที่สิ้นสุด (NULL หมายถึงยังขับอยู่)
    assigned_by          NVARCHAR(100), -- ผู้ที่ทำการมอบหมาย
    notes                NVARCHAR(255), -- หมายเหตุเพิ่มเติม
    FOREIGN KEY (reg_id) REFERENCES Truck_vehicle_registration(reg_id),
    FOREIGN KEY (driver_id) REFERENCES employees(id_emp),
    UNIQUE (reg_id, driver_id, assigned_date) -- ป้องกันการมอบหมายซ้ำในวันเดียวกัน
);


-- เก็บเลขไมล์
CREATE TABLE Truck_car_mileage (
    id INT IDENTITY(1,1) PRIMARY KEY,  
    reg_id INT NOT NULL,  
    emp_id INT NOT NULL,  -- รหัสพนักงาน (Foreign Key)
    recorded_date DATE NOT NULL,  
    odometer INT NOT NULL,  -- เลขไมล์ที่คีย์เข้ามา (อาจถูกรีเซ็ต)
    true_odometer BIGINT NOT NULL,  -- เลขไมล์ที่แท้จริง (ไม่รีเซ็ต)
    notes TEXT,  
    created_at DATETIME DEFAULT GETDATE(),  
    updated_at DATETIME DEFAULT GETDATE(),  
    FOREIGN KEY (reg_id) REFERENCES Truck_vehicle_registration(reg_id) ON DELETE CASCADE,
    FOREIGN KEY (id_emp) REFERENCES employees(id_emp) -- เชื่อมกับพนักงาน 
);



CREATE TABLE Truck_vehicle_status (
    id INT IDENTITY(1,1) PRIMARY KEY,
    emp_id INT NOT NULL,
    reg_id INT NOT NULL,
    report_date DATE NOT NULL,
    report_type NVARCHAR(50) NOT NULL CHECK (report_type IN ('ม.79', 'ม.89','ขาย', 'หาย')),
    created_at DATETIME DEFAULT GETDATE(),
    reason NVARCHAR(255),
    attached_files NVARCHAR(255),  -- เก็บชื่อไฟล์ PDF หรือรูปภาพ

    CONSTRAINT FK_TruckVehicleStatus_Employee FOREIGN KEY (emp_id) 
        REFERENCES Employees(emp_id) ON DELETE CASCADE,

    CONSTRAINT FK_TruckVehicleStatus_Registration FOREIGN KEY (reg_id) 
        REFERENCES Truck_vehicle_registration(reg_id) ON DELETE CASCADE
);


CREATE TABLE Truck_car_insurance (
    insurance_id INT IDENTITY(1,1) PRIMARY KEY, -- รหัสประกัน
    insurance_converage_amount DECIMAL(18,2), -- จำนวนเงินคุ้มครอง
    nsurance_premium DECIMAL(18,2), -- ค่าเบี้ยประกัน
    insurance_company VARCHAR(255), -- ชื่อบริษัทประกัน
    insurance_start_date DATE, -- วันที่เริ่มต้นประกัน
    insurance_end_date DATE, -- วันที่สิ้นสุดประกัน
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- วันที่และเวลาที่อัพเดทล่าสุด
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- วันที่และเวลาที่สร้างข้อมูล
    insurance_vehicle_id INT,

);

-- ชั้นประกัน (Insurance Class)
CREATE TABLE Truck_car_insurance_class (
  id INT IDENTITY(1,1) PRIMARY KEY,
  insurance_class VARCHAR(50) NOT NULL
);

-- ประเภทการคุ้มครอง (Coverage Type)
CREATE TABLE Truck_car_insurance_coverage_type (
  id INT IDENTITY(1,1) PRIMARY KEY,
  coverage_type VARCHAR(50) NOT NULL
);


CREATE TABLE Truck_vendors_main (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_type VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    tax_id VARCHAR(20),
    payment_terms VARCHAR(100),
    warranty_policy TEXT,
    is_contract BOOLEAN DEFAULT FALSE,
    rating DECIMAL(2,1),
    file_certificate VARCHAR(255) NOT NULL,
    delivery_address TEXT,
    cerdit_terms NVARCHAR(100),
    Distributor_type_id NVARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Truck_vender (
    vendor_id INT IDENTITY(1,1) PRIMARY KEY,
    vendor_type_id INT, -- FK ไปยัง Truck_vendor_types
    vendor_name NVARCHAR(100),
    contact_person NVARCHAR(100),
    phone NVARCHAR(100),
    email NVARCHAR(100),
    address TEXT,
    delivery_address TEXT,
    tax_id NVARCHAR(100),
    organization_type_id INT, -- ระบุประเภทองค์กร เช่น บริษัท, หจก. (ต่างจาก vendor_type)
    file_vender TEXT,
    credit_terms NVARCHAR(100),
    status NVARCHAR(100), -- เช่น active / inactive
    warranty_policy TEXT,
    FOREIGN KEY (vendor_type_id) REFERENCES Truck_vendor_types(vendor_type_id)
    FOREIGN KEY (organization_type_id) REFERENCES Truck_vendor_types(organization_type_id)
);


CREATE TABLE Truck_organization_type (
    organization_type_id INT IDENTITY(1,1) PRIMARY KEY,
    organization_type_name NVARCHAR(100) -- เช่น อู่, ร้านค้า, องค์กร
);

CREATE TABLE Truck_vendor_types (
    vendor_type_id INT IDENTITY(1,1) PRIMARY KEY,
    vendor_type_name NVARCHAR(100) -- เช่น อู่, ร้านค้า, องค์กร
);


CREATE TABLE Truck_vendor_service_types (
    service_id INT IDENTITY(1,1) PRIMARY KEY,
    service_name NVARCHAR(100) -- เช่น เปลี่ยนยาง, ทำสี, ซ่อมช่วงล่าง
);


CREATE TABLE Truck_vendor_services (
    vendor_services_id INT IDENTITY(1,1) PRIMARY KEY,
    vendor_id INT,
    service_id INT,
    FOREIGN KEY (vendor_id) REFERENCES Truck_vender(vendor_id),
    FOREIGN KEY (service_id) REFERENCES Truck_vendor_service_types(service_id)
);


CREATE TABLE Truck_vendor_organization_type (
    organization_type_id INT IDENTITY(1,1) PRIMARY KEY,
    organization_type_name NVARCHAR(255) 
);

-----------------------------------------------

-- CREATE TABLE Truck_repair_requests (
--     request_id INT PRIMARY KEY IDENTITY(1,1),
--     request_informer INT NOT NULL, -- FK to employees (ผู้แจ้ง)
--     request_no VARCHAR(50) NOT NULL,
--     request_date DATE NOT NULL,
--     problem_description TEXT,
--     status VARCHAR(50), -- เช่น: รอดำเนินการ, ดำเนินการแล้ว, เสร็จสิ้น

--     created_at DATETIME DEFAULT GETDATE(),

--     -- Planning Section
--     planning_dy INT, -- FK to employees (ผู้วางแผน)
--     planning_vehice_availability VARCHAR(50), -- เช่น: พร้อม, ไม่พร้อม
--     planning_event_date DATE,
--     planning_event_time TIME,
--     planning_event_remarke TEXT,
--     planning_created_at_dispatch DATETIME,

--     -- Maintenance Section
--     maintenance_type VARCHAR(10), -- PM / CM
--     maintenance_analysis_result TEXT,
--     maintenance_start_date DATE,
--     maintenance_start_time TIME,
--     maintenance_inspection_dy INT, -- FK to employees
--     maintenance_inspection_date DATE,
--     maintenance_approval_dy INT, -- FK to employees
--     maintenance_approval_date DATE,

--     -- Vehicle Section
--     reg_id INT NOT NULL, -- FK to vehicles table
--     car_mileage INT, -- หรืออาจทำ FK ไปยัง Truck_car_mileage(id) ก็ได้

--     FOREIGN KEY (request_informer) REFERENCES employees(id_emp),
--     FOREIGN KEY (planning_dy) REFERENCES employees(id_emp),
--     FOREIGN KEY (maintenance_inspection_dy) REFERENCES employees(id_emp),
--     FOREIGN KEY (maintenance_approval_dy) REFERENCES employees(id_emp),
--     FOREIGN KEY (reg_id) REFERENCES Truck_vehicle_registration(reg_id)
--     -- หาก car_mileage เป็น FK จริง:
--     -- ,FOREIGN KEY (car_mileage) REFERENCES Truck_car_mileage(id)
-- );

CREATE TABLE Truck_repair_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    request_informer INT NOT NULL,                    -- FK ไปยัง employees
    request_no VARCHAR(50) NOT NULL UNIQUE,           -- เลขที่เอกสาร ห้ามซ้ำ
    request_date DATE NOT NULL,                       -- วันที่แจ้ง
    reg_id INT NOT NULL,                              -- FK ไปยังตารางรถ
    car_mileage_id INT,                               -- FK ไปยัง Truck_car_mileage
    status VARCHAR(50) DEFAULT 'pending',             -- สถานะ เช่น pending, approved, completed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,    -- วันที่บันทึกข้อมูล

    -- 🔗 Foreign Keys
    CONSTRAINT fk_request_informer FOREIGN KEY (request_informer) REFERENCES employees(emp_id),
    CONSTRAINT fk_reg_id FOREIGN KEY (reg_id) REFERENCES cars(reg_id),
    CONSTRAINT fk_car_mileage_id FOREIGN KEY (car_mileage_id) REFERENCES Truck_car_mileage(car_mileage_id)
);


--ระบบรถ (หมวดระบบซ่อม)
CREATE TABLE Truck_vehicle_systems  (
    system_id INT PRIMARY KEY IDENTITY(1,1),
    system_name VARCHAR(550), -- Role of the person performing the action (e.g., 'Technician', 'Manager')
);


-- อะไหล่ (รายการอะไหล่ทั้งหมด)
CREATE TABLE Truck_vehicle_parts (
    part_id INT PRIMARY KEY IDENTITY(1,1), 
    system_id INT NULL, -- อะไหล่อยู่ในระบบไหน 
    part_name VARCHAR(100) NOT NULL, 
    part_code VARCHAR(50) UNIQUE, 
    description TEXT, 
    unit VARCHAR(20), -- หน่วย เช่น ชิ้น, ลิตร
    current_stock INT, 
    minimum_stock INT, 
    price DECIMAL(10, 2), -- ราคาล่าสุดหรือราคามาตรฐาน
    created_at DATETIME DEFAULT GETDATE(), 
    FOREIGN KEY (system_id) REFERENCES Truck_repair_systems(system_id)
);


-- ข้อมูลแจ้งซ่อม + อะไหล่
CREATE TABLE Truck_repair_parts_used (
    parts_used_id INT IDENTITY(1,1) PRIMARY KEY,          -- รหัสอะไหล่ที่ใช้ในงานซ่อม
    request_id INT NOT NULL,                              -- อ้างถึง Truck_repair_requests(request_id)
    part_id INT,                                           -- อ้างถึง master parts (optional if manually entered)
    repair_part_name TEXT,                                -- ชื่ออะไหล่ที่ใช้จริง (manual)
    maintenance_type VARCHAR(20),                         -- เช่น CM, PM
    repair_part_price DECIMAL(10,2),                      -- ราคาต่อหน่วย
    repair_part_unit VARCHAR(50),                         -- หน่วย เช่น ชิ้น, กล่อง
    repair_part_qty DECIMAL(10,2),                        -- จำนวนที่ใช้

    -- 🔗 Foreign Keys
    CONSTRAINT fk_parts_request_id FOREIGN KEY (request_id) REFERENCES Truck_repair_requests(request_id),
    CONSTRAINT fk_parts_part_id FOREIGN KEY (part_id) REFERENCES master_parts(part_id)
);



-- เลขเอกสาร
CREATE TABLE document_headers_settings (
  doc_set_id INT IDENTITY(1,1) PRIMARY KEY,
  doc_set_type VARCHAR(50),
  date_part VARCHAR(255),
  seq_number INT,
  reset_type VARCHAR(10), -- เพราะ SQL Server ไม่มี ENUM จริงๆ
  created_at DATETIME,
  updated_at DATETIME
);


-- ตาราง permission_access
CREATE TABLE permission_access (
    permission_id INT IDENTITY(1,1) PRIMARY KEY,  -- Auto Increment PK
    permission_code NVARCHAR(50) NOT NULL UNIQUE, -- รหัสสิทธิ์ เช่น 'EMP_ADD'
    permission_type NVARCHAR(20) NOT NULL,        -- ประเภท เช่น 'main', 'child'
    permission_description NVARCHAR(255),         -- คำอธิบายสิทธิ์
    permission_module NVARCHAR(100)                -- ชื่อโมดูล เช่น 'Employee'
);

-- ตาราง employee_permission_access
CREATE TABLE employee_permission_access (
    emp_id INT NOT NULL,                          -- รหัสพนักงาน (FK)
    permission_code NVARCHAR(50) NOT NULL,       -- รหัสสิทธิ์ที่ให้
    PRIMARY KEY (emp_id, permission_code),
    CONSTRAINT FK_emp_perm_emp FOREIGN KEY (emp_id) REFERENCES employees(id_emp), -- สมมติมีตาราง employees
    CONSTRAINT FK_emp_perm_perm FOREIGN KEY (permission_code) REFERENCES permission_access(permission_code)
);


CREATE TABLE Truck_repair_planning (
    planning_id INT IDENTITY(1,1) PRIMARY KEY,
    request_id INT NOT NULL,
    planning_emp_id INT NOT NULL,
    planning_vehicle_availability VARCHAR(255),
    planning_event_date DATE,
    planning_event_time TIME,
    planning_event_remarke TEXT,
    planning_created_at_dispatch DATETIME DEFAULT GETDATE(),

    -- Foreign Keys
    CONSTRAINT fk_truck_request FOREIGN KEY (request_id) REFERENCES Truck_repair_requests(request_id),
    CONSTRAINT fk_truck_planner FOREIGN KEY (planning_emp_id) REFERENCES employees(id_emp)
);


-- ----------------------------------

CREATE TABLE Truck_repair_logs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,  -- รหัส log (เพิ่มอัตโนมัติ)
    request_id INT NOT NULL,               -- รหัสคำขอซ่อม
    action NVARCHAR(255) NOT NULL,         -- การกระทำ เช่น "อนุมัติ", "เริ่มซ่อม"
    action_date DATETIME NOT NULL DEFAULT GETDATE(), -- วันที่ดำเนินการ
    action_by NVARCHAR(255) NOT NULL,                -- ชื่อผู้กระทำ
    action_by_role NVARCHAR(100),          -- บทบาท เช่น "ช่าง", "หัวหน้า"
    remarks NVARCHAR(MAX),                 -- หมายเหตุ
    status nvarchar(255),

    -- Foreign Key (เพิ่มตามโครงสร้างจริงของคุณ)
    CONSTRAINT FK_TruckRepairLogs_Request FOREIGN KEY (request_id) REFERENCES Truck_repair_requests(request_id),
     CONSTRAINT FK_TruckRepairLogs_Emp FOREIGN KEY (action_by) REFERENCES employees(id_emp),
);




--(ตารางการเสนอราคาจาก vendor)--
CREATE TABLE repair_quotations (
    quotation_id INT PRIMARY KEY IDENTITY(1,1),
    request_id INT NOT NULL, -- FK to repair_requests
    vendor_id INT NOT NULL,  -- FK to vendors
    quotation_no VARCHAR(50), -- เลขที่ใบเสนอราคา (ถ้ามี)
    quotation_date DATE,
    total_price DECIMAL(12,2),
    quotation_file_path VARCHAR(255), -- แนบไฟล์ PDF หรือรูปภาพก็ได้
    status VARCHAR(50) DEFAULT 'เสนอมาแล้ว', -- เช่น: เสนอมาแล้ว, ถูกเลือก, ไม่ถูกเลือก
    remarks TEXT,
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (request_id) REFERENCES repair_requests(request_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id)
);

---------------------------------------


CREATE TABLE Truck_repair_analysis (
    analysis_id INT PRIMARY KEY IDENTITY(1,1),        -- รหัสวิเคราะห์ (PK)
    request_id INT NOT NULL,                           -- อ้างอิงแจ้งซ่อม
    analyze_date DATE,                                 -- วันที่วิเคราะห์
    is_immediate_fix BIT,                              -- ซ่อมทันที (true/false)
    remark TEXT,                                         -- หมายเหตุ
    is_send_to_garage BIT,                             -- ต้องส่งอู่หรือไม่
    vendor_id INT,                                     -- อู่ซ่อม (ถ้ามี)
    estimated_cost DECIMAL(18, 2),                     -- ราคาประเมิน
    is_quotation_required BIT DEFAULT 0,               -- มีใบเสนอราคาหรือไม่
    analysis_emp_id INT,                               -- พนักงานที่วิเคราะห์
     urgent_repair BIT DEFAULT 0,                      -- จำเป็นต้องซ่อมด่วนทันที
    inhouse_repair BIT DEFAULT 0,                      -- แผนกช่างซ่อมเองได้
    send_to_garage BIT DEFAULT 0;                      -- ต้องส่งอู่
    is_pm BIT DEFAULT 0,                               -- PM (Preventive Maintenance)
    is_cm BIT DEFAULT 0,                            -- CM (Corrective Maintenance)
    created_at DATETIME DEFAULT GETDATE();

    -- Foreign Key Constraints
    CONSTRAINT FK_analysis_request FOREIGN KEY (request_id)
        REFERENCES Truck_repair_requests(request_id),

    CONSTRAINT FK_analysis_vendor FOREIGN KEY (vendor_id)
        REFERENCES Truck_vendor(vendor_id),

    CONSTRAINT FK_analysis_employee FOREIGN KEY (analysis_emp_id)
        REFERENCES employees(id_emp)
);


CREATE TABLE Truck_repair_garage_quotation (
    quotation_id INT PRIMARY KEY IDENTITY(1,1),
    analysis_id INT NOT NULL,
    vender_id INT NOT NULL,
    quotation_date DATE,
    quotation_file VARCHAR(255),
    is_selected BIT DEFAULT 0, 
    note TEXT,
    vendor_name VARCHAR(255), 

    -- Foreign Key Constraints
    CONSTRAINT FK_quotation_analysis FOREIGN KEY (analysis_id)
        REFERENCES Truck_repair_analysis(analysis_id),

    CONSTRAINT FK_quotation_garage FOREIGN KEY (vender_id)
        REFERENCES Truck_vendor(vendor_id)
);



CREATE TABLE Truck_repair_quotation_parts (
    quotation_parts_id INT IDENTITY(1,1) PRIMARY KEY,         -- รหัสอะไหล่ที่ใช้ในงานซ่อม
    quotation_id INT NOT NULL,                                -- FK ถึง Truck_repair_garage_quotation
    part_id INT NULL,                                         -- FK ถึง Truck_vehicle_parts (optional)
    part_name VARCHAR(MAX) NULL,                       -- ชื่ออะไหล่ที่ใช้จริง
    maintenance_type VARCHAR(50) NULL,                        -- ประเภทการซ่อม เช่น CM, PM
    part_price DECIMAL(18,2) NOT NULL,                 -- ราคาต่อหน่วย
    part_unit VARCHAR(50) NULL,                        -- หน่วย เช่น ชิ้น, กล่อง
    part_qty DECIMAL(18,2) NOT NULL,                   -- จำนวนที่ใช้
    part_discount DECIMAL(5,2) NOT NULL DEFAULT 0,     -- ส่วนลด (%)
    is_approved_part BIT NOT NULL DEFAULT 0,                   -- ได้รับการอนุมัติหรือไม่
    approval_checked BIT NOT NULL DEFAULT 0 --มีการเช็คอนุมัติแล้วหรือยัง 

CONSTRAINT FK_QuotationParts_Quotation 
FOREIGN KEY (quotation_id) REFERENCES Truck_repair_garage_quotation(quotation_id),

CONSTRAINT FK_QuotationParts_Parts
FOREIGN KEY (part_id) REFERENCES Truck_vehicle_parts(part_id)

);


---อนุมัตงานซ่อม	
CREATE TABLE Truck_repair_analysis_approver (
    approver_id INT IDENTITY(1,1) PRIMARY KEY,  -- Primary Key
    analysis_id INT NOT NULL,                   -- อ้างอิงใบวิเคราะห์การซ่อม
    approver_emp_id INT NOT NULL,               -- รหัสพนักงานผู้อนุมัติ
    approver_name VARCHAR(255),                 -- ชื่อผู้อนุมัติ (optional)
    position VARCHAR(255),                      -- ตำแหน่งผู้อนุมัติ
    approval_status VARCHAR(20) NOT NULL,       -- สถานะ เช่น pending, approved, rejected 
    approval_date DATETIME,                     -- วันที่อนุมัติ
    remark TEXT,                                -- หมายเหตุ

    -- ความสัมพันธ์กับ employees
    CONSTRAINT FK_Approver_Employee FOREIGN KEY (approver_emp_id)
        REFERENCES employees(id_emp),

    -- ความสัมพันธ์กับ Truck_repair_analysis
    CONSTRAINT FK_Approver_Analysis FOREIGN KEY (analysis_id)
        REFERENCES Truck_repair_analysis(analysis_id)
);

-- ผู้อนุมัติคนสุดท้าย
CREATE TABLE Truck_repair_approver (
    approver_id INT IDENTITY(1,1) PRIMARY KEY,
    request_id INT NOT NULL,                          -- อ้างอิงจากตารางแจ้งซ่อม
    approver_emp_id INT NOT NULL,                     -- รหัสพนักงานผู้อนุมัติ
    approver_name VARCHAR(255),                   -- ถ้าไม่จำเป็นสามารถละไว้แล้ว JOIN จาก employees
    approval_status VARCHAR(20),                      -- สถานะ เช่น 'approved', 'pending', 'rejected'
    approval_date DATETIME,                           -- วันที่อนุมัติ
    remark TEXT,                                      -- หมายเหตุ

    -- Foreign Key (ถ้าต้องการความสัมพันธ์)
    CONSTRAINT FK_TruckRepair_Request FOREIGN KEY (request_id) REFERENCES Truck_repair_requests(request_id),
    CONSTRAINT FK_TruckRepair_Approver_Employee FOREIGN KEY (approver_emp_id) REFERENCES employees(id_emp)
);

-- ปิดงานซ่อมบำรุง
CREATE TABLE Truck_repair_close (
    close_id INT IDENTITY(1,1) PRIMARY KEY,             -- รหัสปิดงาน
    request_id INT NOT NULL,                            -- FK อ้างถึง Truck_repair_requests
    close_date DATE NOT NULL,                           -- วันที่ปิดงาน
    close_remark NVARCHAR(1000),                        -- หมายเหตุ (กำหนดขนาดแทน MAX เพื่อความเข้ากันได้)
    closed_by INT NOT NULL,                             -- ผู้ปิดงาน (FK พนักงาน)
    close_file NVARCHAR(255),                           -- ไฟล์แนบ เช่น PDF
    status_after_close NVARCHAR(50),                    -- สถานะหลังปิดงาน
    created_at DATETIME DEFAULT GETDATE(),              -- เวลา timestamp

    -- Foreign Keys
    CONSTRAINT FK_TruckRepairClose_Request 
        FOREIGN KEY (request_id) REFERENCES Truck_repair_requests(request_id),
    CONSTRAINT FK_TruckRepairClose_Employee 
        FOREIGN KEY (closed_by) REFERENCES employees(id_emp)
);



CREATE TABLE Truck_vehicle_models (   
    model_id INT PRIMARY KEY IDENTITY(1,1),  -- รหัสอัตโนมัติ
    brand NVARCHAR(100) NOT NULL,            -- ยี่ห้อ เช่น ISUZU, TOYOTA
    model NVARCHAR(100) NOT NULL             -- รุ่น เช่น D-MAX, HILUX
);



-- ตารางรายการซ่อมบำรุง
CREATE TABLE Truck_maintenance_items (
    item_id INT IDENTITY(1,1) PRIMARY KEY,               -- รหัสรายการซ่อม
    item_name NVARCHAR(255) NOT NULL,                    -- ชื่อรายการซ่อม เช่น เปลี่ยนน้ำมันเครื่อง
    created_at DATETIME DEFAULT GETDATE(),               -- วันที่เพิ่ม
    updated_at DATETIME DEFAULT GETDATE(),               -- วันที่แก้ไขล่าสุด
    status NVARCHAR(50) DEFAULT 'active'                 -- สถานะ: active/inactive
);

-- ตารางระยะทางการซ่อมบำรุง
CREATE TABLE Truck_maintenance_distances (
    distance_id INT IDENTITY(1,1) PRIMARY KEY,           -- รหัสระยะทาง
    distance_km INT NOT NULL,                            -- ระยะทาง (กิโลเมตร) เช่น 5,000
    created_at DATETIME DEFAULT GETDATE(),               -- วันที่เพิ่ม
    updated_at DATETIME DEFAULT GETDATE(),               -- วันที่แก้ไขล่าสุด
    status NVARCHAR(50) DEFAULT 'active'                 -- สถานะ: active/inactive
);


CREATE TABLE Truck_maintenance_plan (
    plan_id INT IDENTITY(1,1) PRIMARY KEY, -- รหัสแผนการซ่อมบำรุง (Primary Key)
    model_id INT NOT NULL, -- รหัสรุ่นรถ อ้างอิงจากตาราง vehicle_models
    item_id INT NOT NULL, -- รหัสรายการซ่อมบำรุง อ้างอิงจากตาราง maintenance_items
    distance_id INT NOT NULL, -- รหัสระยะทาง อ้างอิงจากตาราง maintenance_distances
    is_required BIT NOT NULL DEFAULT 1, -- จำเป็นต้องซ่อมบำรุงหรือไม่ (ค่าเริ่มต้นคือ TRUE)
    
    FOREIGN KEY (model_id) REFERENCES Truck_vehicle_models(model_id),
    FOREIGN KEY (item_id) REFERENCES Truck_maintenance_items( item_id),
    FOREIGN KEY (distance_id) REFERENCES Truck_maintenance_distances(distance_id)
);

------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------
-- เพื่อผูกตาราง 
ALTER TABLE Truck_vehicle_registration
ADD model_id INT;

ALTER TABLE Truck_vehicle_registration
ADD CONSTRAINT fk_vehicle_registration_model
FOREIGN KEY (model_id) REFERENCES Truck_vehicle_models(model_id);



CREATE TABLE emp_signature (
    signature_id INT IDENTITY(1,1) PRIMARY KEY,
    signature VARCHAR(255),
    created_at  DATETIME DEFAULT GETDATE(),
    emp_id INT NOT NULL,
    FOREIGN KEY (emp_id) REFERENCES employees(id_emp)
);


----------------------------------------------

-- เพิ่มฟิว
ALTER TABLE Truck_repair_requests
ADD signature_id INT NULL;

-- (ถ้าใช้ foreign key)
ALTER TABLE Truck_repair_requests
ADD CONSTRAINT FK_Repair_Signature
FOREIGN KEY (signature_id)
REFERENCES emp_signature(signature_id);

-----------------------------------------------

-- เพิ่มฟิว
ALTER TABLE Truck_maintenance_items
ADD part_id INT NULL;

-- (ถ้าใช้ foreign key)
ALTER TABLE Truck_maintenance_items
ADD CONSTRAINT FK_Maintenance_Items
FOREIGN KEY (part_id)
REFERENCES Truck_vehicle_parts(part_id);

------------------------------------

-- สร้าง
CREATE TABLE Truck_pm_records (
    pm_record_id INT IDENTITY(1,1) PRIMARY KEY,  -- รหัสระเบียนการ PM
    vehicle_id INT NOT NULL,                    -- รหัสรถ
    request_id INT NULL,                        -- รหัสงานแจ้งซ่อม (อาจจะ NULL ได้)
    pm_date DATE NOT NULL,                      -- วันที่ทำ PM
    mileage_at_pm INT NOT NULL,                 -- เลขไมล์จริงในวันที่ทำ PM
    technician_emp_id INT NOT NULL,             -- รหัสพนักงานที่ทำ PM
    pm_type NVARCHAR(255) NOT NULL,             -- ประเภทของการ PM เช่น เปลี่ยนน้ำมัน
    remark NVARCHAR(500) NULL,                  -- หมายเหตุเพิ่มเติม
    created_at DATETIME DEFAULT GETDATE(),      -- วันที่บันทึกข้อมูล
    status VARCHAR(100) NULL

    FOREIGN KEY (vehicle_id) REFERENCES Truck_vehicle_registration(reg_id),
    FOREIGN KEY (technician_emp_id) REFERENCES employees(emp_id),
    FOREIGN KEY (request_id) REFERENCES Truck_repair_requests(request_id)
);



