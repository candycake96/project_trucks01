import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_vehicle_parts_add = ({ isOpen, onClose, onSuccess }) => {

    const [message, setMessage] = useState('');
    const [partsData, setPartsData] = useState({
                system_id: "",
                part_name: "",
                part_code: "",
                unit: "",
                brand: "",
                model: "",
                price: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setPartsData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    

    const [isSystemsShow, setSystemsShow] = useState([]);

    const fetchSystemsShows = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/systems_show_all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setSystemsShow(response.data);
        } catch (error) {
            console.error("Error fetching coverage type:", error);
        }
    };

    useEffect(() => {
        fetchSystemsShows();
    }, []);


    const handleSubmitParts = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(
                `${apiUrl}/api/parts_add`,
                partsData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            onSuccess();
            alert(response.data.message);
            setMessage(response.data.message || "สำเร็จแล้ว");
            setPartsData({
                system_id: "",
                part_name: "",
                part_code: "",
                unit: "",
                brand: "",
                model: "",
                price: ""
            })
            onClose();
        } catch (error) {
            console.error('Error submitting form', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
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
            <div
                className="modal-header"
                style={{
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        cursor: "pointer",
                    }}
                >
                    ×
                </button>
                <h5 className="modal-title text-center fw-bolder">
                    เพิ่มข้อมูลอะไหล่ 
                </h5>
            </div>
            {message && <div className="mt-3 alert alert-info">{message}</div>}
            <form action="" onSubmit={handleSubmitParts}>
                <div className="p-3">
                    <div className="row ">
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="system" className="form-label">หมวดระบบอะไหล่ </label>
                            <select
                                className="form-select "
                                name="system_id"
                                onChange={handleChange}
                            >
                                <option value="">เลือกหมวดหมู่ระบบอะไหล่</option>
                                {isSystemsShow.map((row, index) => (

                                    <option key={index} value={row.system_id}>{row.system_name}</option>

                                ))}
                            </select>
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="system" className="form-label">รหัสสินค้า (Code) </label>
                            <input type="text" name="part_code" id="system" className="form-control" onChange={handleChange} />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="system" className="form-label">ชื่ออะไหล่</label>
                            <input type="text" name="part_name" id="system" className="form-control" onChange={handleChange} />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="brand" className="form-label">ยี่ห้อ</label>
                            <input type="text" name="brand" id="brand" className="form-control" onChange={handleChange} />
                        </div>

                        <div className="col-lg-4 mb-3">
                            <label htmlFor="model" className="form-label">รุ่น</label>
                            <input type="text" name="model" id="model" className="form-control" onChange={handleChange} />
                        </div>

                        <div className="col-lg-4 mb-3">
                            <label htmlFor="price" className="form-label">ราคา</label>
                            <input type="number" name="price" id="price" className="form-control" onChange={handleChange} step="0.01" />
                        </div>

                        <div className="col-lg-4 mb-3">
                            <label htmlFor="unit" className="form-label">หน่วย</label>
                            <input type="text" name="unit" id="unit" className="form-control" onChange={handleChange}  />
                        </div>

                    </div>
                    <div className="text-center border-top pt-3 px-3">
                        <button className="btn btn-secondary me-2" onClick={onClose}>ยกเลิก</button>
                        <button className="btn btn-primary" type="submit" >บันทึก</button>
                    </div>

                </div>
            </form>
        </ReactModal>
    )
}

export default Modal_vehicle_parts_add;