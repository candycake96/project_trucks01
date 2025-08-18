import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal_UpdateCMI from "../Vehicle/expanded/modal/Modal_UpdataCMI";
import { apiUrl } from "../../../config/apiConfig";

const CarCMI_Main = () => {
    
    const [isDataCMIend, setDataCMIend] = useState([]);
    const [searchRegNumber, setSearchRegNumber] = useState(""); // ค่าที่กรอกในช่องค้นหาทะเบียน
    const [searchCarType, setSearchCarType] = useState(""); // ค่าที่กรอกในช่องค้นหาประเภทรถ
    const [showAll, setShowAll] = useState(false); // สถานะแสดงข้อมูลทั้งหมด

    const [isOpenModalEditCMI, setOpenModalEditCMI] = useState(false);
    const [dataCMIModal, setDataCMIModal] = useState(null);
    const handleOpenModalEditCMI = (data) => {
        const { reg_id, cmi_end_date: cmi_end, cmi_start_date: cmi_start } = data;
        setDataCMIModal({ reg_id, cmi_end , cmi_start});
        setOpenModalEditCMI(true);
    }

    const handleClesModalEditCMI = () => {
        setOpenModalEditCMI(false);
    }

    // ฟังก์ชันโหลดข้อมูลที่กำหนด
    const fetchCMIend = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/cmi_managment_show`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setDataCMIend(response.data);
        } catch (error) {
            console.error("Error fetching CMIend:", error);
        }
    }

    const fetchCMIendAll = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/cmi_managment_show_all`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setDataCMIend(response.data);
        } catch (error) {
            console.error("Error fetching CMIend:", error);
        }
    }


    // เมื่อเริ่มต้นโหลดข้อมูล
    useEffect(() => {
        fetchCMIend();
    }, []);

    // ฟังก์ชันค้นหาข้อมูล
    const filteredData = isDataCMIend.filter(rowCMI => {
        return (
            (rowCMI.reg_number.toLowerCase().includes(searchRegNumber.toLowerCase())) &&
            (rowCMI.car_type_name.toLowerCase().includes(searchCarType.toLowerCase()))
        );
    });

    // ฟังก์ชันคลิกปุ่ม "all"
    const toggleDataView = () => {
        setShowAll(!showAll); // สลับสถานะ
        if (!showAll) {
            fetchCMIendAll(); // ถ้ากดปุ่ม "all" จะโหลดข้อมูลทั้งหมด
        } else {
            fetchCMIend(); // ถ้ากดอีกครั้งจะกลับไปแสดงข้อมูลเดิม
        }
    }

    // ฟังก์ชันแปลงวันที่
const formatDate = (dateString) => {
    const date = new Date(dateString); // สร้างอ็อบเจกต์ Date จากวันที่ที่ได้รับ
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('th-TH', options); // แสดงผลในรูปแบบวัน เดือน ปี (ภาษาไทย)
};

    return (
        <div className="container">
        <div className="p-3">
            <div className="text-center">
                <div className="mb-3">
                    <p className="fw-bolder fs-4">ข้อมูลรถ พรบ.</p>
                </div>
            </div>

            <div>
                <div className="mb-3">
                    <div className="row">
                        <p className="fw-bolder">ค้นหาข้อมูล</p>
                        <div className="col-lg-3">

                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="ค้นหาทะเบียน"
                                value={searchRegNumber}
                                onChange={(e) => setSearchRegNumber(e.target.value)}
                            />
                        </div>
                        <div className="col-lg-3">
                            <p></p>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="ค้นหาประเภทรถ"
                                value={searchCarType}
                                onChange={(e) => setSearchCarType(e.target.value)}
                            />
                        </div>
                        <div className="col-lg-3">
                            <div className="mb-3">
                                {/* ปุ่ม "All" เพื่อรีเซ็ตการค้นหา */}
                                <button className="btn btn-primary" onClick={toggleDataView}>
                                    {showAll ? "ย้อนกลับ" : "ค้นหาทั้งหมด"}
                                </button>
                            </div>
                        </div>
                    </div>


                </div>

                <div>
                    <table className="table table-hover table-borderless">
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th>ทะเบียน</th>
                                <th>ประเภทรถ</th>
                                <th>วันที่เริ่มต้น</th>
                                <th>วันที่หมดอายุ</th>
                                <th>สถานะ</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((rowCMI, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{rowCMI.reg_number}</td>
                                        <td>{rowCMI.car_type_name}</td>
                                        <td>{formatDate(rowCMI.cmi_start_date)}</td>
                                        <td>{formatDate(rowCMI.cmi_end_date)}</td>
                                        <td>
                                            {rowCMI.status === "ทะเบียนหมดอายุ" ? (
                                                <p className="text-danger">{rowCMI.status}</p>
                                            ) : rowCMI.status === "ทะเบียนใกล้หมดอายุ" ? (
                                                <p className="text-warning">{rowCMI.status}</p>
                                            ) : (
                                                <p className="text-success">{rowCMI.status}</p>
                                            )}
                                        </td>
                                        <td><button
                                            className="btn-circle"
                                            onClick={() => handleOpenModalEditCMI(rowCMI)}
                                        >
                                            <i className="bi bi-pencil-fill"></i>
                                        </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">ไม่มีข้อมูล</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    {isOpenModalEditCMI && (
        <Modal_UpdateCMI isOpen={isOpenModalEditCMI} onClose={handleClesModalEditCMI} dataCMI={dataCMIModal} />
    )}

    </div>



    )
}

export default CarCMI_Main;