import axios from "axios";
import React, { useEffect, useState } from "react";
import ShowVhicleDetailsExpanded from "./expanded/ShowVhicleDetailsExpanded";
import { Link } from "react-router-dom";
import { apiUrl } from "../../../config/apiConfig";

const VehicleTable = () => {
    const [isVehicleDetails, setVehicleDetails] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [branches, setBranches] = useState([]);
    const [isCarType, setCarType] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBranch, setSearchBranch] = useState("");
    const [searchCarType, setSearchCarType] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const fetchVehicleTable = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/vehicleget`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setVehicleDetails(response.data);
        } catch (error) {
            console.error("Error fetching vehicle data:", error);
        }
    };

    useEffect(() => {
        fetchVehicleTable();
    }, []);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const fetchBranches = async () => {
        if (!user) return;

        try {
            const response = await axios.get(
                `${apiUrl}/api/getbranches/${user.company_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setBranches(response.data);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, [user]);

    const fetchCarType = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No access token found");
                return;
            }

            const response = await axios.get(`${apiUrl}/api/detailscartype`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCarType(response.data);
        } catch (error) {
            console.error("Error fetching detailscartype:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status);
                console.error("Response Data:", error.response.data);
            }
        }
    };

    useEffect(() => {
        fetchCarType();
    }, []);

    const handleBranchChange = (e) => {
        setSearchBranch(e.target.value);
    };

    const handleCarTypeChange = (e) => {
        setSearchCarType(e.target.value);
    };

    const filteredVehicleData = isVehicleDetails.filter((dataRow) => {
        const reg_Number = dataRow.reg_number.toLowerCase();
        const branchName = dataRow.branch_name.toLowerCase();
        const carType = dataRow.car_type_name.toLowerCase();

        return (
            reg_Number.includes(searchTerm.toLowerCase()) &&
            branchName.includes(searchBranch.toLowerCase()) &&
            carType.includes(searchCarType.toLowerCase())
        );
    });

    return (
        <>
            <div className="p-3">
                <div className="row d-flex align-items-center gap-2">
                    <div className="col-lg-3">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ค้นหาทะเบียนรถ"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-outline-secondary" type="button">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className="col-lg-2">
                        <select className="form-select" onChange={handleCarTypeChange}>
                            <option value="">เลือกหมวดหมู่รถ</option>
                            {isCarType.length > 0 ? (
                                isCarType.map((rowCarType) => (
                                    <option key={rowCarType.car_type_id} value={rowCarType.car_type_name}>
                                        {rowCarType.car_type_name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>กำลังโหลด...</option>
                            )}
                        </select>
                    </div>

                    <div className="col-lg-3">
                        <select className="form-select" onChange={handleBranchChange}>
                            <option value="">เลือกสาขา</option>
                            {branches.map((br) => (
                                <option key={br.id_branch} value={br.branch_name}>
                                    {br.branch_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-lg-3">
                        <Link to="/truck/vehicleaddform" className="btn btn-primary w-100">
                            <i className="bi bi-truck-front-fill"></i> เพิ่มข้อมูลรถ
                        </Link>
                    </div>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>ทะเบียนรถ</th>
                        <th>ยี่ห้อรถ</th>
                        <th>รุ่นรถ</th>
                        <th>ประเภทรถ</th>
                        <th>สถานะ</th>
                        <th>สาขา</th>
                        {/* <th>พขร.ขับล่าสุด</th> */}
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVehicleData.map((rowVD, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td className="col-lg-1">{index + 1}</td>
                                <td className="col-1">{rowVD.reg_number}</td>
                                <td>{rowVD.car_brand}</td>
                                <td>{rowVD.model_no}</td>
                                <td>{rowVD.car_type_name}</td>
                                <td className="col-1">{rowVD.status}</td>
                                <td>{rowVD.branch_name}</td>
                                {/* <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                    <span style={{ color: "Green", fontSize: "2rem", marginRight: "8px" }}>•</span>
                                    xxxxx
                                </td> */}
                                <td className="col-lg-2 ">
                                    <Link 
                                    to={`/truck/VehicleShowDataDetails`}
                                    state={rowVD}
                                    className="btn btn-primary me-1"
                                    >
                                       <i class="bi bi-car-front-fill"></i> 
                                    </Link>
                                    <button
                                        className="btn btn-primary"
                                        // style={{ color: '#2980b9' }}
                                        onClick={() => toggleRow(rowVD.reg_id)}
                                    >
                                        {expandedRow === rowVD.reg_id ? (
                                            <i className="bi bi-chevron-up"></i>
                                        ) : (
                                            <i className="bi bi-chevron-down"></i>
                                        )}
                                    </button>
                                </td>
                            </tr>

                            {expandedRow === rowVD.reg_id && (
                                <tr>
                                    <td colSpan="12">
                                        <ShowVhicleDetailsExpanded dataVehicle={rowVD} />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default VehicleTable;
