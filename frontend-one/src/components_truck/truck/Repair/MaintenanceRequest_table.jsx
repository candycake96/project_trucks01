import React from "react";
import { Link } from "react-router-dom";

const MainternanceRequest_table = ({ analysisData = [], loading = false }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('th-TH', options);
    };
    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>เลขเอกสาร</th>
                        <th>ทะเบียนรถ</th>
                        <th>วันที่แจ้งซ่อม</th>
                        <th>ผู้แจ้ง</th>
                        <th>สถานะ</th>

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
                    ) : analysisData.length > 0 ? (
                        analysisData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.request_no}</td>
                                <td>{data.reg_number}</td>
                                <td>{formatDate(data.request_date)}</td>
                                <td> {`${data.fname} ${data.lname}`}</td>
                                <td>
                                    <span className={`badge ${data.status === "ปิดงานซ่อม"
                                            ? "bg-danger"
                                            : data.status === "แจ้งซ่อม"
                                                ? "bg-primary"
                                                : data.status === "แผนกจัดรถตรวจสอบ"
                                                ? "bg-warning"
                                                : data.status === "วิเคราะห์แผนกซ่อมบำรุง"
                                                ? "bg-info"
                                                : data.status === "ผ่านอนุมัตผลตรวจหัวหน้าแผนกช่าง"
                                                ? "bg-secondary"
                                                : data.status === "ผู้จัดการฝ่ายขนส่งและคลังสินค้า"
                                                ? "bg-success"
                                                : data.status === "ยกเลิกงานซ่อม"
                                                ? "bg-danger"
                                                : "bg-success"
                                        }`}>
                                        {data.status}
                                    </span>
                                </td>

                                <td className="text-center">
                                    <Link
                                        to="/truck/MaintenanceJob"
                                        state={{ ...data, fromPage: 'SupervisorApprove' }}
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
    )
}

export default MainternanceRequest_table;