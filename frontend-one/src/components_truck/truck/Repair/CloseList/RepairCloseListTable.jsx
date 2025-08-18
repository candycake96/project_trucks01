import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Spinner } from "react-bootstrap";
import Modal_Closing from "./modal/Modal_Closing";

const RepairCloseListTable = ({ dataCloseList = [], loading = false }) => {
     const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('th-TH', options);
    };
 
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
                          ) : dataCloseList.length > 0 ? (
                              dataCloseList.map((data, index) => (
                                  <tr key={index}>
                                      <td>{data.request_no}</td>
                                      <td>{formatDate(data.request_date)}</td>
                                      <td>{data.job_type || '-'}</td>
                                      <td>
                                          <span className={`badge ${
                                                  data.status === "ปิดงานซ่อม"
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
                                      <td>{data.reg_number}</td>
                                      <td className="text-center">
                                        <Button className="btn-sm me-1" onClick={()=>handleOpenModolClosing(data)}>ปิดงานซ่อม</Button>
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
                  {isOpenModolClosing && (
                    <Modal_Closing isOpen={isOpenModolClosing} onClose={handleCloseModolClosing} dataClosing={dataOpenModolClosing} />
                  )}
              </div>
    );
};

export default RepairCloseListTable;
