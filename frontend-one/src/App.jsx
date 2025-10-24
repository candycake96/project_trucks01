import React from "react";
import Modal from "react-modal";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import Layout from "./containers/Layout";
import Home from "./components/home/Home";
import About from "./components/about/About";
import NewsPage from "./components/News/NewsPage";
import LoginPage from "./components/loginpage/LoginPage";
import ProtectedRoute from "./components/loginpage/ProtectedRoute";
import LayoutPage1 from "./containerpage1/LayoutPage1";
import FirstPage1 from "./componentspage1/homepage1/FirstPage1";
import UserProfile from "./containerpage1/UserProfile";
import AddNews from "./components/News/AddNews";
import NewsContent from "./components/News/NewsContent";
import EmployeesAddData from "./componentspage1/EmployeesUser/EmployeesAddData";
import MemoPage from "./componentspage1/memo/MemoPage";
import JobPosition from "./componentspage1/ManageOrganization/JobPosition";
import Department from "./componentspage1/ManageOrganization/Department";
import JobSection from "./componentspage1/ManageOrganization/JobSection";
import Branch from "./componentspage1/ManageOrganization/Branch";
import EmployeesShowtable from "./componentspage1/EmployeesUser/Employees.Show.table";
import EmployeesResing from "./componentspage1/EmployeesUser/EmployeesResing";
import EmployeesAccess from "./componentspage1/EmployeesUser/EmployeesAccess";
import MemoDetails from "./componentspage1/memo/MemoDetails";
import Calendar from "./components/calendar/Calendar";
import BookingRoom from "./componentspage1/bookingroom/BookingRoom";
import Homepage from "./containerpage1/Homepage";
import Companypolicy from "./componentspage1/companypolicy/Companypolicy";
import Call from "./componentspage1/coll/call";
import MemoManagerRights from "./componentspage1/memo/MemoManageRights";
import { UserContext } from "./componentspage1/localstorage/UserContext";
import BookingRoomDetails from "./componentspage1/bookingroom/BookingRoomDetails";
import BookingRoomAdd from "./componentspage1/bookingroom/MeetingRoomAdd";
import MeetingRoomAdd from "./componentspage1/bookingroom/MeetingRoomAdd";
import LoginTruck from "./components_truck/LoginTruck";
import LayoutTruck from "./containers_truck/LayoutTruck";
import TruckHome from "./components_truck/TruckHome";
import Driver from "./components_truck/driver/Driver";
import VehicleManagement from "./components_truck/truck/Vehicle/VehicleManagement";
import VehicleFrom from "./components_truck/truck/Vehicle/VehicleForm";

import VehicleAddForm from "./components_truck/truck/Vehicle/VehicleAddForm";
import OrganizationMenagement from "./componentspage1/ManageOrganization/OrganizationManagement";
import CompanyManagement from "./componentspage1/ManageOrganization/CompanyManagement";
import RepairRequestForm from "./components_truck/truck/Repair/RepairRequestForm";
import CarMileageShow from "./components_truck/truck/CarMileage/CarMileageShow";
import CarMileageDetails from "./components_truck/truck/CarMileage/CarMileageDetails";
import ExcelUploader from "./components_truck/truck/CarMileage/ExcelUploader";
import CarMainRepair from "./components_truck/truck/Repair/CarMainRepair";
import CarTaxRenewal_Main from "./components_truck/truck/CarTaxRenewal/CarTaxRenewal_Main";
import CarStopTaxRemittanc from "./components_truck/truck/CarTaxRenewal/CarStopTaxRemittance";
import CarCMI_Main from "./components_truck/truck/CarCMI/CarCMI_Main";
import CarInsurance_Main from "./components_truck/truck/Car_insurance/CarInsurance_Main";
import Vehicle_status from "./components_truck/truck/Vehicle_status/Vehicle_status";
import Insurance_Details from "./components_truck/truck/Car_insurance/Insurance_Details";
import InsuranceDataComparison from "./components_truck/truck/Car_insurance/InsuranceDataComparison";
import Vendor from "./components_truck/truck/Vandor/Vendor";
import Vendor_add from "./components_truck/truck/Vandor/Vendor_add";
import VendorInfo from "./components_truck/truck/Vandor/VendorInfo";
import Vehicle_parts_details from "./components_truck/truck/Parts/Vehicle_parts_dtails";
import Vehicle_parts_add from "./components_truck/truck/Parts/Vehicle_parts_add";
import MainternanceRequest from './components_truck/truck/Repair/MainternanceRequest';
import MaintenanceJob from "./components_truck/truck/Repair/MaintenanceJob";
import RepairRequestFormEdit from "./components_truck/truck/Repair/RepairRequestFormEdit";
import MaintenancPlanning from "./components_truck/truck/Repair/MaintenancePlanning";
import MainternanceAnalysisRequestJob from "./components_truck/truck/Repair/MainternanceAnalysisRequestJob";
import MainternanceAnalysisApprover_table_main from "./components_truck/truck/Repair/MainternanceAnalysisApprover_table_main";
import MainternanceApprovalManager from "./components_truck/truck/Repair/MainternanceApprovalManager";
import PM_setting from "./components_truck/truck/PreventiveMaintenance/PM_setting";
import RepairCloseList from "./components_truck/truck/Repair/CloseList/RepairCloseList";
import Vehicle_models from "./components_truck/truck/Vehicle/setting_vehicle/vehicle_models/vehicle_models";
import Vehicle_pm_start from "./components_truck/truck/PreventiveMaintenance/Vehicle_pm/Vehicle_pm_start";
import VehicleShowDataDetails from "./components_truck/truck/Vehicle/vehicle_details/VehicleShowDataDetails";
import Mainternance_report from "./components_truck/truck/Repair/Mainternance_report/Mainternance_report";
import ReportVehicleAndInsurancy from "./components_truck/truck/Report/ReportVehicleAndInsurancy/ReportVehicleAndInsurancy";
import MainternanceInvoice_main from "./components_truck/truck/Repair/MainternanceInvoice_main";
import MainternanceInvoice_detail from "./components_truck/truck/Repair/MainternanceInvoice_detail";
import MainternanceInvoice_showEdit from "./components_truck/truck/Repair/MainternanceInvoice_showEdit";
import MainternanceInvoice_showDetaile from "./components_truck/truck/Repair/MainternanceInvoice_showDetails";

Modal.setAppElement("#root");

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* เข้าสู่ระบบ Truck */}
          <Route index element={<LoginTruck />} />
          <Route path="LoginTruck" element={<LoginTruck />} />


          <Route path="/" element={<Layout />}>
            {" "}
            {/*  //เว็บเพจแรกเข้า */}
            {/* <Route index element={<Home />} /> */}
            <Route path="about" element={<About />} />
            <Route path="loginpage" element={<LoginPage />} />
            <Route path="newspage" element={<NewsPage />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="policy" element={<Companypolicy />} />
          </Route>
          <Route path="/page1" element={<LayoutPage1 />}>
            <Route index element={<FirstPage1 />} /> {/* Default for /page1 */}
            <Route path="userProfile" element={<UserProfile />} /> {/* /page1/userProfile */}
            <Route path="addNews" element={<AddNews />} />
            <Route path="newContent" element={<NewsContent />} />
            {/* <Route path="employeesadddata" element={<EmployeesAddData />} /> */}
            <Route path="memopage" element={<MemoPage />} />
            <Route path="memodetails" element={<MemoDetails />} />
            <Route path="memomanagerrights" element={<MemoManagerRights />} />
            <Route path="jobposition" element={<JobPosition />} />
            <Route path="department" element={<Department />} />
            <Route path="jobsection" element={<JobSection />} />
            <Route path="branch" element={<Branch />} />

            <Route path="employeesaccess" element={<EmployeesAccess />} />
            <Route path="bookingroom/:id" element={<BookingRoom />} />
            <Route path="bookingroomdetails" element={<BookingRoomDetails />} />

            <Route path="bookingroomadd" element={<BookingRoomAdd />} />
            <Route path="meetingroomadd" element={<MeetingRoomAdd />} />
            <Route path="homepage" element={<Homepage />} />
            <Route path="companypolicy" element={<Companypolicy />} />
            <Route path="call" element={<Call />} />
            <Route path="calendarcompany" element={<Calendar />} />


          </Route>
          <Route path="/truck" element={<LayoutTruck />}>
            <Route index element={<TruckHome />} /> {/* Default for /page1 */}
            <Route path="employeesadddata" element={<EmployeesAddData />} />
            <Route path="employeesshowtable" element={<EmployeesShowtable />} />
            <Route path="employeesresing" element={<EmployeesResing />} /> {/* หน้าข้อมูลพนักงานลาออก */}
            <Route path="driver" element={<Driver />} />
            <Route path="vehiclemanagement" element={<VehicleManagement />} /> {/* หน้าจัดการข้อมูล 'รถ' ทั้งหมด */}
            <Route path="vehiclefrom" element={<VehicleFrom />} />
            <Route path="vehicleaddform" element={<VehicleAddForm />} /> {/* หน้ารวมฟร์อมจัดเก็บข้อมูลรถ */}
            <Route path="organizationmanagment" element={<OrganizationMenagement />} /> {/* หน้าจัดการข้อมูลภายในสองค์กร */}
            <Route path="companymanagement" element={<CompanyManagement />} /> {/* หน้าจัดการข้อมูลองค์กร */}
            <Route path="RepairRequestForm" element={<RepairRequestForm />} /> {/* หน้าแจ้งซ่อม */}
            <Route path="CarMainRepair" element={<CarMainRepair />} /> {/* หน้าแจ้งซ่อม main */}
            <Route path="CarMileageShow" element={<CarMileageShow />} /> {/* หน้าเลขไมล์รถ */}
            <Route path="CarMileageDetails" element={<CarMileageDetails />} /> {/* หน้าเลขไมล์รถ */}
            <Route path="ExcelUploader" element={<ExcelUploader />} /> {/* หน้าเลขไมล์รถ */}
            <Route path="CarTaxRenewal_Main" element={<CarTaxRenewal_Main />} /> {/* หน้า main tax */}
            <Route path="CarCMI_Main" element={<CarCMI_Main />} /> {/* หน้า main CMI พรบ */}
            <Route path="CarInsurance_Main" element={<CarInsurance_Main />} /> {/* หน้า main  */}
            <Route path="CarStopTaxRemittanc" element={<CarStopTaxRemittanc />} /> {/* หน้า ม.89-79 */}
            <Route path="Vehicle_status/:id" element={<Vehicle_status />} /> {/* หน้า ม.89-79 แสดงข้อมูลแต่ละคันอย่างระเอียด */}
            <Route path="Insurance_Details" element={<Insurance_Details />} /> {/* หน้า  แสดงข้อมูลแต่ละคันอย่างระเอียด */}
            <Route path="InsuranceDataComparison" element={<InsuranceDataComparison />} /> {/* หน้า  เปรียบเทียบราคา ข้อมูล ประกันภัย */}
            <Route path="Vendor" element={<Vendor />} /> {/*  หน้า  ผู้จำหน่ายสินค้า/อู่ซ่อม */}
            <Route path="Vendor_add" element={<Vendor_add />} /> {/*  หน้า เพิ่ม  ผู้จำหน่ายสินค้า/อู่ซ่อม */}
            <Route path="VendorInfo" element={<VendorInfo />} /> {/*  หน้า แสดงข้อมูล  ผู้จำหน่ายสินค้า/อู่ซ่อม */}
            <Route path="Vehicle_parts_details" element={<Vehicle_parts_details />} /> {/*  หน้า แสดงข้อมูล  ราคาอะไหล่กลาง */}
            <Route path="Vehicle_parts_add" element={<Vehicle_parts_add />} /> {/*  หน้า แสดงข้อมูล  ราคาอะไหล่กลาง */}
            <Route path="MaintenanceRequest" element={<MainternanceRequest />} /> {/*  หน้า แสดงข้อมูล  ราคาอะไหล่กลาง */}
            <Route path="MaintenanceJob" element={<MaintenanceJob />} /> {/*  หน้า แสดงข้อมูล  ราคาอะไหล่กลาง */}
            <Route path="RepairRequestFormEdit" element={<RepairRequestFormEdit />} /> {/*  หน้า แก้ไข */}
            <Route path="MaintenancPlanning" element={<MaintenancPlanning />} /> {/*  หน้า แก้ไข */}
            <Route path="MainternanceAnalysisRequestJob" element={<MainternanceAnalysisRequestJob />} /> {/*  หน้า วิเคราะจากแผนกซ่อมบำรุง */}
            <Route path="MainternanceAnalysisApprover_table_main" element={<MainternanceAnalysisApprover_table_main />} />{/*  หน้า อนุมัติวิเคราะจากแผนกซ่อมบำรุง */}
            <Route path="MainternanceApprovalManager" element={<MainternanceApprovalManager />} />{/*  หน้า Manager อนุมัติวิเคราะจากแผนกซ่อมบำรุง */}
            <Route path="PM_setting" element={<PM_setting />} />{/*  หน้า PM  setting*/}
            <Route path="RepairCloseList" element={<RepairCloseList />} /> {/* ปิดงานซ่อม */}
            <Route path="Vehicle_models" element={<Vehicle_models />} /> {/* ปิดงานซ่อม */}
            <Route path="Vehicle_pm_start" element={<Vehicle_pm_start />} /> {/* เพิ่มข้อมูลรถ PM  */}
            <Route path="VehicleShowDataDetails" element={<VehicleShowDataDetails />} /> {/* แสดงข้อมูลรถทั้งหมด รายละเอียดรถ */}
            <Route path="Mainternance_report" element={<Mainternance_report />} />
            <Route path="ReportVehicleAndInsurancy" element={<ReportVehicleAndInsurancy />} />  {/* รายงานรถและประกัน */}
            <Route path="MainternanceInvoice_main" element={<MainternanceInvoice_main />} />  {/* ใบแจ้งหนี้ */}
            <Route path="MainternanceInvoice_detail" element={<MainternanceInvoice_detail />} />  {/* สร้าง ใบแจ้งหนี้ */}
            <Route path="MainternanceInvoice_showEdit" element={<MainternanceInvoice_showEdit />} />  {/* สร้าง ใบแจ้งหนี้ */}
            <Route path="MainternanceInvoice_showDetails" element={<MainternanceInvoice_showDetaile />} />  {/* สร้าง ใบแจ้งหนี้ */}

          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
