import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";


const ShowDetailDriverLicense = ({ emp, onInsert, onEdit, fetchDriverLicenses  }) => {
    if (!emp) return null;

    const id = emp.id_emp;
    const [driverLicense, setDriverLicense] = useState([]);

    const fetchDriverLicense = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getdriverLicense/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // console.log("Fetched positions:", response.data); // Check fetched data
            setDriverLicense(response.data);
        } catch (error) {
            console.error("Error fetching job positions:", error);
        }
    };


    useEffect(() => {
        fetchDriverLicense()
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${apiUrl}/api/deletedriverlicense/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            )
            fetchDriverLicense()
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <div>
                <div className="mb-2">
                    <button type="button" className="" style={{ color: '#008000', border: 'none', background: 'transparent' }}
                        onClick={() => onInsert(emp)} >
                        <i className="bi bi-pencil-square"></i> เพิ่มข้อมูลใบขับขี่
                    </button>
                </div>

                {driverLicense.map((rowDL, index) => (
                    <div className="" key={index}>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="fw-bold">ใบขับขี่ที่ {index + 1}</div>
                            <div>
                                <button
                                    style={{
                                        color: '#008000',
                                        border: 'none',
                                        background: 'transparent',
                                        marginRight: '10px', // Add spacing between buttons
                                    }}
                                    onClick={() => onEdit(rowDL)}
                                >
                                    <i className="bi bi-pencil-square"></i> แก้ไข
                                </button>
                                <button
                                    style={{
                                        color: '#e74c3c',
                                        border: 'none',
                                        background: 'transparent',
                                    }}
                                    onClick={() => {
                                        const confirmDelete = window.confirm(
                                            `คุณแน่ใจหรือไม่ว่าต้องการดำเนินการลบข้อมูลใบขับขี่หมายเลข ${rowDL.license_number}`
                                        );
                                        if (confirmDelete) {
                                            handleDelete(rowDL.id_driver);
                                        }
                                    }} // Adjusted to distinguish "Delete"
                                >
                                    <i className="bi bi-trash"></i> ลบ
                                </button>
                            </div>
                        </div>


                        <div className="row bg-light p-1 mb-2">
                            <div className="col-4 fw-bold">เลขที่ใบอนุญาตขับขี่:</div>
                            <div className="col-8">{rowDL.license_number}</div>
                        </div>
                        <div className="row bg-light p-1 mb-2">
                            <div className="col-4 fw-bold">วันที่ออกใบขับขี่:</div>
                            <div className="col-8">{rowDL.issued_date}</div>
                        </div>
                        <div className="row bg-light p-1 mb-2">
                            <div className="col-4 fw-bold">วันที่หมดอายุ:</div>
                            <div className="col-8">{rowDL.expiry_date}</div>
                        </div>
                        <div className="row bg-light p-1 mb-2">
                            <div className="col-4 fw-bold">ประเภทใบขับขี่:</div>
                            <div className="col-8">{rowDL.license_code} {rowDL.license_name}</div>
                        </div>
                        <div className="row bg-light p-1 mb-2">
                            <div className="col-4 fw-bold">นายทะเบียนจังหวัด:</div>
                            <div className="col-8">{rowDL.issuing_authority}</div>
                        </div>
                        <hr className="mb-3" />


                    </div>
                ))}

            </div>


        </>
    )
}

export default ShowDetailDriverLicense;