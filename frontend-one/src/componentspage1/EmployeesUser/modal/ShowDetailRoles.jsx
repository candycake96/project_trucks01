import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import EditPermission from "./EditPermission";

const ShowDetailRoles = ({ onEdit, emp, onUpdateRoles }) => {
  if (!emp) return null;

  const [empRoles, setEmpRoles] = useState([]);
  const id = emp.id_emp;

    // ดึงข้อมูลผู้ใช้จาก localStorage
      const [user, setUser] = useState(null);  //token
      useEffect(() => {
          const userData = localStorage.getItem('user');
          if (userData) {
              setUser(JSON.parse(userData));
          }
      }, []);

    const [isModalEditPermission, setModalEditPermission] = useState(false);
    const [dataModalPermission, setDataModalPermission] = useState(null);
  const handleOpenModalPermission = (data) => {
    setModalEditPermission(true);
    setDataModalPermission(data)
  };
  const handleClossModalEditPermission = () => {
    setModalEditPermission(false);
  };

  // Fetch employee roles when the employee ID changes
  const fetchEmpRoles = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/getemployeeroles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setEmpRoles(response.data);
      if (onUpdateRoles) {
        onUpdateRoles();  // Trigger parent update (if needed)
      }
    } catch (error) {
      console.error("Error fetching employee roles:", error);
    }
  }; 

  useEffect(() => {
    if (id) {
      fetchEmpRoles();
    }
  }, [id]); // Depend on employee ID to fetch roles



  return (
    <div className="p-3">
      {/* Header Section */}
      {user?.permission_codes.includes("EMP_PERMISSION") &&  (
      <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="col-4 fw-bold">สิทธิ์การใช้งาน</div>
        <button
          style={{
            color: "#008000",
            border: "none",
            background: "transparent",
          }}
          onClick={() => onEdit(emp)}
        >
          <i className="bi bi-pencil-square"></i> แก้ไข
        </button>
      </div>

      {/* Role List Section */}
      <div className="mb-3">
        {empRoles.length > 0 ? (
          empRoles.map((role, index) => (
            <div key={index} className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input active"
                id={`role-checkbox-${index}`}
                checked={true} // Checkbox always active
                disabled={true} // Make it read-only
              />
              <label
                htmlFor={`role-checkbox-${index}`}
                className="form-check-label fw-bold text-dark"
              >
                {role.role_name}
              </label>
            </div>
          ))
        ) : (
          <p className="text-muted">No roles assigned to this employee.</p>
        )}
      </div>
      <hr className="mb-3" />
      <div className="mb-3">
        {/* Header Section */}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col-4 fw-bold">สิทธิ์การเข้าถึง</div>
          <button
            style={{
              color: "#008000",
              border: "none",
              background: "transparent",
            }}
            onClick={() => handleOpenModalPermission(emp)}
          >
            <i className="bi bi-pencil-square"></i> แก้ไข
          </button>
        </div>
        
        <div className="">
            
        </div>
      </div>

      </>
   )}   
            {isModalEditPermission && (
              <EditPermission isOpen={isModalEditPermission} onClose={handleClossModalEditPermission} emp={dataModalPermission} user={user}/>
            )}
    </div>
  );
};

export default ShowDetailRoles;
