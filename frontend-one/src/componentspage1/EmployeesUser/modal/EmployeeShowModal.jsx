import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ShowDetailEmployee from "./ShowDetailEmployee";
import ShowDetailAddress from "./ShowDetailAddress";
import ShowDetailDriverLicense from "./ShowDetailDriverLicense";
import ShowDetailRoles from "./ShowDetailRoles";
import EditEmployees from "./EditEmployees"; // Un-comment the import
import EditAddress from "./EditAddreass";
import AddDriverLicense from "./AddDriverLicense";
import EditDriverLicense from "./EditDriverLicense";
import EditRol from "./EditRole";
import axios from 'axios';
import ShowDetailFinance from "./ShowDetailFinance";
import { apiUrl } from "../../../config/apiConfig";


const EmployeeShowModal = ({ isOpen, onClose, emp }) => {
  if (!emp) return null;
  const [actionShow, setActiveShow] = useState("employeeInfo");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Modal states
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isEditModalOpenAddress, setEditModalOpenAddress] = useState(false);
  const [isAddDriverLicenseModalOpen, setAddDriverLicenseModalOpen] = useState(false);
  const [isEditDriverLicenseModalOpen, setEditDriverLicenseModalOpen] = useState(false);
  const [isEditRoleModalOpen, setEditRoleModalOpen] = useState(false);

  // State to trigger data refresh (for example: roles update)
  const [updateTrigger, setUpdateTrigger] = useState(false);

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  // Fetch driver licenses function
  const fetchDriverLicenses = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/getdriverlicenses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("Driver Licenses:", response.data);
      // You can update state here to display the licenses
    } catch (error) {
      console.error("Error fetching driver licenses:", error);
    }
  };

  // Handlers for opening Modals
  const handleOpenEditModal = (empData) => {
    setSelectedEmployee(empData);
    setEditModalOpen(true);
  };

  const handleOpenEditModalAddress = (empData) => {
    setSelectedEmployee(empData);
    setEditModalOpenAddress(true);
  };

  const handleOpenAddDriverLicenseModal = (driverData) => {
    setSelectedDriver(driverData);
    setAddDriverLicenseModalOpen(true);
  };

  const handleOpenEditDriverLicenseModal = (driverData) => {
    setSelectedDriver(driverData);
    setEditDriverLicenseModalOpen(true);
  };

  const handleOpenEditRoleModal = (roleData) => {
    setSelectedEmployee(roleData);
    setEditRoleModalOpen(true);
    setUpdateTrigger(!updateTrigger); // Trigger update on role edit
  };

  const handleCloseAllModals = () => {
    setEditModalOpen(false);
    setEditModalOpenAddress(false);
    setAddDriverLicenseModalOpen(false);
    setEditDriverLicenseModalOpen(false);
    setEditRoleModalOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Employee Details"
      style={{
        content: {
          width: "90%",
          maxWidth: "600px",
          height: "80%",
          margin: "auto",
          padding: "0",
          border: "none",
          borderRadius: "0.5rem",
          overflow: "hidden",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999, // ให้ overlay อยู่บนทุกอย่าง
        },
      }}
    >
      <div className="modal-content p-3">
        <div className="d-flex justify-content-end">
          <button onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="row mb-3">
            <div className="fw-bold fs-4 text-center">
              <p>ข้อมูลพนักงาน</p>
            </div>
          </div>
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${actionShow === "employeeInfo" ? "active" : ""}`}
                onClick={() => setActiveShow("employeeInfo")}
              >
                ข้อมูลพนักงาน
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${actionShow === "currentAddress" ? "active" : ""}`}
                onClick={() => setActiveShow("currentAddress")}
              >
                ที่อยู่
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${actionShow === "driverLicenses" ? "active" : ""}`}
                onClick={() => setActiveShow("driverLicenses")}
              >
                ใบขับขี่
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${actionShow === "finance" ? "active" : ""}`}
                onClick={() => setActiveShow("finance")}
              >
                เงินเดือน
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${actionShow === "permissions" ? "active" : ""}`}
                onClick={() => setActiveShow("permissions")}
              >
                สิทธิ์การใช้งาน
              </button>
            </li>
          </ul>

          {actionShow === 'employeeInfo' && (
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <ShowDetailEmployee emp={emp} onEdit={handleOpenEditModal} />
            </div>
          )}

          {actionShow === 'currentAddress' && (
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <ShowDetailAddress emp={emp} onEdit={handleOpenEditModalAddress} />
            </div>
          )}

          {actionShow === 'driverLicenses' && (
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <ShowDetailDriverLicense
                emp={emp}
                onInsert={handleOpenAddDriverLicenseModal}
                onEdit={handleOpenEditDriverLicenseModal}
                fetchDriverLicenses={fetchDriverLicenses} // Pass the function here
              />
            </div>
          )}

          {actionShow === 'permissions' && (
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <ShowDetailRoles 
                emp={emp} 
                onEdit={handleOpenEditRoleModal} 
                onUpdateRoles={updateTrigger}
              />
            </div>
          )}

{actionShow === 'finance' && (
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <ShowDetailFinance emp={emp} onEdit={handleOpenEditModalAddress} />
            </div>
          )}

        </div>
      </div>

      {isEditModalOpen && (
        <EditEmployees isOpen={isEditModalOpen} onClose={handleCloseAllModals} emp={selectedEmployee} />
      )}
      {isEditModalOpenAddress && (
        <EditAddress isOpen={isEditModalOpenAddress} onClose={handleCloseAllModals} row={selectedEmployee} />
      )}
      {isAddDriverLicenseModalOpen && (
        <AddDriverLicense isOpen={isAddDriverLicenseModalOpen} onClose={handleCloseAllModals} emp={selectedDriver}  onSubmit={fetchDriverLicenses} />
      )}
      {isEditDriverLicenseModalOpen && (
        <EditDriverLicense isOpen={isEditDriverLicenseModalOpen} onClose={handleCloseAllModals} rowDriver={selectedDriver} emp={emp} fetchDriverLicenses={fetchDriverLicenses} />
      )}
      {isEditRoleModalOpen && (
        <EditRol isOpen={isEditRoleModalOpen} onClose={handleCloseAllModals} emp={selectedEmployee} />
      )}
    </Modal>
  );
};

export default EmployeeShowModal;
