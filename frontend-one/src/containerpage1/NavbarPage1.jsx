import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavbarPage1 = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/loginpage');
    }

    // เปิดใช้งาน Bootstrap Tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/loginpage');
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <nav className="navbar navbar-container navbar-expand-lg navbar-light bg-light ">
      <div className="container-fluid">
        <button onClick={toggleSidebar} className="btn btn-outline-secondary me-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div className="d-flex">
          <Link to="/page1" className="navbar-brand">
            {user.fname} {user.lname} <i className="bi bi-person-fill"></i>
          </Link>
          <button
            type="button"
            className="navbar-brand"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Logout"
            onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPage1;
