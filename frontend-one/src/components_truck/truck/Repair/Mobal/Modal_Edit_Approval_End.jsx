import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../../config/apiConfig";



const Modal_Edit_Approval_End = ({ isOpen, onClose, user, initialData }) => {
    const [dataApproval, setDataApproval] = useState({
        request_id: "",
        approver_emp_id: "",
        approver_name: "",
        approval_status: "",
        approval_date: "",
        remark: ""
    });

    useEffect(() => {
        if (user && isOpen) {
            setDataApproval({
                request_id: initialData?.request_id || "",
                approver_emp_id: user?.id_emp || "",
                approver_name: `${user?.fname || ""} ${user?.lname || ""}`,
                approval_status: initialData?.approval_status_end || "",
                approval_date: new Date().toISOString().slice(0, 10),
                remark: ""
            });
        }
    }, [isOpen, user, initialData]);

    const handleChange = (field, value) => {
        setDataApproval(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            console.log('ข้อมูล : ', dataApproval);
            const response = await axios.put(
                `${apiUrl}/api/approval_update/${initialData?.approval_id}`, // สมมติคุณส่ง ID มาด้วย
                dataApproval,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (response.status === 200) {
                alert("✅ แก้ไขข้อมูลอนุมัติสำเร็จ");
                onClose();
            } else {
                alert("❌ ไม่สามารถแก้ไขได้");
            }
        } catch (error) {
            console.error("❌ ERROR", error);
            alert("เกิดข้อผิดพลาดในการบันทึก");
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="แก้ไขการอนุมัติ"
            style={{
                content: {
                    width: "100%",
                    height: "400px",
                    maxWidth: "600px",
                    margin: "auto",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                },
            }}
        >
            <h5 className="fw-bold mb-3">✏️ แก้ไขข้อมูลการอนุมัติขั้นสุดท้าย {user?.id_emp}</h5>

            <div className="mb-3">
                <label className="form-label">สถานะการอนุมัติ</label>
                <select
                    className="form-select"
                    value={dataApproval.approval_status}
                    onChange={(e) => handleChange("approval_status", e.target.value)}
                >
                    <option value="">-- เลือกสถานะ --</option>
                    <option value="อนุมัติ">อนุมัติ</option>
                    <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">หมายเหตุ</label>
                <textarea
                    className="form-control"
                    rows={3}
                    value={dataApproval.remark}
                    onChange={(e) => handleChange("remark", e.target.value)}
                />
            </div>

            <div className="text-end">
                <button className="btn btn-secondary me-2" onClick={onClose}>
                    ❌ ยกเลิก
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                    💾 บันทึก
                </button>
            </div>
        </ReactModal>
    );
};

export default Modal_Edit_Approval_End;
