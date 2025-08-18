import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_orginization_type_details = ({ isOpen, onClose }) => {
    const [isOrganization, setOrganization] = useState([]);
    const [organizationTypeName, setOrganizationTypeName] = useState('');
    const [message, setMessage] = useState('');

    const [editId, setEditId] = useState(null); // เก็บ id ที่กำลังจะแก้ไข


    const fetchOrganizationType = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/vendor_organization_type_show`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setOrganization(response.data);
        } catch (error) {
            console.error("Error fetching insurance class:", error);

        }
    };

    useEffect(() => {
        fetchOrganizationType();
    }, []);

    const handleOrganizationTypeAdd = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!organizationTypeName.trim()) {
            setMessage("กรุณากรอกชื่อประเภทองค์กร");
            return;
        }

        try {
            let response;
            if (editId) {
                // แก้ไขข้อมูล
                response = await axios.put(
                    `${apiUrl}/api/vendor_organization_type_update/${editId}`,
                    { organization_type_name: organizationTypeName },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
            } else {
                // เพิ่มข้อมูลใหม่
                response = await axios.post(
                    `${apiUrl}/api/vendor_organization_type_add`,
                    { organization_type_name: organizationTypeName },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
            }

            setMessage(response.data.message || "สำเร็จแล้ว");
            setOrganizationTypeName("");
            setEditId(null);
            fetchOrganizationType(); // รีโหลดตาราง
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "เกิดข้อผิดพลาด");
        }
    };


    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose} // ป้องกันปิด Modal ขณะกำลังบันทึก
            ariaHideApp={false}
            contentLabel="Manage Vehicle Status"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "950px",
                    maxHeight: "60vh",
                    height: "auto",
                    margin: "auto",
                    padding: "0",
                    border: "none",
                    borderRadius: "0.5rem",
                    overflowY: "auto",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            }}
        >

            <div className="p-3">
                <div className="text-center mb-3">
                    <div className="fw-bolder">
                        <p>ประเภทองค์กร</p>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="row">
                        <div className="col-lg-7">
                            <table className="table table-bordered table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ลำดับ</th>
                                        <th>ประเภทองค์กร</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isOrganization.map((row, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{row.organization_type_name}</td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-outline-primary rounded-circle me-1"><i class="bi bi-trash-fill"></i></button>
                                                <button
                                                    className="btn btn-sm btn-outline-primary rounded-circle me-1"
                                                    onClick={() => {
                                                        setOrganizationTypeName(row.organization_type_name); // โหลดข้อมูลเดิม
                                                        setEditId(row.organization_type_id); // เซ็ตโหมดแก้ไข
                                                    }}
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>

                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-lg-5">
                            <form action="" onSubmit={handleOrganizationTypeAdd}>
                                <div className="">
                                    <p className="fw-bolder">เพิ่มข้อมูล</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">ชื่อประเภทองค์กร</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={organizationTypeName}
                                        onChange={(e) => setOrganizationTypeName(e.target.value)}
                                        placeholder="เช่น บริษัทจำกัด, หจก."
                                    />
                                </div>
                                <div className="text-center">
                                    <div className="text-center">
                                        <button className="btn btn-primary me-2">
                                            {editId ? "บันทึกการแก้ไข" : "บันทึก"}
                                        </button>

                                        {editId && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setEditId(null);
                                                    setOrganizationTypeName("");
                                                    setMessage("");
                                                }}
                                            >
                                                ยกเลิก
                                            </button>
                                        )}
                                    </div>

                                    {message && <div className="mt-3 alert alert-info">{message}</div>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    )
}


export default Modal_orginization_type_details;