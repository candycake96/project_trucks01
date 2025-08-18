import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import Modal_UpdateInsurance from "../Vehicle/expanded/modal/Modal_UpdateInsurance";
import { Link } from "react-router-dom";

const CarInsurance_Main = () => {

    const [isDataInsuranceEnd, setDataInsuranceEnd] = useState([]);
    const [searchRegNumber, setSearchRegNumber] = useState(""); // ค่าที่กรอกในช่องค้นหาทะเบียน
    const [searchCarType, setSearchCarType] = useState(""); // ค่าที่กรอกในช่องค้นหาประเภทรถ
    const [searchBranch, setSearchBranch] = useState("");
    const [searchInsuranceType, setSearchInsuranceType] = useState("");
    const [user, setUser] = useState(null);
    const [branches, setBranches] = useState([]);
    const [isCarType, setCarType] = useState([]);


    // const [isOpenModalEditInsurance, setOpenModalEditInsurance] = useState(false);
    // const handleClesModalEditInsurance = () => {
    //     setOpenModalEditInsurance(false);
    // }



    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // ฟังก์ชันโหลดข้อมูลที่กำหนด
    const fetchInsuranceEnd = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/car_insurance_datails_all`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setDataInsuranceEnd(response.data);
        } catch (error) {
            console.error("Error fetching InsuranceEnd:", error);
        }
    }



    // เมื่อเริ่มต้นโหลดข้อมูล
    useEffect(() => {
        fetchInsuranceEnd();
    }, []);

    // ฟังก์ชันค้นหาข้อมูล
    const filteredData = isDataInsuranceEnd.filter(rowA => {
        return (
            (rowA.reg_number.toLowerCase().includes(searchRegNumber.toLowerCase())) &&
            (rowA.car_type_name.toLowerCase().includes(searchCarType.toLowerCase())) &&
            (rowA.branch_name.toLowerCase().includes(searchBranch.toLowerCase())) &&
            (searchInsuranceType === "" || rowA.insurance_type?.toLowerCase().includes(searchInsuranceType.toLowerCase()))



        );
    });



    // ฟังก์ชันแปลงวันที่
    const formatDate = (dateString) => {
        const date = new Date(dateString); // สร้างอ็อบเจกต์ Date จากวันที่ที่ได้รับ
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('th-TH', options); // แสดงผลในรูปแบบวัน เดือน ปี (ภาษาไทย)
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

    // const handleInsuranceType = (e) => {
    //     setSearchInsuranceType(e.target.value);
    // }


    return (
        <>
            <div className="container">
                <div className="p-3">
                    <div className="text-center">
                        <div className="mb-3 d-flex gap-2 btn-sm">
                            <p className="fw-bolder fs-4"> ข้อมูลประกันภัยรถ ทั้งหมด</p>
                            <Link to="/truck/insuranceDataComparison" className="btn btn-primary">ตรวจสอบมูลค่าประกัน</Link>
                        </div>
                        <hr />
                    </div>

                    <div>
                        <div className="mb-3">
                            <div className="row">
                                
                                <div className="col-lg-2">
                                    <label htmlFor="input_insurance_start" className="form-label fw-medium">
                                        ค้าหาข้อมูล<span ></span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        _ value={searchRegNumber}
                                        onChange={(e) => setSearchRegNumber(e.target.value)}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <label htmlFor="input_insurance_start" className="form-label fw-medium">
                                        ประเภทรถ<span ></span>
                                    </label>
                                    <select className="form-select" onChange={handleCarTypeChange}>
                                        <option value="">ทั้งหมด</option>
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
                                    <label htmlFor="input_insurance_start" className="form-label fw-medium">
                                        สาขา<span ></span>
                                    </label>
                                    <select className="form-select" onChange={handleBranchChange}>
                                        <option value="">ทั้งหมด</option>
                                        {branches.map((br) => (
                                            <option key={br.id_branch} value={br.branch_name}>
                                                {br.branch_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-lg-3">
                                    <label htmlFor="input_insurance_start" className="form-label fw-medium">
                                        การคุ้มครอง<span ></span>
                                    </label>
                                    <select className="form-select"
                                        value={searchInsuranceType}
                                        onChange={(e) => setSearchInsuranceType(e.target.value)}
                                    >
                                        <option value="">ทั้งหมด</option>
                                        <option value="vehicle">คุ้มครองรถ</option>
                                        <option value="goods">คุ้มครองสินค้า</option>
                                        <option value="">คุ้มครองผู้ประสบภัยจากรถ</option>
                                    </select>
                                </div>
                                <div className="col-lg-2">
                                    <label htmlFor="input_insurance_start" className="form-label fw-medium">
                                        ประเภทประกัน<span ></span>
                                    </label>
                                    <select className="form-select"
                                        value={searchInsuranceType}
                                        onChange={(e) => setSearchInsuranceType(e.target.value)}
                                    >
                                        <option value="">ทั้งหมด</option>
                                        <option value="vehicle">ชั้น 1 </option>
                                        <option value="goods">ชั้น 2 </option>
                                        <option value="goods">ชั้น 2+ </option>
                                    </select>
                                </div>
                            </div>



                        </div>

                        <div>
                            <table className="table table-hover table-borderless">
                                <thead>
                                    <tr>
                                        <th>ลำดับ</th>
                                        <th>ทะเบียน</th>
                                        <th>ประเภทรถ</th>
                                        <th>วันที่เริ่มต้น</th>
                                        <th>วันที่หมดอายุ</th>
                                        <th>ประเภทประกัน</th>
                                        <th>ชื่อบริษัทประกัน</th>
                                        <th>สถานะ</th>
                                        <th className="">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((rowA, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{rowA.reg_number}</td>
                                                <td>{rowA.car_type_name}</td>
                                                <td>{(formatDate(rowA.insurance_start_date)) || '-'}</td>
                                                <td>{(formatDate(rowA.insurance_end_date)) || '-'}</td>
                                                <td>{rowA.insurance_type === "goods" ? (
                                                    <p className="">ประกันภัยสินค้า</p>
                                                ) : rowA.insurance_type === "vehicle" ? (
                                                    <p className="">ประกันภัยรถ</p>
                                                ) : (
                                                    <p className="">-</p>
                                                )}</td>
                                                <td>{rowA.insurance_company || '-'}</td>
                                                <td>
                                                    {rowA.status === "หมดอายุ" ? (
                                                        <p className="text-danger">{rowA.status}</p>
                                                    ) : rowA.status === "ใกล้หมดอายุ" ? (
                                                        <p className="text-warning">{rowA.status}</p>
                                                    ) : rowA.status === "ปกติ" ? (
                                                        <p className="text-success">{rowA.status}</p>
                                                    ) : (
                                                        <p className="text-danger">ไม่มีข้อมูล</p>
                                                    )}
                                                    
                                                </td>
                                                <td className="d-flex gap-2">
                                                    {/* <button
    className="btn btn-sm btn-warning btn-circle"
    onClick={() => handleOpenModalEditInsurance(rowA)}
    title="Edit"
  >
    <i className="bi bi-pencil-fill"></i>
  </button> */}

                                                    <Link
                                                        to='/truck/Insurance_Details'
                                                        state={rowA}
                                                        className="btn btn-sm btn-danger btn-circle"
                                                        title="Details"
                                                    >
                                                        <i class="bi bi-clipboard2-plus-fill"></i>
                                                    </Link>
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                        <td colSpan="8" className="text-center text-muted">
                                            ไม่มีข้อมูลประกัน
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* {isOpenModalEditInsurance && (
        <Modal_UpdateInsurance isOpen={isOpenModalEditInsurance} onClose={handleClesModalEditInsurance} dataInsurance={dataCMIModal} />
    )} */}

            </div>
        </>
    )
}

export default CarInsurance_Main;