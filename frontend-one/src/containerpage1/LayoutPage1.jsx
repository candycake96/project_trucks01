import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../containerpage1/NavbarPage1';
import Sidebar from '../containerpage1/SidebarPage1';
import NavbarPage1 from '../containerpage1/NavbarPage1';
import SidebarPage1 from '../containerpage1/SidebarPage1';

const LayoutPage1 = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <NavbarPage1 toggleSidebar={toggleSidebar} />

      <div className="d-flex flex-row">
        {/* Sidebar */}
        <div
          className={`bg-light sidebar ${isSidebarOpen ? 'd-block' : 'd-none d-md-block'}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            zIndex: 1050,
            transition: 'transform 0.3s ease',
            transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            width: '240px',
            overflowY: 'auto'
          }}
        >
          <SidebarPage1 isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div
          className="flex-grow-1 ms-md-240"
          style={{
            marginLeft: isSidebarOpen ? '240px' : '0px',
            transition: 'margin-left 0.3s ease'
          }}
        >
          <main className="p-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default LayoutPage1;
