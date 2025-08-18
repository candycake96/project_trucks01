import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal_UpdateTex from "../Vehicle/expanded/modal/Modal_UpdateTax";
import { apiUrl } from "../../../config/apiConfig";

const CarTaxRenewal_Main = () => {

    const [isDataTaxend, setDataTaxend] = useState([]);
    const [searchRegNumber, setSearchRegNumber] = useState(""); // ค่าที่กรอกในช่องค้นหาทะเบียน
    const [searchCarType, setSearchCarType] = useState(""); // ค่าที่กรอกในช่องค้นหาประเภทรถ
    const [showAll, setShowAll] = useState(false); // สถานะแสดงข้อมูลทั้งหมด

    const [isOpenModalEditTax, setOpenModalEditTax] = useState(false);
    const [dataTaxModal, setDataTaxModal] = useState(null);
    const handleOpenModalEditTax = (data) => {
        const { reg_id, tax_end_date: tax_end } = data;
        setDataTaxModal({ reg_id, tax_end });
        setOpenModalEditTax(true);
    }

    const handleClesModalEditTax = () => {
        setOpenModalEditTax(false);
    }

    // ฟังก์ชันโหลดข้อมูลที่กำหนด
    const fetchTaxend = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/tax_managment_show`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setDataTaxend(response.data);
        } catch (error) {
            console.error("Error fetching Taxend:", error);
        }
    }

    const fetchTaxendAll = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/tax_managment_show_all`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setDataTaxend(response.data);
        } catch (error) {
            console.error("Error fetching Taxend:", error);
        }
    }


    // เมื่อเริ่มต้นโหลดข้อมูล
    useEffect(() => {
        fetchTaxend();
    }, []);

    // ฟังก์ชันค้นหาข้อมูล
    const filteredData = isDataTaxend.filter(rowTax => {
        return (
            (rowTax.reg_number.toLowerCase().includes(searchRegNumber.toLowerCase())) &&
            (rowTax.car_type_name.toLowerCase().includes(searchCarType.toLowerCase()))
        );
    });

    // ฟังก์ชันคลิกปุ่ม "all"
    const toggleDataView = () => {
        setShowAll(!showAll); // สลับสถานะ
        if (!showAll) {
            fetchTaxendAll(); // ถ้ากดปุ่ม "all" จะโหลดข้อมูลทั้งหมด
        } else {
            fetchTaxend(); // ถ้ากดอีกครั้งจะกลับไปแสดงข้อมูลเดิม
        }
    }

    return (
        <>
            <div className="container">
                <div className="p-3">
                    <div className="text-center">
                        <div className="mb-3">
                            <p className="fw-bolder fs-4">ข้อมูลรถ ภาษี</p>
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
                                        <th>วันที่หมดอายุ</th>
                                        <th>สถานะ</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((rowTax, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{rowTax.reg_number}</td>
                                                <td>{rowTax.car_type_name}</td>
                                                <td>{rowTax.tax_end_date}</td>
                                                <td>
                                                    {rowTax.status === "ทะเบียนหมดอายุ" ? (
                                                        <p className="text-danger">{rowTax.status}</p>
                                                    ) : rowTax.status === "ทะเบียนใกล้หมดอายุ" ? (
                                                        <p className="text-warning">{rowTax.status}</p>
                                                    ) : (
                                                        <p className="text-success">{rowTax.status}</p>
                                                    )}
                                                </td>
                                                <td><button
                                                    className="btn-circle"
                                                    onClick={() => handleOpenModalEditTax(rowTax)}
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
            </div>

            {isOpenModalEditTax && (
                <Modal_UpdateTex isOpen={isOpenModalEditTax} onClose={handleClesModalEditTax} dataTax={dataTaxModal} />
            )}
        </>
    )
}

export default CarTaxRenewal_Main;
