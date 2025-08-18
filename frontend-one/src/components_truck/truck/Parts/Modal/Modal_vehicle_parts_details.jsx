import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import Modal_vehicle_parts_add from "./Modal_vehicle_parts_add";
import axios from "axios";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_vehicle_parts_details = ({ isOpen, onClose, onSubmit }) => {

    const [reload, setReload] = useState(false);
    const [formData, setFormData] = useState({
        system_id: '',
        part_name: '',
        part_code: ''
    });

    const [results, setResults] = useState([]);

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
    }, [reload]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const [isOpenModalVehiclePartsAdd, setOpenModalVehiclePartsAdd] = useState(false);
    const handleOpenModalVehiclePartsAdd = () => {
        setOpenModalVehiclePartsAdd(true);
    };
    const handleClossModalVehiclePartsAdd = () => {
        setOpenModalVehiclePartsAdd(false);
    }

    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("Access token is missing. Please log in again."); // Or handle via state
                return;
            }
            console.log("Searching with:", formData);

            const response = await axios.post(
                `${apiUrl}/api/parts_search`,
                {
                    system_id: formData.system_id,
                    part_name: formData.part_name,
                    part_code: formData.part_code,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },


                }
            );
            setResults(response.data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    const handleSelectItem = (item) => {
        onSubmit(item);
        onClose(); // ปิด Modal
    }
    
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose} // ป้องกันปิด Modal ขณะกำลังบันทึก
            ariaHideApp={false}
            contentLabel="Manage Vehicle Status"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "1100px",
                    maxHeight: "100%",
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
            {/* Header: ค้างด้านบน */}
  <div
    className="modal-header"
    style={{
      padding: "1rem",
      backgroundColor: "#f8f9fa",
      borderTopLeftRadius: "0.5rem",
      borderTopRightRadius: "0.5rem",
      position: "sticky",
      top: 0,
      zIndex: 2,
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
                    ค้นหาข้อมูลราคากลางอะไหล่
                </h5>
            </div>
            <div className="p-3">
                <div className="mb-3 col-12">
                    <div className="d-flex flex-nowrap align-items-center gap-2">
                        <form onSubmit={handleSearch} className="d-flex flex-nowrap align-items-center gap-2">
                            <div className="input-group input-group-sm" style={{ flex: 1 }}>
                                <select
                                    name="system_id"
                                    className="form-select form-select-sm"
                                    style={{ width: "200px" }}
                                    onChange={handleChange}
                                    value={formData.system_id}
                                >
                                    <option value="">เลือกหมวดหมู่ระบบ</option>
                                    {isSystemsShow.map((row, index) => (

                                        <option key={index} value={row.system_id}>{row.system_name}</option>

                                    ))}
                                </select>
                            </div>

                            <div className="input-group input-group-sm" style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    name="part_code"
                                    className="form-control"
                                    placeholder="ค้นหา รหัสอะไหล่..."
                                    onChange={handleChange}
                                    value={formData.part_code}
                                />
                            </div>

                            <div className="input-group input-group-sm" style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    name="part_name"
                                    className="form-control"
                                    placeholder="ค้นหา ชื่ออะไหล่..."
                                    onChange={handleChange}
                                    value={formData.part_name}
                                />
                            </div>

                            <button className="btn btn-primary btn-sm" type="submit">
                                <i className="bi bi-search"></i> ค้นหา
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={handleOpenModalVehiclePartsAdd}
                            >
                                <i className="bi bi-plus me-1"></i> เพิ่มข้อมูล
                            </button>
                        </form>

                    </div>
                </div>


                <div className="">
                </div>
                <div className="mb-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>รหัส</th>
                                <th>ระบบ</th>
                                <th>อะไหล่</th>
                                <th>หน่วย</th>
                                <th>ยี่ห้อ</th>
                                <th>รุ่น</th>
                                <th>ราคา</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">
                                        ไม่พบข้อมูลที่ค้นหา
                                    </td>
                                </tr>
                            ) : (
                                results.map((item, idx) => (
                                    <tr key={item.id || idx}>
                                        <td>{item?.part_code || ""}</td>
                                        <td>{item?.system_name || ""}</td>
                                        <td>{item?.part_name || ""}</td>
                                        <td>{item?.unit || ""}</td>
                                        <td>{item?.brand || ""}</td>
                                        <td>{item?.model || ""}</td>
                                        <td>{item?.price || ""}</td>
                                        <td>
                                            <button 
                                            className="btn btn-primary btn-sm px-2 py-1" 
                                            onClick={() => handleSelectItem(item)} // เรียกใช้ฟังก์ชันเมื่อคลิก
                                            >ใช้</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
     {/* แสดงจำนวนทั้งหมด ค้างด้านล่าง */}
     <div
      style={{
        position: "sticky",
        bottom: 0,
        textAlign: "right",
        padding: "0.5rem",
        background: "white",
        fontSize: "0.875rem",
        color: "#666",
        zIndex: 1,
      }}
    >
      จำนวนทั้งหมด {results.length} รายการ
    </div>
            </div>
            {isOpenModalVehiclePartsAdd && (
                <Modal_vehicle_parts_add isOpen={isOpenModalVehiclePartsAdd} onClose={handleClossModalVehiclePartsAdd} onSuccess={() => setReload(prev => !prev)} />
            )}


        </ReactModal>
    )
}


export default Modal_vehicle_parts_details;