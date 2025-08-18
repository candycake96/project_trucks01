import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // ใช้ดึงข้อมูลที่ถูกส่งมาจากหน้าอื่นผ่าน <Link to="..." state={...} />
import { apiUrl } from "../../../config/apiConfig";
import PlanningRepair from "./PlanningRepair";
import NavMainternanceJob from "./navMainternanceJob";
import MainternanceAnanlysis_ShowDetails from "./MainternanceAnalysis_ShowDetails";
import MainternanceRepairRequestDetails from "./MainternanceRepairRequestDetails";
import "bootstrap-icons/font/bootstrap-icons.css";
import MainternanceAnalysisApprover from "./MainternanceAnalysisApprover";
import MainternanceAnalysisApproverMain from "./MainternanceAnalysisApproverMain";
import MainternanceApprover_mgr_add from "./MainternanceApprover_mgr_add";
import { Table, Button, Spinner } from "react-bootstrap";
import Modal_Closing from "./CloseList/modal/Modal_Closing";
import Modal_repair_cancel_ganaral from "./Cancel/Modal/Modal_repair_canael_genaral";

const MaintenanceJob = () => {


    const [loading, setLoading] = useState(false);
    // ข้อมูลการปิดงานแจ้งซ่อม
    const [dataClosingJob, setdataClosingJob] = useState([]);
    const [formData, setFormData] = useState({
        request_id: "",
        request_informer_emp_id: "",
        request_no: "",
        request_date: "",
        status: "",
        reg_id: "",
        car_mileage: "",
        fname: "",
        lname: "",
        reg_number: "",
    });



    const location = useLocation();
    const [dataRepairID] = useState(location.state || {}); // รับค่าจาก state ที่ส่งมาผ่าน Link
    const [fromPage] = useState(location.state?.fromPage || "");
    console.log(dataRepairID); // ✅ ตรวจสอบข้อมูลที่ถูกส่งมา

    // แปลง วัน/เดือน/ปี
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        return date.toLocaleDateString("th-TH", options); // แสดง 04/07/2025
    };


    const [requestParts, setRequestParts] = useState([]);
    // ดึงข้อมูลจาก API
    useEffect(() => {
        const fetchRequestAndParts = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/repair_requests_and_part_detail/${dataRepairID?.request_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                setRequestParts(response.data);
            } catch (error) {
                console.error("Error fetching parts:", error);
            }
        };

        if (dataRepairID?.request_id) {
            fetchRequestAndParts();
        }
    }, [dataRepairID]);

    const [user, setUser] = useState(null);

    // โหลดข้อมูลจาก localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed); // เซ็ต user
        }
    }, []);

    // ฟังก์ชันเช็คสิทธิ์
    const permissions = user?.permission_codes || [];
    const hasPermission = (code) => permissions.includes(code);


    // เมื่อ requestParts มีข้อมูลแล้ว ค่อย setFormData
    useEffect(() => {
        if (requestParts?.request_id) {
            setFormData({
                request_id: requestParts.request_id,
                request_informer_emp_id: requestParts.request_informer_emp_id,
                request_no: requestParts.request_no,
                request_date: requestParts.request_date,
                status: requestParts.status,
                reg_id: requestParts.reg_id,
                car_mileage: requestParts.car_mileage,
                fname: requestParts.fname,
                lname: requestParts.lname,
                reg_number: requestParts.reg_number,
            });
            if (Array.isArray(requestParts.parts_used)) {
                const mappedParts = requestParts.parts_used.map((item) => {
                    const price = parseFloat(item.repair_part_price) || 0;
                    const qty = parseFloat(item.repair_part_qty) || 0;
                    const vat = parseFloat(item.repair_part_vat) || 0;
                    const subtotal = price * qty;
                    const total = subtotal + (subtotal * vat / 100);
                    return {
                        item_id: item.item_id || "",
                        part_id: item.part_id || "",
                        system_name: item.system_name || "",
                        part_name: item.repair_part_name || "",
                        price: price.toString(),
                        unit: item.repair_part_unit || "",
                        maintenance_type: item.maintenance_type || "",
                        qty: qty.toString(),
                        discount: "",
                        vat: vat.toString(),
                        total: total.toFixed(2),
                    };
                });
                setParts(mappedParts);
            } else {
                setParts([]);
            }
        }
    }, [requestParts]);

    const [summary, setSummary] = useState({
        total: 0,
        vat: 0,
        grandTotal: 0,
    });


    const [parts, setParts] = useState([
        { item_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" },
    ]);

    const handleAddPart = () => {
        setParts([...parts, { item_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" }]);
    };

    // ฟังก์ชันรับข้อมูลจาก Modal_vehicle_parts_add
    const handleDataFromAddModal = (data) => {
        if (selectedPartIndex !== null) {
            const updatedParts = [...parts];
            updatedParts[selectedPartIndex] = {
                ...updatedParts[selectedPartIndex],
                ...data
            };
            setParts(updatedParts);
            setSelectedPartIndex(null); // reset after update
        } else {
            setParts([...parts, data]); // fallback: add new
        }
    };

    // ฟังก์ชันลบข้อมูลอะไหล่
    const handleRemovePart = (index) => {
        const updatedParts = [...parts];
        updatedParts.splice(index, 1);
        setParts(updatedParts);
    };


    // ฟังก์ชันการเปลี่ยนแปลงข้อมูลอะไหล่  
    const handleChange = (index, field, value) => {
        const updatedParts = [...parts];
        updatedParts[index][field] = value;

        // แปลงเป็นตัวเลขเพื่อคำนวณ
        const price = parseFloat(updatedParts[index].price) || 0;
        const qty = parseFloat(updatedParts[index].qty) || 0;
        const vat = parseFloat(updatedParts[index].vat) || 0;
        const discount = parseFloat(updatedParts[index].discount) || 0;

        const subtotal = price * qty;
        const total = subtotal + (subtotal * vat / 100); // รวม VAT
        // const grandTotal = total - discount; 
        updatedParts[index].total = total.toFixed(2); // เก็บทศนิยม 2 ตำแหน่ง

        setParts(updatedParts);

    };


    useEffect(() => {
        let total = 0;
        let vatAmount = 0;

        parts.forEach((part) => {
            const price = parseFloat(part.price) || 0;
            const qty = parseFloat(part.qty) || 0;
            const vat = parseFloat(part.vat) || 0;

            const subtotal = price * qty;
            const vatVal = subtotal * vat / 100;

            total += subtotal;
            vatAmount += vatVal;
        });

        setSummary({
            total: total.toFixed(2),
            vat: vatAmount.toFixed(2),
            grandTotal: (total + vatAmount).toFixed(2),
        });

    }, [parts]);



    const generateReport = async () => {
        setLoading(true); // เริ่มโหลด
        try {
            const response = await axios.post(
                `http://localhost:3333/api/report-createRepair/${dataRepairID?.request_id}`,
                {},
                { responseType: 'blob' }
            );

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (error) {
            console.error("Error generating report:", error);
        } finally {
            setLoading(false); // โหลดเสร็จ
        }
    };


    const [activeForm, setActiveForm] = useState("RequestForm");

    const [dataLog, setDataLog] = useState([]);
    // Fetch Employees
    const fetchDataLogs = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/reqair_log_show/${dataRepairID?.request_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            // กรณีข้อมูลที่ได้คือ object เดียว
            setDataLog(response.data.data ? [response.data.data] : []);
        } catch (error) {
            console.error("Error fetching DataLogs:", error);
        }
    };


    useEffect(() => {
        fetchDataLogs();
    }, []);

    const [isOpenModolClosing, setOpenModolClosing] = useState(false);
    const [dataOpenModolClosing, setDataOpenModolClosing] = useState(null);
    const handleOpenModolClosing = (data) => {
        setOpenModolClosing(true);
        setDataOpenModolClosing(data);
    };
    const handleCloseModolClosing = () => {
        setOpenModolClosing(false);
        setDataOpenModolClosing(null);
    };

    const [isOpenModalCancelgenaral, setOpenModalCancelgenaral] = useState(false);
    const [dataOpenModalCancelgenaral, setDataOpenModalCancelgenaral] = useState(null);
    const handleOpenModalCancelgenaral = (data) => {
        setOpenModalCancelgenaral(true);
        setDataOpenModalCancelgenaral(data);
    };
    const handleClosModalCancelgenaral = (data) => {
        setOpenModalCancelgenaral(false);
        setDataOpenModalCancelgenaral(null);
    };


    // ข้อมูลการปิดงานแจ้งซ่อม
    const fetchDataClosingJob = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/close_job_show_id/${dataRepairID?.request_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            // กรณีข้อมูลที่ได้คือ object เดียว
            setdataClosingJob(response.data);
        } catch (error) {
            console.error("Error fetching DataLogs:", error);
        }
    };
    useEffect(() => {
        fetchDataClosingJob()
    }, []);

useEffect(() => {
  console.log("dataClosingJob:", dataClosingJob);
}, [dataClosingJob]);


    return (
        <div className="p-1">
            <div className="container">
                <div className="mb-3">
                    <NavMainternanceJob fromPage={fromPage} />
                </div>

                <p className="fw-bolder fs-4 mb-0 d-flex align-items-end gap-2">
                    <i className="bi bi-tools me-2 text-primary"></i>
                    รายละเอียดการซ่อม
                    {dataLog.map((row, index) => (
                        <span
                            className="badge bg-warning"
                            style={{
                                fontSize: "0.7rem",
                                padding: "2px 10px",
                                marginBottom: "6px",
                                alignSelf: "flex-end",
                                color: "#060606"
                            }}
                            key={index}
                        >
                            <small>{row?.status || ''}</small>
                        </span>
                    ))}
                </p>

                <hr className="mb-3" />
                <div className="mb-2">
                    <div className="mb-2">

                        <div className="d-flex justify-content-between align-items-center  flex-wrap gap-2" >

                            {dataClosingJob.length > 0 ? (
                                dataClosingJob.map((data, ndx) => (
                                    <div className="d-flex align-items-center gap-3 mb-2" role="alert" key={ndx}>
                                        <i className="bi bi-check-circle-fill fs-5 text-danger"></i>
                                        <div className="d-flex flex-wrap gap-3">
                                            <span className="fw-semibold text-danger">ปิดงานซ่อมแล้ว</span>
                                            <span>เลขที่: {data.request_no || "N/A"}</span>
                                            <span>วันที่: {formatDate(data.close_date) || "N/A"}</span>
                                            {data.close_file && (
                                                <a
                                                    href={`/uploads/${data.close_file}`}
                                                    className="text-decoration-underline text-primary"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="bi bi-file-pdf-fill me-1"></i>เอกสารปิดงาน
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted fst-italic"></p>
                            )}


                            <div className=" gap-2">

                                {hasPermission("ACCESS_BRANCH_BUTTON") && (
                                    <Button className="btn-primary btn-sm me-1" onClick={() => handleOpenModolClosing(dataRepairID)}>
                                        ปิดงานซ่อม
                                    </Button>
                                )}

                                <Button
                                    className="btn-primary  btn-sm me-1"
                                    onClick={generateReport}
                                    disabled={loading}
                                >

                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            กำลังสร้างรายงาน...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-printer-fill me-1"></i> พิมพ์รายงาน
                                        </>
                                    )}
                                </Button>

                                {dataClosingJob.length <= 0 ? (
                                    <Button
                                        className="btn-danger btn-sm me-1"
                                        onClick={() => handleOpenModalCancelgenaral(dataRepairID)}
                                    >
                                        <i className="bi bi-x-octagon-fill me-1"></i> ยกเลิก
                                    </Button>
                                ) : (
                                    <></>
                                )}

                            </div>

                        </div>

                    </div>
                </div>

                <ul
                    className="nav nav-tabs  rounded shadow-sm"
                    style={{
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        background: "#f8f9fa",
                        border: "1px solid #dee2e6"
                    }}
                >
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link d-flex align-items-center ${activeForm === 'RequestForm' ? 'active text-primary fw-bold' : ''}`}
                            onClick={() => setActiveForm('RequestForm')}
                            style={{ border: "none" }}
                        >
                            <i className="bi bi-file-earmark-text me-2"></i>
                            แจ้งซ่อม
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link d-flex align-items-center ${activeForm === 'PlanningForm' ? 'active text-primary fw-bold' : ''}`}
                            onClick={() => setActiveForm('PlanningForm')}
                            style={{ border: "none" }}
                        >
                            <i className="bi bi-truck me-2"></i>
                            จัดรถ
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link d-flex align-items-center ${activeForm === 'AnanlysisForm' ? 'active text-primary fw-bold' : ''}`}
                            onClick={() => setActiveForm('AnanlysisForm')}
                            style={{ border: "none" }}
                        >
                            <i className="bi bi-clipboard-check me-2"></i>
                            ตรวจเช็ครถ
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link d-flex align-items-center ${activeForm === 'MainternanceAnalysisApprover' ? 'active text-primary fw-bold' : ''}`}
                            onClick={() => setActiveForm('MainternanceAnalysisApprover')}
                            style={{ border: "none" }}
                        >
                            <i className="bi bi-check2-square me-2 "></i>
                            อนุมัติผลตรวจ
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link d-flex align-items-center ${activeForm === 'ApproveMainternanceForm' ? 'active text-primary fw-bold' : ''}`}
                            onClick={() => setActiveForm('ApproveMainternanceForm')}
                            style={{ border: "none" }}
                        >
                            <i className="bi bi-check2-square me-2 "></i>
                            ผู้จัดการอนุมัติ
                        </button>
                    </li>
                </ul>

                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        {activeForm === 'RequestForm' && (
                            <MainternanceRepairRequestDetails
                                summary={summary}
                                parts={parts}
                                handleChange={handleChange}
                                formData={formData}
                                user={user}
                                permissions={permissions}
                            />
                        )}

                        {activeForm === 'PlanningForm' && (
                            <PlanningRepair 
                            maintenanceJob={formData} 
                           
                            />
                        )}

                        {activeForm === 'AnanlysisForm' && (
                            <MainternanceAnanlysis_ShowDetails maintenanceJob={formData} hasPermission={hasPermission} />
                        )}

                        {activeForm === 'MainternanceAnalysisApprover' && (
                            <MainternanceAnalysisApproverMain maintenanceJob={formData} />
                            // <MainternanceAnalysisApprover maintenanceJob={formData} />

                        )}

                        {activeForm === 'ApproveMainternanceForm' && (
                            <MainternanceApprover_mgr_add maintenanceJob={formData} user={user} />
                        )}


                    </div>
                </div>
            </div>
            {/* Modal */}
            {isOpenModolClosing && (
                <Modal_Closing isOpen={isOpenModolClosing} onClose={handleCloseModolClosing} user={user} dataClosing={dataOpenModolClosing} />
            )}

            {isOpenModalCancelgenaral && (
                <Modal_repair_cancel_ganaral isOpen={isOpenModalCancelgenaral} onClose={handleClosModalCancelgenaral} user={user} dataClosing={dataOpenModalCancelgenaral} />
            )}
        </div>


    );
};

export default MaintenanceJob;
