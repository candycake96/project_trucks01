import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SidebarTruck.css";

const SidebarPage1 = ({ isSidebarOpen, toggleSidebar }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const [user, setUser] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      const parsedUser = parsed; // << ใช้ parsed ตรง ๆ เพราะไม่มี .user ซ้อนอยู่
// console.log("parsed:", parsed);
// console.log("parsedUser:", parsedUser);

      const permissionMap = {
        1: [
          { submenu_id: 1, submenu_name: "เพิ่มข้อมูลพนักงาน", path: "/truck/employeesadddata", code: "EMP_ADD" },
          { submenu_id: 2, submenu_name: "ข้อมูลพนักงาน (แก้ไข)", path: "/truck/employeesshowtable", code: "EMP_DETAILS_EDIT" },
          { submenu_id: 3, submenu_name: "ข้อมูลพนักงานลาออก", path: "/truck/employeesresing", code: "EMP_RESIGN" }
        ],
        2: [
          { submenu_id: 4, submenu_name: "องค์กร / สาขา / แผนก", path: "/truck/organizationmanagment", code: "ORG_COMPANY" },
          { submenu_id: 5, submenu_name: "เพิ่มข้อมูลจัดการองค์กร", path: "/truck/companymanagement", code: "COMPANY_ADD" }
        ],
        3: [
          { submenu_id: 6, submenu_name: "ข้อมูลรถ", path: "/truck/vehiclemanagement", code: "VEHICLE_VIEW" },
          { submenu_id: 7, submenu_name: "ข้อมูลรถต่อ ภาษี", path: "/truck/CarTaxRenewal_Main", code: "TAX_VIEW" },
          { submenu_id: 8, submenu_name: "ข้อมูลรถต่อ พรบ.", path: "/truck/CarCMI_Main", code: "CMI_VIEW" },
          { submenu_id: 9, submenu_name: "ข้อมูลรถต่อ ประกัน", path: "/truck/CarInsurance_Main", code: "INSURANCE_VIEW" },
          { submenu_id: 10, submenu_name: "รายงานเลขไมล์รถ", path: "/truck/CarMileageShow", code: "MILEAGES_VIEW" },
          { submenu_id: 11, submenu_name: "รายงานรถ ม.79/ม.89", path: "/truck/CarStopTaxRemittanc", code: "CAR_STOP_VIEW" },
          { submenu_id: 12, submenu_name: "ตั้งค่าข้อมูลรถ", path: "/truck/Vehicle_models", code: "" }, // รอ
          { submenu_id: 13, submenu_name: "รายงานสรุปยานพาหนะและประกันภัย", path: "/truck/ReportVehicleAndInsurancy", code: "" } // รอ
        ],
        4: [
          { submenu_id: 14, submenu_name: "ผู้จำหน่ายสินค้า/อู่ซ่อม", path: "/truck/Vendor", code: "VENDER_VIEW" },
          { submenu_id: 15, submenu_name: "ราคากลางอะไหล่รถ", path: "/truck/Vehicle_parts_details", code: "" }
        ],
        5: [
          { submenu_id: 16, submenu_name: "แจ้งซ่อม/งานซ่อม", path: "/truck/MaintenanceRequest", code: "REQUEST_VIEW" },
          { submenu_id: 17, submenu_name: "ตรวจสอบความพร้อม", path: "/truck/MaintenancPlanning", code: "CHECK_REQUEST_CAR_VIEW" },
          { submenu_id: 18, submenu_name: "วิเคราะห์แผนซ่อมบำรุง", path: "/truck/MainternanceAnalysisRequestJob", code: "MA-COST-VEHICCLE_VIEW" },
          { submenu_id: 19, submenu_name: "ตรวจสอบแผนซ่อมบำรุง", path: "/truck/MainternanceAnalysisApprover_table_main", code: "VIEW_CAR_CHECK_DETAIL" },
          { submenu_id: 20, submenu_name: "อนุมัติงานซ่อมบำรุง", path: "/truck/MainternanceApprovalManager", code: "VIEW_MANAGER_APPROVAL" },
          { submenu_id: 21, submenu_name: "ใบแจ้งหนี้", path: "/truck/MainternanceInvoice_main", code: "REQUEST_INVOICE" },
          { submenu_id: 22, submenu_name: "ปิดงานซ่อมบำรุง", path: "/truck/RepairCloseList", code: "CANCEL_REPAIR_VIEW" },
          { submenu_id: 23, submenu_name: "รายงานซ่อมบำรุง", path: "/truck/Mainternance_report", code: "" }
        ],
        6: [
          { submenu_id: 24, submenu_name: "ข้อมูลคนขับ", path: "/truck/driver", code: "VEHICLE_PAIR_DRIVER" }
        ]
      };


      parsedUser.module_name = parsedUser.module_name.map((mod) => {
        const perms = permissionMap[mod.module_id] || [];
        const allowed = perms.filter(
          (s) => !s.code || parsedUser.permission_codes.includes(s.code)
        );
        return { ...mod, submenus: allowed };
      });

      setUser(parsedUser);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการอ่าน user:", err);
    }
  }
}, []);

      const getModuleIcon = (moduleId) => {
  switch (moduleId) {
    case 1:
      return <i className="bi bi-person-fill"></i>; // ข้อมูลพนักงาน
    case 2:
      return <i className="bi bi-building"></i>; // ข้อมูลองค์กร
    case 3:
      return <i className="bi bi-truck"></i>; // จัดการรถ
    case 4:
      return <i className="bi bi-shop"></i>; // ผู้จำหน่าย
    case 5:
      return <i className="bi bi-tools"></i>; // ซ่อมบำรุง
    default:
      return <i className="bi bi-folder-fill"></i>; // default
  }
}
  return (
    <div className={`d-flex flex-column p-3 position-fixed ${isSidebarOpen ? "w-64" : "w-0"}`}
      style={{ height: "100%", zIndex: 1050, transition: "width 0.3s", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/truck" className="navbar-brand text-decoration-none fw-bolder" style={{ color: "#083b72" }}>NCL Thailand (TMS)</Link>
        <i onClick={toggleSidebar} className={`bi bi-chevron-double-left sidebar-toggle-icon ${isSidebarOpen ? "" : "collapsed"}`}></i>
      </div>

      <ul className="nav flex-column mb-auto sidebar-nav">
        <li className="nav-item">
          <Link to="/truck" className={`nav-link ${location.pathname === "/truck" ? "active" : ""}`}>
            <i className="bi bi-robot"></i> หน้าแรก
          </Link>
        </li>

        {user?.module_name?.map((module, index) => (
          <li key={index} className="nav-item">

<button onClick={() => toggleDropdown(module.module_id)} className="nav-link">
  {getModuleIcon(module.module_id)} {module.module_name}
</button>


            {activeDropdown === module.module_id && (
              <ul className="list-unstyled ps-4">
                {module.submenus.map((submenu) => (
                  <li key={submenu.submenu_id}>
                    <Link to={submenu.path} className={`nav-link ${location.pathname === submenu.path ? "active" : ""}`}>
                      {submenu.submenu_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarPage1;
