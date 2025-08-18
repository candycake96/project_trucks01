import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";

const Modal_service_type = ({ isOpen, onClose }) => {

    const [isVandorServiceType, setVandorServiceType] = useState([]);
    const [seviceName, setServiceName] = useState('');
    const [message, setMessage] = useState('');
    const [editId, setEditId] = useState(null); // เก็บ id ที่กำลังจะแก้ไข

    const fetchVendorServiceType = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/vendor_service_types_show`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setVandorServiceType(response.data);
        } catch (error) {
            console.error("Error fetching insurance class:", error);

        }
    };

    useEffect(() => {
        fetchVendorServiceType();
    }, []);


    const handleSeviceTypeAdd = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!seviceName.trim()) {
            setMessage("กรุณากรอกชื่อประเภทองค์กร");
            return;
        }

        try {
            let response;
            if (editId) {
                // แก้ไขข้อมูล
                response = await axios.put(
                    `${apiUrl}/api/vendor_service_types_update/${editId}`,
                    { service_name: seviceName },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
            } else {
                // เพิ่มข้อมูลใหม่
                response = await axios.post(
                    `${apiUrl}/api/vendor_service_types_add`,
                    { service_name: seviceName },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
            }
            setMessage(response.data.message || "สำเร็จแล้ว");
            setServiceName("");
            setEditId(null);
            fetchVendorServiceType(); // รีโหลดตาราง
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
            <div className="p-1">
                <div className="fw-bolder text-center">
                    <p className="">
                        ประเภทการบริการ
                    </p>
                </div>
            </div>
            <div className="mb-3">
                <div className="row">
                    <div className="col-lg-7">
                        <table className="table table-bordered table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>ประเภทบริการ</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {isVandorServiceType.map((row, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{row.service_name}</td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-primary rounded-circle me-1"><i class="bi bi-trash-fill"></i></button>
                                            <button
                                                className="btn btn-sm btn-outline-primary rounded-circle me-1"
                                                onClick={() => {
                                                    setServiceName(row.service_name); // โหลดข้อมูลเดิม
                                                    setEditId(row.service_id); // เซ็ตโหมดแก้ไข
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
                        <form action="" onClick={handleSeviceTypeAdd} >
                            <div className="">
                                <p className="fw-bolder">เพิ่มข้อมูล</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">ประเภทการบริการ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={seviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    placeholder=""
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
                                                setServiceName("");
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
        </ReactModal>
    )
}


export default Modal_service_type;