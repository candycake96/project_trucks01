import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavbarTruck from '../containers_truck/NavbarTruck';
import SidebarTruck from '../containers_truck/SidebarTruck';

const LayoutTruck = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <NavbarTruck toggleSidebar={toggleSidebar} />

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
          <SidebarTruck isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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

export default LayoutTruck;
