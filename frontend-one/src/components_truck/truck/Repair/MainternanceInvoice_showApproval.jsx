import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { apiUrl } from "../../../config/apiConfig";

const MainternanceInvoice_showApproval = ({ requestId, invoiceID }) => {

    const [isEditing, setIsEditing] = useState(true);
    const [isApproval, setApproval] = useState({
        invoice_approver_emp_id: "",
        invoice_approver_date: "",
        invoice_approver_status: "",
        invoice_approver_note: ""
    });

    const [user, setUser] = useState(null); // token

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        if (user) {
            setApproval((prev) => ({
                ...prev,
                invoice_approver_emp_id: user.id_emp || ""
            }));
        }
    }, [user]);


    // ✅ เมื่อมีการเปลี่ยนค่า input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setApproval((prev) => ({ ...prev, [name]: value }));
    };


    // -------
    const [hasApproval, setHasApproval] = useState(false);
    const [loading, setLoading] = useState(true);

            const fetchApproval = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/invoice_checkApproval/${invoiceID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );

                const data = response.data;

                if (data.hasApproval) {
                    setHasApproval(true);
                    setApproval({
                        invoice_approver_emp_id: data.approvalData.invoice_approved_emp_id,
                        invoice_approver_date: data.approvalData.created_at.split('T')[0],
                        invoice_approver_status: data.approvalData.approval_checked ? "approved" : "rejected",
                        invoice_approver_note: data.approvalData.approval_note || "",
                        fname: data.approvalData.fname,
                        lname: data.approvalData.lname
                    });
                    setIsEditing(false);
                } else {
                    setHasApproval(false);
                    setApproval(prev => ({
                        ...prev,
                        fname: user?.fname || '',
                        lname: user?.lname || ''
                    }));
                }

            } catch (err) {
                console.error("Error checking approval:", err);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchApproval();
    }, [invoiceID]);

    if (loading) return <p>กำลังโหลดข้อมูล...</p>;


    // ✅ เมื่อกดบันทึก
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("ข้อมูลที่บันทึก:", isApproval);

        const token = localStorage.getItem("accessToken");
        if (!token) return console.error("No access token found");

        try {
            const response = await axios.post(
                `${apiUrl}/api/invoice_maintenance_approval/${invoiceID}`,
                isApproval,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json", // ✅ ใช้ JSON
                    },
                }
            );

            console.log("Response:", response.data);
            alert("บันทึกข้อมูลการอนุมัติเรียบร้อยแล้ว!");
            setIsEditing(false);
            fetchApproval();
        } catch (error) {
            console.error("Error submitting form:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status);
                console.error("Response Data:", error.response.data);
            }
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองอีกครั้ง");
        }
    };


    return (
        <div className="container mt-4">
            <Card
                className="shadow-sm border-0"
                style={{ backgroundColor: "#f8f9fa", borderRadius: "0.5rem" }}
            >
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                        <p className="fw-bold text-primary mb-0">
                            ข้อมูลอนุมัติจัดทำใบแจ้งหนี้
                        </p>
                        {hasApproval ? (
                            !isEditing ? (
                                <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>แก้ไข</button>
                            ) : (
                                <button className="btn btn-danger btn-sm" onClick={() => setIsEditing(false)}>ยกเลิก</button>
                            )
                        ) : (<> </>)}


                    </div>

                    <form
                        className="p-3"
                        style={{ backgroundColor: "#ffffff", borderRadius: "0.5rem" }}
                        onSubmit={handleSubmit}
                    >
                        {/* ข้อมูลผู้อนุมัติ */}
                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">ผู้อนุมัติ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ชื่อผู้อนุมัติ"
                                    value={
                                        hasApproval
                                            ? `${isApproval.fname || ''} ${isApproval.lname || ''}` // จาก API approvalData
                                            : user
                                                ? `${user.fname} ${user.lname}` // กรณียังไม่มี approval ใช้ user ปัจจุบัน
                                                : ''
                                    }
                                    readOnly
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">วันที่อนุมัติ</label>
                                <input
                                    type="date"
                                    name="invoice_approver_date"
                                    className="form-control"
                                    value={isApproval.invoice_approver_date}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* การเลือกสถานะอนุมัติ */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold d-block mb-2">
                                สถานะการอนุมัติ <span className="text-danger">*</span>
                            </label>
                            <div className="d-flex gap-4">
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        id="approve"
                                        name="invoice_approver_status"
                                        value="approved"
                                        checked={isApproval.invoice_approver_status === "approved"}
                                        onChange={handleChange}
                                        className="form-check-input"
                                        disabled={!isEditing}
                                    />
                                    <label htmlFor="approve" className="form-check-label">
                                        อนุมัติ
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        id="reject"
                                        name="invoice_approver_status"
                                        value="rejected"
                                        checked={isApproval.invoice_approver_status === "rejected"}
                                        onChange={handleChange}
                                        className="form-check-input"
                                        disabled={!isEditing}
                                    />
                                    <label htmlFor="reject" className="form-check-label">
                                        ไม่อนุมัติ
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* หมายเหตุ */}
                        <div className="mb-4">
                            <label htmlFor="remark" className="form-label fw-semibold">
                                หมายเหตุเพิ่มเติม <span className="text-danger">*</span>
                            </label>
                            <textarea
                                id="remark"
                                name="invoice_approver_note"
                                rows="3"
                                className="form-control"
                                placeholder="ระบุเหตุผลหรือความคิดเห็น (ถ้ามี)"
                                value={isApproval.invoice_approver_note}
                                onChange={handleChange}
                                disabled={!isEditing}
                            ></textarea>
                        </div>

                        {/* ปุ่มบันทึก */}
                        {/* <div className="text-center">
                            <button type="submit" className="btn btn-success px-4">
                                <i className="bi bi-check-circle me-2"></i> บันทึกการอนุมัติ
                            </button>
                        </div> */}

                        <div className="text-center mt-3">
                            {!hasApproval ? (
                                <button className="btn btn-success">
                                    บันทึกการอนุมัติ
                                </button>
                            ) : (

                                isEditing && (
                                    <button className="btn btn-success">
                                        บันทึกการอนุมัติ
                                    </button>
                                )
                            )}
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default MainternanceInvoice_showApproval;
