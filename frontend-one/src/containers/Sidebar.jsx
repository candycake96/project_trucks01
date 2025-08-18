import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <div
      className={`d-flex flex-column p-3 bg-light position-fixed ${
        isSidebarOpen ? "w-64" : "w-0"
      } overflow-hidden`}
      style={{ height: "100%", zIndex: 1050, transition: "width 0.3s" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="navbar-brand text-decoration-none fw-bold fs-4" style={{color: '#000099	'}}>
          NCL Thailand
        </Link>
        <button onClick={toggleSidebar} className="btn btn-link fw-bold">
        {/* <i class="bi bi-x-lg"></i> */}
           <i className="bi bi-chevron-double-left"></i>
        </button>
      </div>
      <hr />
      <ul className="nav flex-column mb-auto">
        <li className="nav-item">
          <Link
            to="/"
            className="nav-link text-dark hover:text-primary"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              transition: "background-color 0.3s, color 0.3s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
              e.currentTarget.style.color = "#007bff"; // Change text color on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#343a40"; // Reset text color
            }}
          >
            {/* <i class="bi bi-house"> </i> */}
            หน้าแรก
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/about"
            className="nav-link text-dark hover:text-primary"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              transition: "background-color 0.3s, color 0.3s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
              e.currentTarget.style.color = "#007bff"; // Change text color on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#343a40"; // Reset text color
            }}
          >
            เกียวกับ
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/newspage"
            className="nav-link text-dark hover:text-primary"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              transition: "background-color 0.3s, color 0.3s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
              e.currentTarget.style.color = "#007bff"; // Change text color on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#343a40"; // Reset text color
            }}
          >
           ข่าวสารและกิจกรรม
          </Link>
        </li>
        <li className="nav-item">
          <a
            onClick={toggleDropdown}
            className="nav-link text-dark hover:text-primary d-flex justify-content-between align-items-center"
            style={{
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
              e.currentTarget.style.color = "#007bff"; // Change text color on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#343a40"; // Reset text color
            }}
          >
            สำหรับพนักงาน
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className={`bi ${
                  isDropdownOpen ? "bi-chevron-up" : "bi-chevron-down"
                }`}
                viewBox="0 0 16 16"
              >
                <path d="M3.5 10.5a.5.5 0 0 1 .75.5h8a.5.5 0 0 1 .75-.5L8 6.5 3.5 10.5z" />
              </svg>
            </span>
          </a>
          {isDropdownOpen && (
            <ul className="list-unstyled ps-4">
              <li>
                <Link
                  to="/calendar"
                  className="nav-link text-dark hover:text-primary"
                >
                  ปฏิทินบริษัท
                </Link>
              </li>
              <li>
                <Link
                  to="http://nclth.fortiddns.com:8871/app_emp_2PHP/login.php"
                  className="nav-link text-dark hover:text-primary"
                >
                  ลางานออนไลน์
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/employee/option3"
                  className="nav-link text-dark hover:text-primary"
                >
                  ฟอร์มจัดเก็บสัญญา
                </Link>
              </li>
              <li>
                <Link
                  to="/employee/option4"
                  className="nav-link text-dark hover:text-primary"
                >
                  เก็บชั่วโมงการฝึกอบรม
                </Link>
              </li> */}
            </ul>
          )}
        </li>
        <li className="nav-item">
        <a
  href="https://sites.google.com/nclthailand.net/ncl-internal-site/company-policy"
  className="nav-link text-dark hover:text-primary"
  style={{
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    transition: "background-color 0.3s, color 0.3s",
    textDecoration: "none",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#f0f0f0";
    e.currentTarget.style.color = "#007bff"; // Change text color on hover
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "#343a40"; // Reset text color
  }}
  target="_blank" // This will open the link in a new tab
  rel="noopener noreferrer" // Recommended for security reasons when using target="_blank"
>
  นโยบายบริษัท
</a>

        </li>
        <li className="nav-item">
          <Link
            to="/contacts"
            className="nav-link text-dark hover:text-primary"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              transition: "background-color 0.3s, color 0.3s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
              e.currentTarget.style.color = "#007bff"; // Change text color on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#343a40"; // Reset text color
            }}
          >
            เบอร์โทรภายใน
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
