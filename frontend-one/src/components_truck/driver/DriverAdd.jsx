import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../config/apiConfig";

const AddDriver = ({ onSubmit }) => {
    const [employeeDriver, setEmployeeDriver] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");


    const [idemp, setIdemp] = useState("");
    const [licensenumber, setLicensenumber] = useState("");
    const [issueddate, setIssueddate] = useState("");
    const [expirydate, setExpirydate] = useState("");
    const [licensetype, setLicensetype] = useState("");
    const [issuingauthority, setIssuingauthority] = useState("");
    const status = "Active";

    // Fetch employee data
    const fetchEmployeeDriver = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getemployeesdriver`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setEmployeeDriver(response.data);
        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };

    useEffect(() => {
        fetchEmployeeDriver();
    }, []);


    // Handle Add Driver License
    const handleAddDriverlicense = async (e) => {
        e.preventDefault(); // ป้องกันการ refresh หน้า
        try {
            const response = await axios.post(
                `${apiUrl}/api/adddriverlicense`,
                {
                    id_emp: idemp,
                    license_number: licensenumber,
                    issued_date: issueddate,
                    expiry_date: expirydate,
                    license_type: licensetype,
                    issuing_authority: issuingauthority,
                    status: status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            // ตั้งค่าข้อความเมื่อสำเร็จ
            setMessage(response.data.message);
            setMessageType("success");

            // ล้างค่าในฟอร์ม
            setIdemp("");
            setLicensenumber("");
            setIssueddate("");
            setExpirydate("");
            setLicensetype("");
            setIssuingauthority("");

            // แจ้ง Parent Component ว่ามีการ submit สำเร็จ
            if (onSubmit) {
                onSubmit();
            }
        } catch (error) {
            console.error("Error adding driver license:", error);
            setMessage("Failed to add driver license.");
            setMessageType("error");
        }
    };

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="mb-3 p-3">
                        {/* Display success or error message */}
                        {message && (
                            <div
                                className={`alert ${
                                    messageType === "success" ? "alert-success" : "alert-danger"
                                }`}
                            >
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleAddDriverlicense}>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <label htmlFor="" className="form-label">
                                        รหัสใบขับขี่
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={licensenumber}
                                        onChange={(e) => setLicensenumber(e.target.value)}
                                    />
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <label htmlFor="" className="form-label">
                                        ชื่อ รหัสพนักงาน
                                    </label>
                                    <select
                                        id="userroleSelect"
                                        className="form-select"
                                        value={idemp}
                                        onChange={(e) => setIdemp(e.target.value)}
                                    >
                                        <option value="">Open this select menu</option>
                                        {employeeDriver.map((role) => (
                                            <option key={role.id_emp} value={role.id_emp}>
                                                {role.fname} {role.lname}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 mb-3">
                                    <label htmlFor="" className="form-label">
                                        วันที่ออกใบขับขี่
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={issueddate}
                                        onChange={(e) => setIssueddate(e.target.value)}
                                    />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label htmlFor="" className="form-label">
                                        วันที่หมดอายุใบขับขี่
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={expirydate}
                                        onChange={(e) => setExpirydate(e.target.value)}
                                    />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label htmlFor="" className="form-label">
                                        ประเภทใบขับขี่
                                    </label>
                                    <select
                                        className="form-select"
                                        aria-label="Default select example"
                                        value={licensetype}
                                        onChange={(e) => setLicensetype(e.target.value)}
                                    >
                                        <option value="">กรุณาเลือกประเภทใบขับขี่</option>
                                        <option value="บ.1">บ.1 รถยนต์ส่วนบุคคล</option>
                                        <option value="บ.2">บ.2 รถบรรทุกส่วนตัว</option>
                                        <option value="บ.3">บ.3 รถพ่วง รถเทรลเลอร์</option>
                                        <option value="บ.4">บ.4 รถบรรทุกของไวไฟ</option>
                                        <option value="ท.3">ท.3 รถพ่วง รถเทรลเลอร์ (การลากจูง)</option>
                                        <option value="ท.4">ท.4 รถบรรทุกของไวไฟ</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="" className="form-label">
                                    หน่วยงานที่ออกใบขับขี่
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={issuingauthority}
                                    onChange={(e) => setIssuingauthority(e.target.value)}
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    className="btn"
                                    type="submit"
                                    style={{ background: "#20c997", color: "#fff" }}
                                >
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default AddDriver;
