import axios from "axios";
import React, { useEffect, useState } from "react";

import ReactModal from "react-modal";
import { apiUrl } from "../../../config/apiConfig";


const EditPermission = ({ isOpen, onClose, emp, user }) => {

    const [permissionAccess, setPermissionAccess] = useState([]);
    const [submenuData, setSubmenueData] = useState([]);
    const [moduleData, setModuleData] = useState([]);
    const [empPermissionAccess, setEmpPermissionAccess] = useState([]);
    const [permissionCode, setPermissionCode] = useState([]);


    const handleCheckboxChangePermissions = (functionId) => {
        setPermissionCode(prev => {
            if (prev.includes(functionId)) {
                return prev.filter(id => id !== functionId); // ลบออกถ้าเคยเลือกแล้ว
            } else {
                return [...prev, functionId]; // เพิ่มถ้ายังไม่เคยเลือก
            }
        });
    };

    const handleSelectAll = () => {
        const allFunctionIds = permissionAccess.map(fn => fn.function_code);
        setPermissionCode(allFunctionIds);
    };

    const handleClearAll = () => {
        setPermissionCode([]);
    };



    const fetchPermissionAccess = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/permissions/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setPermissionAccess(response.data); // Set the fetched roles
        } catch (error) {
            console.error("Error fetching Permission Access:", error);
        }
    };


    const fetchPermissionModule = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/module/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setModuleData(response.data); // Set the fetched roles
        } catch (error) {
            console.error("Error fetching Permission Access:", error);
        }
    };

    const fetchPermissionSudMenue = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/submenus/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setSubmenueData(response.data); // Set the fetched roles
        } catch (error) {
            console.error("Error fetching Permission Access:", error);
        }
    };

    const fetchEmployeesPermissionAccess = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/employee_permission_access/all/${emp?.id_emp}`, {
              headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setEmpPermissionAccess(response.data); // เก็บข้อมูลทั้งหมด
            const permissionCodes = response.data.map(item => item.permission_code); // สมมุติว่าเป็น field นี้
            setPermissionCode(permissionCodes); // ตั้งค่าล่วงหน้า
        } catch (error) {
            console.error("Error fetching Employee Permission Access:", error);
        }
    };


    useEffect(() => {

        fetchPermissionAccess();
        fetchPermissionModule();
        fetchPermissionSudMenue();
        fetchEmployeesPermissionAccess();
    }, []);


const handleSubmit = async () => {
    try {
        const token = localStorage.getItem("accessToken");

        const payload = {
            permission_codes: permissionCode, // สมมุติว่า permissionCode เป็น array เช่น ['VIEW', 'EDIT']
        };

        console.log("test payload: ", payload);

        await axios.post(
            `${apiUrl}/api/permission_access_deit/${emp?.id_emp}`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json", // สำคัญ: ใช้ JSON
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        alert("บันทึกสิทธิ์การเข้าถึงเรียบร้อยแล้ว");
        onClose(); // ปิด modal
    } catch (error) {
        console.error("Error saving permission access:", error);
        alert("เกิดข้อผิดพลาดขณะบันทึกสิทธิ์การเข้าถึง");
    }
};



    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Edit Employee Roles"
            style={{
                content: {
                    width: "90%",
                    maxWidth: "800px",
                    height: "80%",
                    margin: "auto",
                    padding: "2rem",
                    border: "none",
                    borderRadius: "0.5rem",
                    overflowY: "auto",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                },
            }}

        >
            <div className="">
                <div className="mb-2">
                    <p className="fw-bolder">
                        แก้ไขสิทธิ์การเข้าถึง 
                    </p>
                </div>
            </div>

            <div className="mb-3">
                <p>สิทธิ์การเข้าถึง</p>
                <div className="mb-2">
                    <button type="button" className="btn btn-sm btn-success me-2" onClick={handleSelectAll}>
                        เลือกทั้งหมด
                    </button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={handleClearAll}>
                        ล้างทั้งหมด
                    </button>
                    <p className="mt-2 text-success">เลือกแล้ว: {permissionCode.length} รายการ</p>
                </div>


            </div>

            <div className="mb-3">
                <div className="container">

                    {moduleData
                        .map(mainPerm => (
                            <div className="mb-3 " key={mainPerm.module_id}>
                                <div className="form-check">
                                    <label className="form-check-label text-primary ">
                                        {mainPerm.name}
                                    </label>
                                </div>

                                {/* Menu Functions under Module */}

                                <div className="row">
                                    {submenuData
                                        .filter((section) => section.module_id === mainPerm.module_id) // <-- ใช้ module_id ที่เชื่อมโยง
                                        .map((sub) => (
                                            <div className="col-md-4 mb-2" key={sub.menu_id}>
                                                <p className="fw-bolder text-denger"><i class="bi bi-asterisk"></i> {sub.name} <strong>

                                                    {/* ✅ Checkbox เลือกทั้งหมดเฉพาะกลุ่มนี้ */}
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`select-all-${sub.menu_id}`}
                                                        checked={
                                                            permissionAccess.filter(p => p.menu_id === sub.menu_id)
                                                                .every(fn => permissionCode.includes(fn.function_code))
                                                        }
                                                        onChange={(e) => {
                                                            const groupFns = permissionAccess.filter(p => p.menu_id === sub.menu_id).map(p => p.function_code);
                                                            if (e.target.checked) {
                                                                // เพิ่มเฉพาะ function_id ที่ยังไม่มีใน permissionCode
                                                                setPermissionCode(prev => [...new Set([...prev, ...groupFns])]);
                                                            } else {
                                                                // ลบ function_id ของกลุ่มนี้ออกจาก permissionCode
                                                                setPermissionCode(prev => prev.filter(id => !groupFns.includes(id)));
                                                            }
                                                        }}
                                                    />

                                                </strong>
                                                </p>

                                                <div className="">
                                                    {permissionAccess
                                                        .filter((child) => child.menu_id === sub.menu_id) // <-- ใช้ module_id ที่เชื่อมโยง
                                                        .map((fn) => (
                                                            <div className="form-check " key={fn.function_code}>
                                                                <input
                                                                    type="checkbox"
                                                                    id={`checkbox-${fn.function_code}`}
                                                                    className="form-check-input"
                                                                    value={fn.function_code} // Set value as _code
                                                                    checked={permissionCode.includes(fn.function_code)}
                                                                  onChange={() => handleCheckboxChangePermissions(fn.function_code)}
                                                                />
                                                                <label htmlFor={`checkbox-${fn.function_code}`} className="form-check-label">
                                                                    {fn.function_name}
                                                                </label>
                                                                <div className="">
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
<div className="d-flex justify-content-end mt-4">
    <button className="btn btn-secondary me-2" onClick={onClose}>
        ยกเลิก
    </button>
    <button className="btn btn-primary" onClick={handleSubmit}>
        บันทึก
    </button>
</div>


                </div>

            </div>

        </ReactModal>
    )
}

export default EditPermission;