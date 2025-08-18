import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";

const Modal_vandor_type = ({ isOpen, onClose }) => {

    const [isVendorType, setVendorType] = useState([]);
    const [vendorTypeName, setVendorTypeName] = useState('');
        const [message, setMessage] = useState('');
    
        const [editId, setEditId] = useState(null); // เก็บ id ที่กำลังจะแก้ไข

    const fetchVendorType = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/vendor_type_show`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setVendorType(response.data);
        } catch (error) {
            console.error("Error fetching insurance class:", error);

        }
    };

    useEffect(()=>{
        fetchVendorType();
    }, []);




    const handleVendorTypeAdd = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!vendorTypeName.trim()) {
            setMessage("กรุณากรอกชื่อประเภทองค์กร");
            return;
        }

        try {
            let response;
            if (editId) {
                // แก้ไขข้อมูล
                response = await axios.put(
                    `${apiUrl}/api/vendor_type_update/${editId}`,
                    { vendor_type_name: vendorTypeName },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
            } else {
                // เพิ่มข้อมูลใหม่
                response = await axios.post(
                    `${apiUrl}/api/vendor_type_add`,
                    { vendor_type_name: vendorTypeName },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
            }

            setMessage(response.data.message || "สำเร็จแล้ว");
            setVendorTypeName("");
            setEditId(null);
            fetchVendorType(); // รีโหลดตาราง
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
                        หมวดหมู่
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
                                        <th>หมวดหมู่</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isVendorType.map((row, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{row.vendor_type_name}</td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-outline-primary rounded-circle me-1"><i class="bi bi-trash-fill"></i></button>
                                                <button
                                                    className="btn btn-sm btn-outline-primary rounded-circle me-1"
                                                    onClick={() => {
                                                        setVendorTypeName(row.vendor_type_name); // โหลดข้อมูลเดิม
                                                        setEditId(row.vendor_type_id); // เซ็ตโหมดแก้ไข
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
                            <form action="" onSubmit={handleVendorTypeAdd} >
                                <div className="">
                                    <p className="fw-bolder">เพิ่มข้อมูล</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">ชื่อหมวดหมู่</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={vendorTypeName}
                                        onChange={(e) => setVendorTypeName(e.target.value)}
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
                                                    setVendorTypeName("");
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


export default Modal_vandor_type;