import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_pm_show_all = ({ isOpen, onClose}) => {

    const [dataPm, setDataPm] = useState([]);
   const fetchDataPm = async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/pm_select_all_vehicle`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    // ✅ ดึงเฉพาะ array
    setDataPm(response.data.data || []);
  } catch (error) {
    console.log("An error occurred in displaying data: ", error);
  }
};


    useEffect(()=>{
        fetchDataPm();
    }, []);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="ตรวจสอบ PM"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "1100px",
                    maxHeight: "90vh",
                    margin: "auto",
                    padding: "0",
                    border: "none",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
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
            {/* Header */}
            <div
                className="modal-header bg-light border-bottom"
                style={{
                    padding: "1rem",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                }}
            >
                <h5 className="modal-title fw-bold m-0">🔍 ตรวจสอบ PM รถยนต์</h5>
                <button
                    onClick={onClose}
                    className="btn-close"
                    style={{ marginLeft: "auto" }}
                ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-3" style={{ overflowY: "auto" }}>
                {dataPm.length === 0 ? (
                    <div className="alert alert-info text-center">
                        ❗ ไม่มีข้อมูล PM ที่ถึงเวลา
                    </div>
                ) : (
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ทะเบียนรถ</th>
                                <th>รายการ</th>
                                <th>ระยะตามแผน (กม.)</th>
                                <th>เลขไมล์ล่าสุด</th>
                                <th>เลขไมล์ PM ล่าสุด</th>
                                <th>วิ่งไปแล้ว (กม.)</th>
                                <th>สถานะ PM</th>
                                <th>สถานะซ่อม</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataPm.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.reg_number}</td>
                                    <td>{row.item_name}</td>
                                    <td>{row.distance_km}</td>
                                    <td>{row.total_distance}</td>
                                    <td>{row.last_pm_mileage}</td>
                                    <td>{row.distance_since_pm}</td>
                                    <td>
                                        <span
                                            className={`badge ${row.pm_status === "ถึงเวลา PM"
                                                    ? "bg-danger"
                                                    : row.pm_status === "ใกล้ถึงเวลา PM"
                                                        ? "bg-warning text-dark"
                                                        : "bg-success"
                                                }`}
                                        >
                                            {row.pm_status}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${row.repair_status === "ซ่อมแล้ว"
                                                    ? "bg-success"
                                                    : "bg-secondary"
                                                }`}
                                        >
                                            {row.repair_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </ReactModal>
    );
};

export default Modal_pm_show_all;
