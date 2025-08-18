import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../config/apiConfig";

const EmployeePermissionForm = ({ roles, setRoles, permissionCode, setPermissionCode }) => {
  const [showRoles, setShowRoles] = useState([]);
  const [permissionAccess, setPermissionAccess] = useState([]);
  const [submenuData, setSubmenueData] = useState([]);
  const [moduleData, setModuleData] = useState([]);

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




  // 


  // Fetch roles from the API
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getroles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setShowRoles(response.data); // Set the fetched roles
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
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

  useEffect(() => {
    fetchRoles();
    fetchPermissionAccess()
    fetchPermissionModule()
    fetchPermissionSudMenue()
  }, []);

  
  // Handle checkbox change
  const handleCheckboxChange = (roleId) => {
    // Check if the role is already selected
    if (roles.includes(roleId)) {
      // If selected, remove it from the array
      setRoles(roles.filter((id) => id !== roleId)); // ลบออกเมื่อ uncheck
    } else {
      // If not selected, add it to the array
      setRoles([...roles, roleId]); // เพิ่มเข้าเมื่อ check
    }
  };

  return (
    <div>
      <div className="mb-3">
        <p>สิทธิ์การใช้งาน</p>
      </div>

      <div className="mb-3">
        {showRoles.map((data) => (
          <div key={data.role_id} className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              value={data.role_id} // Set value as role_id
              onChange={() => handleCheckboxChange(data.role_id)} // Trigger the change handler
              checked={roles.includes(data.role_id)} // Mark checkbox as checked if role_id exists in roles
            />
            <label htmlFor={`checkbox-${data.role_id}`} className="form-check-label">
              {data.role_name}
            </label>
          </div>
        ))}
      </div>

      <hr className="mb-3" />
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


        </div>

      </div>

      <hr className="mb-3" />
      <div className="">
        <div className="mb-3">
          <p>สิทธิ์ในการอนุมัติ</p>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col-lg-3">
              <div className="form-check form-check-inline">
                <input type="checkbox" name="" id="" className="form-check-input" />
                <label htmlFor="checkbox" className="form-check-label">อนุมัติลางาน</label>
              </div>
              <div className="form-check form-check-inline">
                <input type="checkbox" name="" id="" className="form-check-input" />
                <label htmlFor="checkbox" className="form-check-label">อนุมัติซ่อมรถ 1</label>
              </div>
              <div className="form-check form-check-inline">
                <input type="checkbox" name="" id="" className="form-check-input" />
                <label htmlFor="checkbox" className="form-check-label">อนุมัติซ่อมรถ 2 </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePermissionForm;
