import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeShowModal from '../componentspage1/EmployeesUser/modal/EmployeeShowModal';
import './NavbarTruck.css';
import Modal_Edit_Password from '../componentspage1/EmployeesUser/modal/Modal_Edit_Password';
import { apiUrl } from '../config/apiConfig';
import axios from 'axios';
import Modal_signature_emp from '../componentspage1/EmployeesUser/signature/Modal_signature_emp';


const NavbarPage1 = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [isUserProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('redirectUrl', window.location.pathname);
      navigate('/logintruck');
    }
  }, [navigate, user]);

  useEffect(() => {
    const redirectUrl = localStorage.getItem('redirectUrl');
    if (redirectUrl) {
      localStorage.removeItem('redirectUrl');
      navigate(redirectUrl);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.setItem('redirectUrl', window.location.pathname);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/logintruck');
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleOpenModal = (modalEmployee) => {
    if (isModalOpenEditPassword) {
      handleCloseModalEditPassword(); // Close the other modal first
    }
    setIsModalOpen(true);
    setSelectedEmployee(modalEmployee);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  // Modal Password
  const [isModalOpenEditPassword, setModalOpenEditPassword] = useState(false);
  const [isDataModalEditPassword, setDataModalEditPassword] = useState(null);
  const handleOpenModalEditPassword = (data) => {
    if (isModalOpen) {
      handleCloseModal(); // Close the other modal first
    }
    setModalOpenEditPassword(true);
    setDataModalEditPassword(data);
  };
  const handleCloseModalEditPassword = () => {
    setModalOpenEditPassword(false);
    setDataModalEditPassword(null);
  };

// Modal signature
  const [isOpenModalSignature, setOpenModalSignature] = useState(false);
  const [isDataOpenModalSignature, setDataOpenModalSignature] = useState(null);
  const handleOpenModalSignature = (data) => {
    setOpenModalSignature(true);
    setDataOpenModalSignature(data)
  }
    const handleCloseModalSignature = () => {
    setOpenModalSignature(false);
    setDataOpenModalSignature(null)
  }

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/getemployeesshowid/${user.id_emp}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("Fetched user profile:", response.data);  // ตรวจสอบข้อมูลที่ดึงมา
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  useEffect(() => {
    console.log("User from localStorage", user);  // ตรวจสอบ user
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    console.log("isUserProfile", isUserProfile);  // ตรวจสอบค่าของ isUserProfile
  }, [isUserProfile]);

  const profile = Array.isArray(isUserProfile) && isUserProfile.length > 0
    ? isUserProfile[0]
    : null;


  if (!user || !isUserProfile) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar navbar-container navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          {/* Sidebar Toggle */}
          <button onClick={toggleSidebar} className="btn btn-outline-secondary me-2">
            <i className="bi bi-list"></i>
          </button>

          {/* User Dropdown */}
          <div className="dropdown ms-auto">
            <button
              className="navbar-brand custom-navbar-brand fw-bolder"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {/* Conditional rendering for profile name */}
              {profile ? (
                <span>{`${profile.fname} ${profile.lname}`}</span>
              ) : (
                <span>Loading...</span>
              )}


              <i className="bi bi-person-fill"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end " aria-labelledby="userDropdown" style={{ minWidth: "320px" }}>
              <li key="profile">
                <button className="dropdown-item-navbar w-100" onClick={() => handleOpenModal(user)}>
                  <img
                    src={
                      profile && profile.image
                        ? profile.image
                        : 'https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg'
                    }
                    alt="Profile"
                    className="rounded-circle mb-2 shadow-sm"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      border: "2px solid #007bff", // กำหนดเส้นขอบสีฟ้า
                      transition: "transform 0.3s ease, border-color 0.3s ease",
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = "scale(1.1)";
                      e.currentTarget.style.borderColor = "#0056b3"; // เปลี่ยนสี border เมื่อ hover
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.borderColor = "#007bff";
                    }}
                  />


                  <div className="fw-bold"> {profile ? (
                    <span>{`${profile.fname} ${profile.lname}`}</span>
                  ) : (
                    <span>Loading...</span>
                  )}</div>
                </button>
              </li>
              <hr />
              <li key="passwordChange">
                <button className="dropdown-item" onClick={() => handleOpenModalEditPassword(user)}>
                  <i className="bi bi-incognito me-2"></i> เปลี่ยนรหัสผ่าน
                </button>
              </li>
              <li key="accountSettings">
                <button className="dropdown-item" onClick={() => handleOpenModal(user)}>
                  <i className="bi bi-person-circle me-2"></i> การตั้งค่าบัญชีผู้ใช้
                </button>
              </li>
              <li key="passwordChange">
                <button className="dropdown-item" onClick={() => handleOpenModalSignature(user)}>
                  <i class="bi bi-feather"></i> ตั้งค่าลายมือชื่อผู้ใช้
                </button>
              </li>
              <li key="divider" ><hr className="dropdown-divider" /></li>
              <li key="logout">
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> ออกจากระบบ
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Employee Modal */}
      {isModalOpen && (
        <EmployeeShowModal isOpen={isModalOpen} onClose={handleCloseModal} emp={selectedEmployee} />
      )}

      {isModalOpenEditPassword && (
        <Modal_Edit_Password key={isModalOpenEditPassword ? "open" : "closed"} isOpen={isModalOpenEditPassword} onClose={handleCloseModalEditPassword} onData={isDataModalEditPassword} />
      )}

      {isOpenModalSignature && (
        <Modal_signature_emp isOpen={isOpenModalSignature} onClose={handleCloseModalSignature} onData={isDataOpenModalSignature}  />
      )}

    </>
  );
};

export default NavbarPage1;

