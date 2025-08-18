import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CardDetailsVehicle from "../Vehicle/expanded/CardDetailsVehicle";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";
import Modal_vehicle_status_edit from "./modal/Modal_vehicle_status_edit";

const Vehicle_status = () => {
    const [data, setData] = useState(null); // เก็บข้อมูลรถ
    const [isStatusData, setStatusData] = useState([]); // เก็บข้อมูลสถานะรถ
    const { id } = useParams(); // ดึง `id` จาก URL
    const [isOpenModalStatusEdit, setOpenModalStatusEdit] = useState(false);
    const [isDataModalStatusEdit, setDataModalStatusEdit] = useState(null);

    useEffect(() => {
        if (id) {
            setData({ reg_id: id });
        }
    }, [id]);

    const fetchStatusShow = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vehicle_status_shows/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setStatusData(response.data);
        } catch (error) {
            console.error("❌ Error fetching status:", error);
        }
    };

    useEffect(() => {
        if (data?.reg_id) {
            fetchStatusShow();
        }
    }, [data?.reg_id]);
    

    if (!data) {
        return <div>กำลังโหลดข้อมูล...</div>; // แสดงข้อความโหลดข้อมูล
    }

    // ฟังก์ชันแปลงวันที่
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };


    const handleCloseModalStatusEdit = (data) => {
        setOpenModalStatusEdit(true);
        setDataModalStatusEdit(data); // รีเซ็ตข้อมูล
    };
    
    const handleColseModalStatusEdit = (data) => {
        setOpenModalStatusEdit(false);
    };
    

    return (
        <div className="container">
            <div className="text-center fw-bolder fs-5 p-3 mb-3">
                <p>ข้อมูลรถทะเบียน : {data.reg_id || "-"}</p>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="card mb-2">
                        <div className="card-body">
                            <div className="row">
                                {isStatusData.length > 0 ? (
                                    isStatusData.map((row, index) => (
                                        <div key={index}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <strong>สถานะ : {row.status}</strong>
                                                <button className="btn-animated" style={{ color: 'green' }} onClick={() => handleCloseModalStatusEdit(row)}>
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                            </div>
                                            <p>
                                                เอกสารเพิ่มเติม :{" "}
                                                <a
                                                    href={`${row.file_status}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    id="btn-animated"
                                                    style={{ color: "#c0392b" }}
                                                >
                                                    <i className="bi bi-file-earmark-pdf-fill"></i> เอกสารเพิ่มเติม
                                                </a>
                                            </p>

                                            <p>วันที่มีผลบังคับใช้ : {formatDate(row.status_active_date)}</p>
                                            <p>หมายเหตุ : {row.status_annotation}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center">
                                        <p>ไม่มีข้อมูล</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <CardDetailsVehicle dataVehicle={data} />
                </div>
            </div>

            {isOpenModalStatusEdit && (
                <Modal_vehicle_status_edit isOpen={isOpenModalStatusEdit} onClose={handleColseModalStatusEdit} onData={isDataModalStatusEdit} />
            )}

        </div>
    );
};

export default Vehicle_status;
