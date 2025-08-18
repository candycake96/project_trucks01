import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_vehicle_systems = ({ isOpen, onClose }) => {


    const [isSystemsShow, setSystemsShow] = useState([]);
    const [systemName, setSystemName] = useState('');
    const [isEditId, setEditId] = useState(null);
    const [message, setMessage] = useState('');

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

    const handleSystemsAdd = async (e) => {
        e.preventDefault();

        try {
            let response
            if (isEditId) {
                // แก้ไขข้อมูล update Data
                response = await axios.put(
                    `${apiUrl}/api/systems_update/${isEditId}`,
                    { system_name: systemName },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
            } else {
                // เพิ่มข้อมูลใหม่
                response = await axios.post(
                    `${apiUrl}/api/systems_add`,
                    { system_name: systemName },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
            }
            setMessage(response.data.message || "สำเร็จแล้ว");
            setSystemName("");
            setEditId(null);
            fetchSystemsShows();
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "เกิดข้อผิดพลาด");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?\nการลบอาจมีผลกระทบกับเอกสารหรือข้อมูลอื่นที่เกี่ยวข้อง")) return;
        try {
            const response = await axios.delete(`${apiUrl}/api/systems_delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setMessage(response.data.message || "ลบสำเร็จ");
            fetchSystemsShows();
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "เกิดข้อผิดพลาดในการลบ");
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
                    ข้อมูลระบบ
                </h5>
            </div>
            <div className="p-3">
                {/* <div className="text-center mb-2">
                    <p className="fw-bolder">ข้อมูลระบบ</p>
                </div> */}

                <div className="row">
                    <div className="col-lg-7">
                        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ลำดับ</th>
                                        <th>ชื่อระบบ</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isSystemsShow.map((row, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{row.system_name}</td>
                                            <td>
                                                <div className="">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary rounded-circle me-1"
                                                        onClick={() => handleDelete(row.system_id)}
                                                    >
                                                        <i className="bi bi-trash3-fill"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-primary rounded-circle me-1"
                                                        onClick={() => {
                                                            setEditId(row.system_id);
                                                            setSystemName(row.system_name);
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <form action="" onSubmit={handleSystemsAdd}>
                            <div className="mb-3">
                                <label htmlFor="system_name">ชื่อระบบ</label>
                                <input
                                    type="text"
                                    name="system_name"
                                    id="system_name"
                                    value={systemName}
                                    onChange={(e) => setSystemName(e.target.value)}
                                    placeholder="ระบบ..."
                                />
                            </div>
                            <div className="text-center">
                                <div className="text-center">
                                    <button className="btn btn-primary me-2">
                                        {isEditId ? "บันทึกการแก้ไข" : "บันทึก"}
                                    </button>

                                    {isEditId && (
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setEditId(null);
                                                setSystemName("");
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

export default Modal_vehicle_systems;