import React from "react";
import { Link } from "react-router-dom";

// ✅ ฟังก์ชันแปลงวันที่ให้อ่านง่าย
const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const MainternancePlanning_table = ({ PlanningData = [], loading = false }) => {
    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>เลขเอกสาร</th>
                        <th>วันที่แจ้ง</th>
                        <th>ประเภทงาน</th>
                        <th>สถานะ</th>
                        <th>ทะเบียนรถ</th>
                        <th className="text-center">การดำเนินการ</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                                กำลังโหลดข้อมูล...
                            </td>
                        </tr>
                    ) : PlanningData.length > 0 ? (
                        PlanningData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.request_no || "-"}</td>
                                <td>{formatDate(data.request_date)}</td>
                                <td>{data.job_type || "-"}</td>
                                <td>
                                    <span className="badge bg-warning text-dark">
                                        {data.status || "-"}
                                    </span>
                                </td>
                                <td>{data.reg_number || "-"}</td>
                                <td className="text-center">
                                    <Link
                                        to="/truck/MaintenanceJob"
                                        state={{ ...data, fromPage: "SupervisorApprove" }}
                                        className="btn btn-sm btn-primary"
                                    >
                                        <i className="bi bi-eye me-1"></i> ตรวจสอบ
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                                ไม่มีข้อมูลในประเภทนี้
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MainternancePlanning_table;
