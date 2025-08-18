import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";


const ShowDetailAddress = ({ emp, onEdit }) => {
    if (!emp) return null; //ตรวจสอบค่าเพื่อไม่ให้ error 
    const id = emp.id_emp;
    const [addressDetails, setAddressDetails] = useState([]);
    const fetchAddress = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getaddress/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // console.log("Fetched positions:", response.data); // Check fetched data
            setAddressDetails(response.data);
        } catch (error) {
            console.error("Error fetching job positions:", error);
        }
    };

    useEffect(() => {
        fetchAddress()
    }, []);


    return (
        <>
            <div className="">
                {addressDetails.map((row) => (
                    <div key={row.address_id}>

                        {row.address_type === "permanent" && (
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="col-4 fw-bold">ที่อยู่ตามบัตรประชาชน</div>
                                    <button style={{ color: '#008000', border: 'none', background: 'transparent' }} onClick={() => onEdit(row)}>
                                        <i className="bi bi-pencil-square"></i> แก้ไข
                                    </button>
                                </div>


                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">ประเทศ:</div>
                                    <div className="col-4">{row.country}</div>
                                </div>

                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">รหัสไปรษณีย์:</div>
                                    <div className="col-4" >{row.postal_code}</div>
                                </div>

                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">ที่อยู่:</div>
                                    <div className="col-9">{row.house_number}</div>
                                </div>

                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">ถนน/ตำบล:</div>
                                    <div className="col-4">{row.street}</div>
                                </div>

                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">อำเภอ:</div>
                                    <div className="col-4">{row.city}</div>
                                </div>

                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">จังหวัด:</div>
                                    <div className="col-4">{row.province}</div>
                                </div>
                            </div>


                        )}

                        <hr className="" />
                        <br />

                        {row.address_type === "current" && (
                            <div className="mb-3">
                                
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="col-4 fw-bold">ที่อยู่ปัจจุบัน</div>
                                    <button style={{ color: '#008000', border: 'none', background: 'transparent' }}  onClick={() => onEdit(row)}>
                                        <i className="bi bi-pencil-square"></i> แก้ไข
                                    </button>
                                </div>


                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">ประเทศ:</div>
                                    <div className="col-4">{row.country}</div>
                                </div>

                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">รหัสไปรษณีย์:</div>
                                    <div className="col-4" >{row.postal_code}</div>
                                </div>

                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">ที่อยู่:</div>
                                    <div className="col-9">{row.house_number}</div>
                                </div>

                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">ถนน/ตำบล:</div>
                                    <div className="col-4">{row.street}</div>
                                </div>

                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">อำเภอ:</div>
                                    <div className="col-4">{row.city}</div>
                                </div>

                                <div className="row bg-light p-1 mb-2">
                                    <div className="col-3 fw-bold">จังหวัด:</div>
                                    <div className="col-4">{row.province}</div>
                                </div>
                                <br />
                            </div>

                        )}
                    </div>
                ))}

            </div>
        </>
    )
}

export default ShowDetailAddress;