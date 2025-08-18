import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import { Link } from "react-router-dom";

const MainternanceAnalysisTableMain = () => {
    const [showPendingTable, setShowPendingTable] = useState(false);

    const [analysisData, setAnalysisData] = useState([]);
    const fetchAnalysisTable = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/analysis_details`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setAnalysisData(response.data);
        } catch (error) {
            console.error("Error fetching analysis data:", error);
        }
    };

    useEffect(() => {
        fetchAnalysisTable();
    }, []);


    return (
        
        <div className="container py-4" style={{ maxWidth: 1200 }}>
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                        <h2 className="fw-bold fs-5 mb-2">
                            วิเคราะห์แผนกซ่อมบำรุง
                        </h2>
                        <p className="text-muted mb-0">
                            รายงานและวิเคราะห์งานซ่อมบำรุงที่ร้องขอในระบบ
                        </p>
                    </div>
                    <div className="mt-2 mt-md-0">
                        <div className="position-relative d-inline-block">
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowPendingTable((prev) => !prev)}
                            >
                                ข้อมูลแจ้งซ่อมที่ต้องตรวจสอบ
                            </button>
                            {analysisData.length > 0 && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style={{ fontSize: "0.8em" }}
                                >
                                    {analysisData.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* ข้อมูลแจ้งซ่อมที่ต้องตรวจสอบ */}
            {showPendingTable && (
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header  fw-bold d-flex justify-content-between align-items-center">
                        <span>ข้อมูลแจ้งซ่อมที่ต้องตรวจสอบ</span>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setShowPendingTable((prev) => !prev)}
                        >
                            {showPendingTable ? "ซ่อน" : "แสดง"}
                        </button>
                    </div>

                    <div className="card-body p-0">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>เลขที่เอกสาร</th>
                                    <th>วันที่แจ้ง</th>
                                    <th>ทะเบียนรถ</th>
                                    <th>สถานะ</th>
                                    <th>ดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*  */}
                                {analysisData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.request_no}</td>
                                        <td>{item.request_date}</td>
                                        <td>{item.reg_number}</td>
                                        <td> <span className='badge bg-warning text-dark'> รอตรวจสอบ </span>
                                        </td>
                                        <td>
                                            <Link to="/truck/MaintenanceJob" state={{ ...item, fromPage: "Analysis" }} className="btn btn-sm btn-outline-primary">
                                                ตรวจสอบ
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ตารางวิเคราะห์งานซ่อมบำรุง */}
            <div className="card shadow border-0">
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>วันที่</th>
                                <th>ประเภทงาน</th>
                                <th>สถานะ</th>
                                <th>รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2023-10-01</td>
                                <td>ซ่อมด่วน</td>
                                <td>เสร็จสิ้น</td>
                                <td>เปลี่ยนยางรถยนต์</td>
                            </tr>
                            <tr>
                                <td>2023-10-02</td>
                                <td>ซ่อมตามแผน</td>
                                <td>กำลังดำเนินการ</td>
                                <td>ตรวจเช็คเครื่องยนต์</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default MainternanceAnalysisTableMain;