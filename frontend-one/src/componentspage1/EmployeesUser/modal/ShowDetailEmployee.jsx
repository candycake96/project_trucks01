import axios from "axios";
import React, { useState, useEffect } from "react";
import EditImageEmployees from "./EditImageEmployees";
import { apiUrl } from "../../../config/apiConfig";

const ShowDetailEmployee = ({ emp, onEdit }) => {
    if (!emp) return null;

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editImageEmp, setEditImageEmp] = useState(null);
    const [empDetailsID, setEmpDetailsID] = useState([]);

    const id = emp.id_emp;

    useEffect(() => {
        const fetchEmpDetailsID = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/getemployeesshowid/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                setEmpDetailsID(response.data);
            } catch (error) {
                console.error("Error fetching employee details:", error);
            }
        };

        fetchEmpDetailsID();
    }, [id]);

    // เปิด Modal พร้อมส่งข้อมูลพนักงานไปแก้ไข
    const handleOpenEditModal = (row) => {
        setEditImageEmp(row);
        setEditModalOpen(true);
    };

    // ปิด Modal
    const handleCloseAllModals = () => {
        setEditModalOpen(false);
    };

    return (
        <>
            {empDetailsID.map((row, index) => (
                <div className="" key={index}>
                    <div className="row mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="col-4 fw-bold" style={{ color: "#008000" }}>
                                <i className="bi bi-person-fill"></i>
                            </div>
                            <button
                                style={{ color: '#008000', border: 'none', background: 'transparent' }}
                                onClick={() => onEdit(row)}
                            >
                                <i className="bi bi-pencil-square"></i> แก้ไข
                            </button>
                        </div>
                    </div>

                    {/* แสดงรูปโปรไฟล์ */}
                    <div className="mb-3 text-center" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ position: "relative" }}>
                            <img
                                src={row.image || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                                alt="Profile"
                                className="profile-image"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "2px solid #007bff"
                                }}
                            />
                            
                            {/* ปุ่มแก้ไขรูปภาพ */}
                            <button
                                onClick={() => handleOpenEditModal(row)}
                                style={{
                                    position: 'absolute',
                                    bottom: '-5px',
                                    right: '-5px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                                    fontSize: "18px",
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* ข้อมูลพนักงาน */}
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">รหัสพนักงาน:</div>
                        <div className="col-8">{row.code}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">ชื่อ:</div>
                        <div className="col-8">{row.fname} {row.lname}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">ชื่อเล่น:</div>
                        <div className="col-8">{row.nickname}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">เพศ:</div>
                        <div className="col-8">{row.gender}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">เลขประจำตัวประชาชน:</div>
                        <div className="col-8">{row.identification_number}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">เบอร์โทรติดต่อ:</div>
                        <div className="col-8">{row.phone}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">อีเมล์:</div>
                        <div className="col-8">{row.email}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">วันที่เริ่มงาน:</div>
                        <div className="col-8">{row.date_job}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">ตำแหน่ง:</div>
                        <div className="col-8">{row.name_position}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">แผนก:</div>
                        <div className="col-8">{row.name_department}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4 fw-bold">สาขา:</div>
                        <div className="col-8">{row.branch_name}</div>
                    </div>
                </div>
            ))}

            {/* Modal แก้ไขรูปภาพ */}
            {isEditModalOpen && (
                <EditImageEmployees isOpen={isEditModalOpen} onClose={handleCloseAllModals} emp={editImageEmp} />
            )}
        </>
    );
}

export default ShowDetailEmployee;
