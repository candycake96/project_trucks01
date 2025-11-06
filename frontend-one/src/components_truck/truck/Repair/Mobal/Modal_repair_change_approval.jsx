import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../../config/apiConfig";
import Modal_repair_change_approval_active from "./Modal_repair_change_approval_active";

const Modal_repair_change_approval = ({ isOpen, onClose, repairId }) => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        requester_name: "",
        requester_date: "",
        requester_remark: "",
    });
    const [isDataRequester, setRequester] = useState([]);

    // ✅ โหลดข้อมูลผู้ใช้จาก localStorage
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // ✅ ตั้งชื่อและวันที่อัตโนมัติเมื่อมี user
    useEffect(() => {
        if (user && !formData.requester_name) {
            setFormData((prev) => ({
                ...prev,
                requester_name: `${user.fname} ${user.lname}`,
                requester_date: new Date().toISOString().split("T")[0],
            }));
        }
    }, [user]);

    // ✅ โหลดข้อมูลเมื่อเปิด Modal
    useEffect(() => {
        if (isOpen && repairId) {
            fetchChangeRequest();
        }
    }, [isOpen, repairId]);

    // ✅ ฟังก์ชันโหลดข้อมูลจาก backend
    const fetchChangeRequest = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`${apiUrl}/api/change_show/${repairId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.data && Array.isArray(res.data.data)) {
                setRequester(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching change request:", err);
        }
    };

    // ✅ handle change
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // ✅ handle submit
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!formData.requester_remark) {
                alert("กรุณากรอกข้อมูลให้ครบ");
            }
            const payload = {
                requester_name: formData.requester_name,
                requester_date: new Date().toISOString().split("T")[0],
                requester_remark: formData.requester_remark.trim(),
            };

            await axios.post(`${apiUrl}/api/change_add/${repairId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("ส่งคำขอสำเร็จ");
            onClose();
        } catch (error) {
            console.error("Error updating approval:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    const [isOpenModalChangeApprovalActive, setOpenModalChangeApprovalActive] = useState(false);
    const [dataOpenModalChangeApprovalActive, setDataOpenModalChangeApprovalActive] = useState(null);
    const handleOpenModalChangeApprovalActive = (data) => {
        setOpenModalChangeApprovalActive(true);
        setDataOpenModalChangeApprovalActive(data);
    };
    const handleClosModalChangeApprovalActive = (data) => {
        setOpenModalChangeApprovalActive(false);
        setDataOpenModalChangeApprovalActive(null);
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="คำขอแก้ไขใบแจ้งซ่อม"
            style={{
                content: {
                    width: "90%",
                    maxWidth: "700px",
                    margin: "auto",
                    padding: "24px",
                    borderRadius: "12px",
                },
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 9999,
                },
            }}
        >
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <h2 className="h5 fw-bold">คำขอแก้ไขรายการแจ้งซ่อม (หลังอนุมัติ)</h2>
                <button onClick={onClose} className="btn-close"></button>
            </div>

            {/* ข้อมูลผู้ขอ */}
            <div className="row">
                <div className="col-lg-8 mb-3">
                    <label className="form-label">ผู้ส่งคำขอ <span className="text-danger">*</span></label>
                    <input
                        name="requester_name"
                        className="form-control"
                        value={formData.requester_name || ""}
                        disabled
                    />
                </div>
                <div className="col-lg-4 mb-3">
                    <label className="form-label">วันที่ <span className="text-danger">*</span></label>
                    <input
                        className="form-control"
                        type="date"
                        value={formData.requester_date || ""}
                        disabled
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">หมายเหตุ <span className="text-danger">*</span></label>
                <textarea
                    className="form-control"
                    value={formData.requester_remark || ""}
                    onChange={(e) => handleChange("requester_remark", e.target.value)}
                    readOnly={!formData.requester_name}
                />
            </div>

            <div className="text-end mb-3">
                <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
                    ส่งข้อมูล
                </button>
            </div>


            <hr className="
sm-3" />
            {/* ✅ ตารางประวัติคำขอเก่า */}
            {Array.isArray(isDataRequester) && isDataRequester.length > 0 && (
                <div className="mt-4">
                    <h6 className="mb-3">ประวัติคำขอแก้ไขก่อนหน้า</h6>
                    <table className="table table-sm">
                        <thead className="table-light">
                            <tr>
                                <th>ชื่อผู้ขอ</th>
                                <th>วันที่</th>
                                <th>หมายเหตุ</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isDataRequester.map((row, ndx) => (
                                <tr key={ndx}>
                                    <td>{row.requester_name || "-"}</td>
                                    <td>{row.requester_date?.split("T")[0]}</td>
                                    <td>{row.requester_remark || "-"}</td>
                                    <td>
                                        {row.approver_status === "approved" ? (
                                            <button
                                                className="btn w-100 btn-status btn-success btn-sm text-white d-flex align-items-center justify-content-center gap-2"
                                                onClick={() => handleOpenModalChangeApprovalActive(row.id)}
                                            >
                                                <i className="bi bi-check-circle-fill"></i>
                                                <span>อนุมัติ</span>
                                            </button>
                                        ) : row.approver_status === "rejected" ? (
                                            <button
                                                className="btn w-100 btn-status btn-danger btn-sm text-white d-flex align-items-center justify-content-center gap-2"
                                                onClick={() => handleOpenModalChangeApprovalActive(row.id)}
                                            >
                                                <i className="bi bi-x-circle-fill"></i>
                                                <span>ไม่อนุมัติ</span>
                                            </button>
                                        ) : (
                                            <button
                                                className="btn w-100 btn-status btn-warning btn-sm text-dark d-flex align-items-center justify-content-center gap-2"
                                                onClick={() => handleOpenModalChangeApprovalActive(row.id)}
                                            >
                                                <i className="bi bi-hourglass-split"></i>
                                                <span>รอการอนุมัติ</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            )}



            {isOpenModalChangeApprovalActive && (
                <Modal_repair_change_approval_active isOpen={isOpenModalChangeApprovalActive} onClose={handleClosModalChangeApprovalActive} changID={dataOpenModalChangeApprovalActive} />
            )}

        </ReactModal>
    );
};

export default Modal_repair_change_approval;
