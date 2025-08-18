import React from "react";
import { Link } from "react-router-dom";

const NavMainternanceJob = ({ fromPage }) => {
    return (
        <>
            <nav aria-label="breadcrumb" style={{ color: '#0000FF' }}>
                <div className="d-flex justify-content-between align-items-center small">
                    <ol className="breadcrumb mb-0 d-flex align-items-center" style={{ gap: '0.5rem' }}>
                        <li className="breadcrumb-item">
                            <Link to="/truck/MaintenanceRequest">
                                <i className="bi bi-arrow-left"></i>
                            </Link>
                        </li>
                        <i className="bi bi-chevron-right"></i>
                        {fromPage === "Analysis" ? (
                            <>
                                <li className="breadcrumb-item">
                                    <Link to="/truck/MainternanceAnalysisRequestJob"> วิเคราะห์แผนกซ่อมบำรุง </Link>
                                </li>
                                <i className="bi bi-chevron-right"></i>
                            </>
                        ) : fromPage === "MainternanceRequest" ? (
                            <>
                                <li>
                                    <Link to="/truck/MaintenanceRequest"> รายการแจ้งซ่อมเกี่ยวกับบำรุงรักษา </Link>
                                </li>
                                <i className="bi bi-chevron-right"></i>
                            </>
                        ) : fromPage === "MaintenancPlanning" ? (
                            <>
                             <li>
                                    <Link to="/truck/MaintenancPlanning"> ตรวจสอบความพร้อม </Link>
                                </li>
                                <i className="bi bi-chevron-right"></i>
                            </>
                        ) : (
                            <>
                            </>
                        )}


                        <li className="breadcrumb-item active" aria-current="page">
                            รายละเอียดการซ่อม
                        </li>

                    </ol>
                </div>
            </nav>
        </>
    );
}
export default NavMainternanceJob;
