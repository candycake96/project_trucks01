import React from "react";
import { Link } from "react-router-dom";
// import './Navbar.css'
import imgLogo from '../components/images/logo/icon-09.png';

const Navbar = ({ toggleSidebar }) => {
  return (
    // <nav className="navbar navbar-container navbar-expand-lg navbar-light bg-light " >
    <nav className="navbar navbar-expand-lg" style={{ background: "#243865" }}>
      <div className="container-fluid">
        <div className="d-flex align-items-center">

          <Link to="/">
            <img
              src={imgLogo}
              alt="logo"
              width="100"
              className="d-inline-block align-text-top"
            />
          </Link>
        </div>

        <div className="d-flex">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link active "
                aria-current="page"
                style={{ color: "#ffffff" }}
              >
                หน้าแรก
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className="nav-link"
                style={{ color: "#ffffff" }}
              >
                เกี่ยวกับ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/newspage"
                className="nav-link"
                style={{ color: "#ffffff" }}
              >
                ข่าวสารและกิจกรรม
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/policy"
                className="nav-link"
                style={{ color: "#ffffff" }}
              >
                นโยบายบริษัท
              </Link>
            </li>
          </ul>

          <div className="me-2">
            <a
              href="https://www.facebook.com/share/H5h7Yx72UEUUX2Ms/?mibextid=qi2Omg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-facebook" style={{ color: "#ffffff" }}></i>
            </a>
          </div>
          <div className="me-2">
            <a
              href="https://www.instagram.com/ncl_logistic_official?igsh=MWo3OGJjOGwyangxZQ=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-instagram" style={{ color: "#ffffff" }}></i>
            </a>
          </div>
          <div className="me-2" style={{ color: "#ffffff" }}>
            <a
              href="https://nclthailand.com/"
              target="_blank"
              rel="noopener noreferrer"
              type="button"
            >
              <i className="bi bi-globe"></i>
            </a>
          </div>
          <div className="me-2">
            <Link
              to="/logintruck"
              className="fw-bold"
              style={{ color: "#ffffff" }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ toggleSidebar }) => {
//   const [isScrolled, setIsScrolled] = useState(false);

//   // ฟังก์ชันตรวจสอบตำแหน่งการเลื่อน
//   const handleScroll = () => {
//     if (window.scrollY > 50) { // ปรับค่าตามที่ต้องการ
//       setIsScrolled(true);
//     } else {
//       setIsScrolled(false);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   return (
//     <>
//       <style>
//         {`
//           .navbar {
//             transition: background-color 0.3s ease, opacity 0.3s ease; /* ทำให้การเปลี่ยนแปลงนุ่มนวล */
//           }
//           .bg-transparent {
//             background-color: transparent !important; /* แถบเมนูโปร่งใส */
//           }
//           .bg-light {
//             background-color: rgba(255, 255, 255, 0.9) !important; /* แถบเมนูสีขาวโปร่งใส */
//           }
//         `}
//       </style>
//       <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'bg-light' : 'bg-transparent'}`}>
//         <div className="container-fluid">
//           <a onClick={toggleSidebar} type="button" className="me-2" style={{ color: '#000099' }}>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               className="inline-block h-5 w-5 stroke-current"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 6h16M4 12h16M4 18h16"
//               ></path>
//             </svg>
//           </a>
//           <Link to="/loginpage" className="navbar-brand fw-bold" style={{ color: '#000099' }}>
//             NCL Thailand
//           </Link>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;
