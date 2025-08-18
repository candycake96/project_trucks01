import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../config/apiConfig';

const EmployeeInfoForm = ({ employeeInfo, setEmployeeInfo }) => {

    const [position, setPosition] = useState([]);
    const [department, setDepartment] = useState([]);
    const [branches, setBranches] = useState([]);
    const [company, setCompany] = useState([]);

    const [image, setImage] = useState(null); // เก็บข้อมูลภาพ
    const [preview, setPreview] = useState(null); // เก็บ URL สำหรับแสดงภาพ
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEmployeeInfo((prevState) => ({
                ...prevState, // Keep the other values intact
                image: file, // Update the image only
            }));
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl); // Set the image preview
        }
    };


    const removeImage = () => {
        setImage(null); // ล้างข้อมูลไฟล์ภาพ
        setPreview(null); // ล้าง URL ตัวอย่าง

        // ลบข้อมูลภาพจาก setEmployeeInfo โดยไม่กระทบข้อมูลอื่นๆ
        setEmployeeInfo(prevState => ({
            ...prevState,
            image: null, // ลบข้อมูลภาพจาก state
        }));
    };

    //position
    const fetchJobposition = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getpositions/${employeeInfo.company_id}`,
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
                `${apiUrl}/api/getdepartments/${employeeInfo.company_id}`,
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
                `${apiUrl}/api/getbranches/${employeeInfo.company_id}`,
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

    const fetchCompany = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getcompany`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // console.log("Fetched positions:", response.data); // Check fetched data
            setCompany(response.data);
        } catch (error) {
            console.error("Error fetching job positions:", error);
        }
    };

    const renderCompanySelection = (employeeInfo) => {
        if (!employeeInfo.company_id) {
            return (
                <div className="" style={{color: 'red'}}>
                    <p>กรุณาเลือก องค์กร</p>
                </div>
            );
        }
        return null;
    };



    useEffect(() => {
        fetchJobposition();
        fetchDepartment();
        fetchBranches();
        fetchCompany();
    }, [employeeInfo.company_id]);

    return (
        <div className=''>

            <div style={{ textAlign: 'center', margin: '20px' }}>
                <div
                    style={{
                        position: 'relative',
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%', // ทำให้กรอบเป็นวงกลม
                        border: '2px dashed #ccc', // กรอบเส้นประ
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '10px auto',
                        overflow: 'hidden',
                    }}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover', // ตัดแต่งภาพให้พอดีกับกรอบ
                                position: 'absolute',
                            }}
                        />
                    ) : (
                        <span style={{ color: '#aaa', fontSize: '14px' }}>Image</span>
                    )}

                    {/* ปุ่มเพิ่มเครื่องหมาย */}
                    <label
                        htmlFor="image-upload"
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        +
                    </label>

                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }} // ซ่อน input file
                    />
                </div>
            </div>


            {/* row */}
            <div className="row">
                <div className="col-lg-6">
                    <div className="mb-3">
                        <label htmlFor="inputCode">รหัสผนักงาน <span style={{ color: "red" }}> *</span></label>
                        <input
                            type="text"
                            className='form-control'
                            value={employeeInfo.code}
                            onChange={(e) => setEmployeeInfo({ ...employeeInfo, code: e.target.value })}
                            placeholder="First Name"
                        />
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="mb-3">
                        <label htmlFor="inputDateJob">วันที่เริ่มงาน <span style={{ color: "red" }}> *</span></label>
                        <input
                            type="date"
                            className='form-control'
                            value={employeeInfo.date_job}
                            onChange={(e) => setEmployeeInfo({ ...employeeInfo, date_job: e.target.value })}
                            placeholder="First Name"
                        />
                    </div>
                </div>
            </div>


            {/* row */}
            <div className="row">
                <div className="col-lg-6">
                    <div className="mb-3">
                        <label htmlFor="inputFname">ชื่อ <span style={{ color: "red" }}> *</span> </label>
                        <input
                            type="text"
                            className='form-control'
                            value={employeeInfo.fname}
                            onChange={(e) => setEmployeeInfo({ ...employeeInfo, fname: e.target.value })}
                            placeholder="First Name"
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="mb-3">
                        <label htmlFor="inputLname">นามสกุล <span style={{ color: "red" }}> *</span> </label>
                        <input
                            type="text"
                            className='form-control'
                            value={employeeInfo.lname}
                            onChange={(e) => setEmployeeInfo({ ...employeeInfo, lname: e.target.value })}
                            placeholder="Last Name"
                        />
                    </div>
                </div>
            </div>

            {/* NOT  */}
            <div className="mb-3">
                <label htmlFor="inputNickname">ชื่อเล่น <span style={{ color: "red" }}> *</span></label>
                <input
                    type="text"
                    className='form-control'
                    value={employeeInfo.nickname}
                    onChange={(e) => setEmployeeInfo({ ...employeeInfo, nickname: e.target.value })}
                    placeholder="Nickname"
                />
            </div>

            <div className="row">
                <div className="mb-3 col-lg-6">
                    <label htmlFor="inputNickname">เลขประจำตัวประชาชน <span style={{ color: "red" }}> *</span></label>
                    <input
                        type="text"
                        className='form-control'
                        value={employeeInfo.identification_number}
                        onChange={(e) => setEmployeeInfo({ ...employeeInfo, identification_number: e.target.value })}
                        placeholder="National identification number"
                    />
                </div>

                <div className="mb-3 col-lg-6">
                    <label htmlFor="passport">เลขพาสปอร์ต / หนังสือเดินทาง (ถ้ามี)</label>
                    <input
                        type="text"
                        className='form-control'
                        value={employeeInfo.passport}
                        onChange={(e) => setEmployeeInfo({ ...employeeInfo, passport: e.target.value })}
                        placeholder="Passport"
                    />
                </div>
            </div>


            <div className="row">
                <div className="col-lg-6 mb-3">
                    <label htmlFor="inputEmail">อีเมล์ <span style={{ color: "red" }}> *</span></label>
                    <input
                        type="email"
                        className='form-control'
                        value={employeeInfo.email}
                        onChange={(e) => setEmployeeInfo({ ...employeeInfo, email: e.target.value })}
                        placeholder="Email"
                    />
                </div>
                <div className="col-lg-6 mb-3">
                    <label htmlFor="inputEmail">ตั้งรหัสผ่านเข้าใช้งาน <span style={{ color: "red" }}> *</span></label>
                    <input
                        type="text"
                        className='form-control'
                        value={employeeInfo.password}
                        onChange={(e) => setEmployeeInfo({ ...employeeInfo, password: e.target.value })}
                        placeholder="password"
                    />
                </div>

            </div>

            <div className="mb-3">
                <label htmlFor="inputPhone">เบอร์โทรติดต่อ </label>
                <input
                    type="text"
                    className='form-control'
                    value={employeeInfo.phone}
                    onChange={(e) => setEmployeeInfo({ ...employeeInfo, phone: e.target.value })}
                    placeholder="Phone"
                />
            </div>


            {/* gender */}
            <div className="row col-2 mb-3">
                <div className="col">
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            value="ชาย"
                            onChange={(e) => setEmployeeInfo({ ...employeeInfo, gender: e.target.value })}
                        />
                        <label className="foem-check-label" htmlFor="flexRadioDefault1">
                            ชาย
                        </label>
                    </div>
                </div>
                <div className="col">
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            value="หญิง"
                            onChange={(e) => setEmployeeInfo({ ...employeeInfo, gender: e.target.value })}
                        />
                        <label className="foem-check-label" htmlFor="flexRadioDefault1">
                            หญิง
                        </label>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-4">
                    <div className="mb-3">
                        <label htmlFor="departmentSelect" className="form-label">
                            บริษัท / องค์กร <span style={{ color: "red" }}> *</span>
                        </label>
                        <select
                            id="departmentSelect"
                            className="form-select"
                            value={employeeInfo.company_id || ""}
                            onChange={(e) =>
                                setEmployeeInfo({ ...employeeInfo, company_id: e.target.value })
                            }
                        >
                            <option value="">Select a company</option>
                            {company.map((company) => (
                                <option key={company.company_id} value={company.company_id}>
                                    {company.company_name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>

            <div className="row">
                <div className="col-lg-4">
                    <div className="mb-3">
                        <label htmlFor="departmentSelect" className="form-label">
                            ตำแหน่ง <span style={{ color: "red" }}> *</span>
                        </label>
                        <select
                            id="departmentSelect"
                            className="form-select"
                            value={employeeInfo.id_position || ""} // Default to empty if undefined
                            onChange={(e) =>
                                setEmployeeInfo({ ...employeeInfo, id_position: e.target.value })
                            }
                        >
                            <option value="">Open this select menu</option>
                            {position.map((pos) => (
                                <option key={pos.id_position} value={pos.id_position}>
                                    {pos.name_position}
                                </option>
                            ))}
                        </select>
                        {
                            renderCompanySelection(employeeInfo)
                        }
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="mb-3">
                        <label htmlFor="departmentSelect" className="form-label">
                            แผนก <span style={{ color: "red" }}> *</span>
                        </label>
                        <select
                            id="departmentSelect"
                            className="form-select"
                            value={employeeInfo.id_department || ""} // Default to empty if undefined
                            onChange={(e) =>
                                setEmployeeInfo({ ...employeeInfo, id_department: e.target.value })
                            }
                        >

                            <option value="">Open this select menu</option>
                            {department.map((dpt) => (
                                <option key={dpt.id_department} value={dpt.id_department}>
                                    {dpt.name_department}
                                </option>
                            ))}
                        </select>
                        {
                            renderCompanySelection(employeeInfo)
                        }
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="mb-3">
                        <label htmlFor="departmentSelect" className="form-label">
                            สาขา <span style={{ color: "red" }}> *</span>
                        </label>
                        <select
                            id="departmentSelect"
                            className="form-select"
                            value={employeeInfo.id_branch || ""} // Default to empty if undefined
                            onChange={(e) =>
                                setEmployeeInfo({ ...employeeInfo, id_branch: e.target.value })
                            }
                        >
                            <option value="">Open this select menu</option>
                            {branches.map((br) => (
                                <option key={br.id_branch} value={br.id_branch}>
                                    {br.branch_name}
                                </option>
                            ))}
                        </select>
                        {
                            renderCompanySelection(employeeInfo)
                        }
                    </div>
                </div>
            </div>


        </div>
    );
};

export default EmployeeInfoForm;
