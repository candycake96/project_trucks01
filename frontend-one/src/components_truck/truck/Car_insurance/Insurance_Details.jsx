import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import { useLocation } from "react-router-dom";
import Insurance_Add_form from "./modal/Insurance_Add_Form";
import Modal_Insurance_Edit from "./modal/Modal_Insurance_Edit";

const Insurance_Details = () => {


    const location = useLocation();
    const rowMiData = location.state || {};

    const [isInsuranceData, setInsuraceData] = useState([]);
    const [isOpenPopoverInsurance, setOpenPopoverInsurance] = useState(false);
    const [isPopoverInsuranceData, setPopoverInsuranceData] = useState(null);
    const [reload, setReload] = useState(false); // โหลดใหม่เมื่อ `reload` เปลี่ยน

    // modal
    const [isOpenModalInsuranceEdit, setOpenModalInsuranceEdit] = useState(false);
    const [isDataModalInsuranceEdit, setDataModalInsuranceEdit] = useState(null);

// ฟังก์ชันสำหรับเปิด/ปิด popover
const handleTogglePopoverInsuranceAddForm = (data) => {
    setOpenPopoverInsurance((prevState) => !prevState);  // เปลี่ยนสถานะให้เปิด/ปิด
    if (!isOpenPopoverInsurance) {
        setPopoverInsuranceData(data); // ตั้งค่า data เมื่อเปิด popover
    } else {
        setPopoverInsuranceData(null); // รีเซ็ตข้อมูลเมื่อปิด popover
    }
}

const fetchInsuranceData = async () => {
    try {
        const response = await axios.get(
            `${apiUrl}/api/car_insurance_details/${rowMiData.reg_id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );
        console.log('Insurance data fetched:', response.data);
        setInsuraceData(response.data);
    } catch (error) {
        console.error("Error fetching vehicle data:", error);
    }
};


    useEffect(() => {
        console.log('Reload state changed:', reload);
        fetchInsuranceData();
    }, [reload]);
    

    // ฟังก์ชันแปลงวันที่
    const formatDate = (dateString) => {
        const date = new Date(dateString); // สร้างอ็อบเจกต์ Date จากวันที่ที่ได้รับ
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('th-TH', options); // แสดงผลในรูปแบบวัน เดือน ปี (ภาษาไทย)
    };


    const handleOpenModalInsuranceEdit = (data) => {
        setOpenModalInsuranceEdit(true);
        setDataModalInsuranceEdit(data);
    };
    const handleClassOpenModalInsuranceEdit = () => {
        setOpenModalInsuranceEdit(false);
        setDataModalInsuranceEdit(null);
    };

    const handleDeleteinsurance = async (id) => {
        try {
            // Send DELETE request to the API
            const response = await axios.delete(`${apiUrl}/api/car_insurance_delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Authorization header with token
                    "Content-Type": "multipart/form-data" // Specify content type if needed
                },
            });
    
            // Check if the response status is OK (200)
            if (response.status === 200) {
                fetchInsuranceData(); // Reload the insurance data
                alert("Insurance deleted successfully!"); // Success alert
            } else {
                alert("Failed to delete insurance. Please try again."); // If response status is not 200
            }
        } catch (error) {
            // Handle any errors from the API call
            console.error("Error deleting insurance:", error);
            alert("Failed to delete insurance. Please try again."); // Error alert
        }
    };
    
    

    return (
        <>
            <div className="container">
                <div className="p-3">
                    <div className=" mb-3 d-flex gap-2 btn-sm">
                        <p className="fw-bolder fs-4">ประกันภัย รถทะเบียน {rowMiData.reg_number}</p>
                        <button className="btn btn-primary" onClick={()=> handleTogglePopoverInsuranceAddForm(rowMiData)}> <i class="bi bi-journal-plus"></i> เพิ่มข้อมูลประกันภัย</button>
                    </div>
<div className="mb-3">
    <div className="">
        {isOpenPopoverInsurance && (
            <div className="">
                <div className="mb-2">
                    <hr />
                </div>
            <Insurance_Add_form dataCar={isPopoverInsuranceData}  onSuccess={() => setReload((prev) => !prev)}/>                
            </div>
        )  
        }
    </div>
</div>
<div className="mb-3">
    <hr />
</div>

                    <div className="card">
                        <div className="card-body">

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ลำดับ</th>
                                        <th>วันที่เริ่มต้น</th>
                                        <th>วันที่สิ้นสุด</th>
                                        <th>ทุนประกัน</th>
                                        <th>เบี้ยประกัน</th>
                                        <th>ชั้นประกัน</th>
                                        <th>คุ้มครอง</th>
                                        <th>สถานะ</th>
                                        <th className="text-center">เอกสารเพิ่มเติม</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isInsuranceData && isInsuranceData.length > 0 ? (
                                        isInsuranceData.map((row, index) => (
                                            <tr key={index}>
                                                <td><p>{index + 1}</p></td>
                                                <td>{formatDate(row.insurance_start_date)}</td>
                                                <td>{formatDate(row.insurance_end_date)}</td>
                                                <td>{row.insurance_converage_amount!= null ? row.insurance_converage_amount.toLocaleString( { style: 'currency', currency: 'THB' }) : '-'}</td>
                                                <td>{row.insurance_premium != null ? row.insurance_premium.toLocaleString( { style: 'currency', currency: 'THB' }) : '-'}
                                                </td>
                                                <td>{row.insurance_class}</td>
                                                <td>{row.coverage_type}</td>
                                                <td>{row.status}</td>
                                                <td className="text-center">
                                                    {row.insurance_file ? (
                                                        <a href={row.insurance_file} style={{ color: "#cd6155" }}>
                                                            <i className="bi bi-file-pdf-fill"></i> ไฟล์
                                                        </a>
                                                    ) : (
                                                        <p>NO!</p>
                                                    )}
                                                    
                                                </td>
                                                <td>
                                                    <button className="btn btn-primary"
                                                    onClick={()=>handleOpenModalInsuranceEdit(row)}
                                                    >แก้ไข</button>
                                                    <button className="btn btn-danger" onClick={()=> handleDeleteinsurance(row.insurance_id)}>ลบ</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center text-muted">
                                                ไม่มีข้อมูลประกัน
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>

                    </div>
                </div>
            </div>


            {isOpenModalInsuranceEdit && (
                <Modal_Insurance_Edit isOpen={isOpenModalInsuranceEdit} onClose={handleClassOpenModalInsuranceEdit} onData={isDataModalInsuranceEdit} onSuccess={() => setReload((prev) => !prev)}/>
            )}
        </>
    )
};


export default Insurance_Details;