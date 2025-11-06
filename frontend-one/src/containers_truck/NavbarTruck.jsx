import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeShowModal from '../componentspage1/EmployeesUser/modal/EmployeeShowModal';
import Modal_Edit_Password from '../componentspage1/EmployeesUser/modal/Modal_Edit_Password';
import Modal_signature_emp from '../componentspage1/EmployeesUser/signature/Modal_signature_emp';
import { apiUrl } from '../config/apiConfig';
import './NavbarTruck.css';

const NavbarPage1 = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  // User State
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [userProfile, setUserProfile] = useState(null);

  // Modal State
  const [modalType, setModalType] = useState(null); // 'profile' | 'password' | 'signature' | null
  const [modalData, setModalData] = useState(null);

  // Notification Example (สามารถดึงจาก API)
  const [notifications, setNotifications] = useState([]);

  // Redirect ถ้า user ไม่มี
  useEffect(() => {
    if (!user) {
      localStorage.setItem('redirectUrl', window.location.pathname);
      navigate('/logintruck');
    }
  }, [navigate, user]);

  // Redirect หลัง login
  useEffect(() => {
    if (user) {
      const redirectUrl = localStorage.getItem('redirectUrl');
      if (redirectUrl) {
        localStorage.removeItem('redirectUrl');
        navigate(redirectUrl);
      }
    }
  }, [navigate, user]);

  // Logout
  const handleLogout = () => {
    localStorage.setItem('redirectUrl', window.location.pathname);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/logintruck');
  };

  // Fetch User Profile
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
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Modal Handlers
  const openModal = (type, data) => {
    setModalType(type);
    setModalData(data);
  };
  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  // Loading
  if (!user || !userProfile) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const profile = Array.isArray(userProfile) && userProfile.length > 0
    ? userProfile[0]
    : null;

  return (
    <>
    <nav className="navbar navbar-container navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    {/* Sidebar Toggle */}
    <button onClick={toggleSidebar} className="btn btn-outline-secondary me-2">
      <i className="bi bi-list"></i>
    </button>

    {/* ชิดขวาทั้ง Notification + User */}
    <div className="d-flex align-items-center ms-auto">
      
      {/* Notification อยู่ขวาชิดกับ User */}
      <button className="navbar-brand custom-navbar-brand fw-bolder">
        <i className="bi bi-bell"></i>
        {notifications.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {notifications.length}
          </span>
        )}
      </button>

      {/* User Dropdown */}
      <div className="dropdown">
        <button
          className="navbar-brand custom-navbar-brand fw-bolder"
          type="button"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >          
          <i className="bi bi-person-fill ms-2"></i>
          {profile ? `${profile.fname} ${profile.lname}` : 'Loading...'}
        </button>

        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown" style={{ minWidth: "320px" }}>
          <li>
            <button className="dropdown-item-navbar w-100" onClick={() => openModal('profile', user)}>
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
                  border: "2px solid #007bff",
                  transition: "transform 0.3s ease, border-color 0.3s ease",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.borderColor = "#0056b3";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.borderColor = "#007bff";
                }}
              />
              <div className="fw-bold">{profile ? `${profile.fname} ${profile.lname}` : 'Loading...'}</div>
            </button>
          </li>
          <hr />
          <li>
            <button className="dropdown-item" onClick={() => openModal('password', user)}>
              <i className="bi bi-incognito me-2"></i> เปลี่ยนรหัสผ่าน
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => openModal('profile', user)}>
              <i className="bi bi-person-circle me-2"></i> การตั้งค่าบัญชีผู้ใช้
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => openModal('signature', user)}>
              <i className="bi bi-feather me-2"></i> ตั้งค่าลายมือชื่อผู้ใช้
            </button>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item text-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i> ออกจากระบบ
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>


      {/* Modals */}
      {modalType === 'profile' && <EmployeeShowModal isOpen={true} onClose={closeModal} emp={modalData} />}
      {modalType === 'password' && <Modal_Edit_Password isOpen={true} onClose={closeModal} onData={modalData} />}
      {modalType === 'signature' && <Modal_signature_emp isOpen={true} onClose={closeModal} onData={modalData} />}
    </>
  );
};

export default NavbarPage1;
