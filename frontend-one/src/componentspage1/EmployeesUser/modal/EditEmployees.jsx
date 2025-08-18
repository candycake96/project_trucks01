import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { apiUrl } from "../../../config/apiConfig";

const EditEmployees = ({ isOpen, onClose, emp }) => {
    if (!emp) return null;

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const initialFormData = {
        fname: "",
        lname: "",
        nickname: "",
        gender: "",
        identification_number: "",
        email: "",
        phone: "",
        date_job: "",
        id_position: "",
        id_department: "",
        id_branch: "",
        // ...other default fields
    };
    
    const [formData, setFormData] = useState(emp || initialFormData);
    const [isSaving, setIsSaving] = useState(false); // To show loading indicator or prevent multiple submissions
    const [errors, setErrors] = useState({});

    const [position, setPosition] = useState([]);
    const [department, setDepartment] = useState([]);
    const [branches, setBranches] = useState([]);

    //position
    const fetchJobposition = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getpositions/${emp.company_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // console.log("Fetched positions:", response.data); // Check fetched data
            setPosition(response.data);
        } catch (error) {
            console.error("Error fetching job positions:", error);
        }
    };

    const fetchDepartment = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getdepartments/${emp.company_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // console.log("Fetched positions:", response.data); // Check fetched data
            setDepartment(response.data);
        } catch (error) {
            console.error("Error fetching job positions:", error);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getbranches/${emp.company_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // console.log("Fetched positions:", response.data); // Check fetched data
            setBranches(response.data);
        } catch (error) {
            console.error("Error fetching job positions:", error);
        }
    };

    useEffect(() => {
        fetchJobposition(); //แสดงตำแหน่ง
        fetchDepartment(); // แสกงแผนก
        fetchBranches(); // สาขา
        if (emp) {
            setFormData({
                ...emp,
                date_job: emp.date_job ? emp.date_job.split("T")[0] : "", // แปลงวันที่
            });
        }
    }, [emp]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    // const handleChange = (e) => {
    //     const { id, value } = e.target;
    //     console.log(`Field: ${id}, Value: ${value}`); // ตรวจสอบค่าที่เปลี่ยน
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [id]: value,
    //     }));
    // };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fname) newErrors.fname = "ชื่อ is required";
        if (!formData.lname) newErrors.lname = "นามสกุล is required";
        if (!formData.date_job) newErrors.date_job = "วันที่เริ่มงาน is required";
        return newErrors;
    };

    const handleSave = async () => {
        const formErrors = validateForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) return;

        setIsSaving(true);
        try {
            const response = await axios.put(
                `${apiUrl}/api/putemployees/${emp.id_emp}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setMessage(response.data.message);
            setMessageType("success");

            // Call fetchDriverLicenses to update the driver license list on the parent page
            // fetchDriverLicenses();

            onClose(); // Close modal after success
        } catch (error) {
            console.error("Error saving employee data:", error);
            setMessage("Failed to update employee data.");
            setMessageType("error");
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Edit Employee"
            style={{
                content: {
                    width: "90%",
                    maxWidth: "700px",
                    height: "80%",
                    margin: "auto",
                    padding: "0",
                    border: "none",
                    borderRadius: "0.5rem",
                    overflowY: "auto", // เพิ่ม overflowY: "auto" เพื่อให้เลื่อนข้อมูลลงมาได้
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999, // ให้ overlay อยู่บนทุกอย่าง
                },
            }}

        >
            <div className="p-3">
                <div className="mb-3 text-center">
                    <p className="fs-5 fw-bold"><i className="bi bi-pencil-square"></i> แก้ไขข้อมูลพนักงาน</p>
                    {/* <hr className=""/> */}
                </div>
                <form>
                    {/* Display success or error message */}
                    {message && (
                        <div
                            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                        >
                            {message}
                        </div>
                    )}

                    <div className="row mb-2">
                        <div className="col-lg-6">
                            <label>รหัสพนักงาน</label>
                            <input
                                type="text"
                                name="fname"
                                value={formData.code}
                                onChange={handleChange}
                            />
                            {errors.fname && <p className="error">{errors.code}</p>}
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-lg-6">
                            <label>ชื่อ</label>
                            <input
                                type="text"
                                name="fname"
                                value={formData.fname}
                                onChange={handleChange}
                            />
                            {errors.fname && <p className="error">{errors.fname}</p>}
                        </div>
                        <div className="col-lg-6">
                            <label>นามสกุล</label>
                            <input
                                type="text"
                                name="lname"
                                value={formData.lname}
                                onChange={handleChange}
                            />
                            {errors.lname && <p className="error">{errors.lname}</p>}
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-lg-6">
                            <label>ชื่อเล่น</label>
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                className="form-control"
                            />
                            {errors.nickname && <p className="error">{errors.nickname}</p>}
                        </div>
                        <div className="col-lg-6">
                            <label>เพศ</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="gender"
                                            id="genderMale"
                                            value="ชาย"
                                            checked={formData.gender === "ชาย"} // เช็คค่าเพื่อให้แสดงผลถูกต้อง
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="genderMale">
                                            ชาย
                                        </label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="gender"
                                            id="genderFemale"
                                            value="หญิง"
                                            checked={formData.gender === "หญิง"} // เช็คค่าเพื่อให้แสดงผลถูกต้อง
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="genderFemale">
                                            หญิง
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="row mb-2">
                        <div className="col-lg-6">
                            <label>เลขประจำตัวประชาชน</label>
                            <input
                                type="text"
                                name="identification_number"
                                value={formData.identification_number}
                                onChange={handleChange}
                            />
                            {errors.identification_number && <p className="error">{errors.identification_number}</p>}
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-lg-6">
                            <label>อีเมล์</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.identification_number}
                                onChange={handleChange}
                            />
                            {errors.identification_number && <p className="error">{errors.identification_number}</p>}
                        </div>
                        <div className="col-lg-6">
                            <label>เบอร์โทรติดต่อ</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <p className="error">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-lg-6">
                            <label htmlFor="date_job">วันที่เริ่มงาน</label>
                            <input
                                id="date_job"
                                type="date"
                                name="date_job"
                                value={formData.date_job ? formData.date_job : ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                            {errors.date_job && <p className="error text-danger">{errors.date_job}</p>}
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor="positionSelect" className="form-label">ตำแหน่ง</label>
                            <select
                                name="id_position"
                                value={formData.id_position || ""}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select Position</option>
                                {position.map((pos) => (
                                    <option key={pos.id_position} value={pos.id_position}>
                                        {pos.name_position}
                                    </option>
                                ))}
                            </select>
                            {errors.id_position && <p className="error text-danger">{errors.id_position}</p>}
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-lg-6">
                            <label htmlFor="departmentSelect" className="form-label">สาขา</label>
                            <select
                                name="id_department"
                                value={formData.id_department || ""}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select Branch</option>
                                {department.map((Dm) => (
                                    <option key={Dm.id_department} value={Dm.id_department}>
                                        {Dm.name_department}
                                    </option>
                                ))}
                            </select>
                            {errors.id_department && <p className="error text-danger">{errors.id_department}</p>}
                        </div>

                        <div className="col-lg-6">
                            <label htmlFor="branchSelect" className="form-label">สาขา</label>
                            <select
                                name="id_branch"
                                value={formData.id_branch || ""}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.id_branch} value={branch.id_branch}>
                                        {branch.branch_name}
                                    </option>
                                ))}
                            </select>
                            {errors.id_branch && <p className="error text-danger">{errors.id_branch}</p>}
                        </div>
                    </div>

                    <div className="row mb-2">

                    </div>


                    {/* Add other fields here */}
                    <div className="form-actions text-center mb-2 p-2">
                        <button className="btn " type="button" onClick={handleSave} disabled={isSaving} style={{ background: "#007bff" }}>
                            {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                        <button className="btn " type="button" onClick={onClose} style={{ background: "#e74c3c" }}>ยกเลิก</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditEmployees;
