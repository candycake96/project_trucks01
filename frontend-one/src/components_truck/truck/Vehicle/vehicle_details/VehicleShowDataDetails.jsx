import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";


const VehicleShowDataDetails = () => {
    const location = useLocation();
    const VehicleState = location.state || {};
    const [vehicleData, setVehicleData] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchRequestVehicle = async () => {
        try {
            console.log("Fetching vehicle detail from API...");
            const response = await axios.get(
                `${apiUrl}/api/vehicledetailgetid/${VehicleState?.reg_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            console.log("API Response:", response.data);
            setVehicleData(response.data);
        } catch (error) {
            console.error("Error fetching vehicle data:", error);
        }
    };

    useEffect(() => {
        if (VehicleState?.reg_id) {
            fetchRequestVehicle();
        }
    }, [VehicleState?.reg_id]);


    return (
        <div className="p-4 container">
            {/* Vehicle Info Card */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-light fw-bold fs-5">
                    ข้อมูลรถ
                </div>
                <div className="card-body">
                    {vehicleData && vehicleData.length > 0 && vehicleData.map((row, index) => (
                        <div className="row" key={index}>
                            <div className="col-md-4 text-center mb-3">
                                <img
                                    src="https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/market-landing-build-your-volvo-truck-exterior-fh-cgi-1?qlt=82&wid=1440&ts=1706327464444&dpr=off&fit=constrain&fmt=png-alpha"
                                    alt="vehicle"
                                    className="img-fluid rounded shadow-sm"
                                    style={{ maxWidth: "100%" }}
                                />
                            </div>
                            <div className="col-md-8">
                                <h5 className="fw-bold">{row.reg_number}</h5>
                                <p className="text-muted mb-2">ประเภท: {row.car_type_name}</p>
                                <p className="mb-1"><strong>ยี่ห้อ:</strong> {row.car_brand}</p>
                                <p className="mb-1"><strong>เลขตัวถัง:</strong> {row.chassis_number}</p>
                                <p className="mb-1"><strong>เลขเครื่องยนต์:</strong> {row.engine_no}</p>
                                <p className="mb-1"><strong>รุ่น:</strong> {row.model_no}</p>
                                <p className="mb-1">
                                    <strong>เอกสาร:</strong>
                                    {row.file_download ? (
                                    <button
                                        className="btn btn-link text-danger p-0"
                                        onClick={() => window.open(row.file_download, '_blank')}
                                    >
                                        <i className="bi bi-file-earmark-pdf-fill"></i> ข้อมูลเพิ่มเติม
                                    </button>
                                    ) : (
                                        <>
                                        <i className="bi bi-file-earmark-pdf-fill"></i> ข้อมูลเพิ่มเติม
                                        </>                                         
                                    )}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card text-center shadow-sm border-0 bg-light">
                        <div className="card-body">
                            <i className="bi bi-info-circle-fill fs-3 text-primary"></i>
                            <p className="mt-2 mb-0">ข้อมูลรถ</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center shadow-sm border-0 bg-light">
                        <div className="card-body">
                            <i className="bi bi-speedometer2 fs-3 text-success"></i>
                            <p className="mt-2 mb-0">การใช้งาน</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center shadow-sm border-0 bg-light">
                        <div className="card-body">
                            <i className="bi bi-clipboard-check fs-3 text-warning"></i>
                            <p className="mt-2 mb-0">สถานะ</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center shadow-sm border-0 bg-light">
                        <div className="card-body">
                            <i className="bi bi-tools fs-3 text-danger"></i>
                            <p className="mt-2 mb-0">Maintenance</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Maintenance Table */}
            <div className="card shadow-sm">
                <div className="card-header bg-light fw-bold">ประวัติการซ่อม / บำรุงรักษา</div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm" placeholder="ค้นหา..." />
                                <button className="btn btn-outline-secondary btn-sm">ค้นหา</button>
                            </div>
                        </div>
                    </div>

                    <table className="table table-striped table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>No.</th>
                                <th>วันที่</th>
                                <th>ประเภท (PM/CM)</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>000001</td>
                                <td>2025-07-01</td>
                                <td>PM</td>
                                <td><span className="badge bg-success">เสร็จแล้ว</span></td>
                            </tr>
                            <tr>
                                <td>000002</td>
                                <td>2025-07-20</td>
                                <td>CM</td>
                                <td><span className="badge bg-warning text-dark">กำลังดำเนินการ</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VehicleShowDataDetails;
