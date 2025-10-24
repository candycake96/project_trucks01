import React from "react";
import { Link } from "react-router-dom";

const MainternanceInvoice_table = ({ analysisData = [], loading = false }) => {
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
                        <th>เลขเอกสารใบแจ้งหนี้</th>
                        <th>เลขเอกสารแจ้งซ่อม</th>
                        <th>วันที่แจ้ง</th>
                        {/* <th>ประเภทงาน</th> */}
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
                    ) : analysisData.length > 0 ? (
                        analysisData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.invoice_no}</td>
                                <td>{data.request_no}</td>
                                <td>{formatDate(data.request_date)}</td>
                                {/* <td>{data.job_type || '-'}</td> */}
                                <td>
                                    <span className="badge bg-warning text-dark">
                                        {data.status}
                                    </span>
                                </td>
                                <td>{data.reg_number}</td>
                                <td className="text-center">
                                    <Link
                                        to={`/truck/MainternanceInvoice_showDetails`}
                                        state={{ requestId: data.request_id , invoiceID: data.invoice_id }}
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

export default MainternanceInvoice_table;
