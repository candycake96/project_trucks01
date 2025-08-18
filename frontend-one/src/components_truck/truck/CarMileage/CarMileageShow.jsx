import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal_Edit_MIleage from "./Modal/Modal_Edit_Mileage";
import Modal_Add_Mileage from "./Modal/Modal_Add_Milaege";
import ReactPaginate from "react-paginate";
import "./CarMileageShow.css";
import Modal_Import_Excel from "./Modal/Modal_Import_Excel";
import { apiUrl } from "../../../config/apiConfig";


const CarMileageShow = () => {
    // Modal
    const [isMileageData, setMileageData] = useState([]);
    const [isOpenModalEditMileage, setOpenModalEditMileage] = useState(false);
    const [isOpenModalAddMileage, setOpenModalAddMileage] = useState(false);
    const [isDataMileageAdd, setDataMileageAdd] = useState(null);
    const [isOpenModalImportExcel, estOpenModalImportExcel] = useState(false);
    const [dataImportExcel, estDataImportExcel] = useState(null);
    // data
    const [currentPage, setCurrentPage] = useState(0); // หน้าปัจจุบัน
    const itemsPerPage = 50; // จำนวนแถวต่อหน้า
    const [user, setUser] = useState(null);  //token
    const [branches, setBranches] = useState([]);
    const [searchBranch, setSearchBranch] = useState("");
    const [isCarType, setCarType] = useState([]);
    const [searchCarType, setSearchCarType] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermDate, setSearchTermDate] = useState("");
    const [reload, setReload] = useState(false);//  โหลดใหม่เมื่อ `reload` เปลี่ยน

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

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
    }, [user])

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

    const handleOpenModalEditMileage = (dataMileage) => {
        setDataMileageAdd(dataMileage);
        setOpenModalEditMileage(true);
    };
    const handleCloseModalEditMileage = () => {
        setOpenModalEditMileage(false);
    };
    const handleOpenModalAddMileage = (dataMileage) => {
        setDataMileageAdd(dataMileage);
        setOpenModalAddMileage(true);
    };
    const handleCloseModalAddMileage = () => {
        setOpenModalAddMileage(false);
    };

    const handleOpenModalImportExcle = (dataMileage) => {
        estDataImportExcel(dataMileage);
        estOpenModalImportExcel(true);
    }

    const handleCloseModalImportExcel = () => {
        estOpenModalImportExcel(false);
    }

    // แปลงวันที่ให้อยู่ในรูปแบบไทย
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: "numeric", month: "numeric", day: "numeric", calendar: "gregory" };
        return date.toLocaleDateString("th-TH-u-ca-gregory", options); // แสดงวันที่ในรูปแบบไทยและปี ค.ศ.
    };


    const fetchMileageData = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/car_mileage_show_tbl_all_one`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setMileageData(response.data.data);
        } catch (error) {
            console.error("Error fetching mileage data:", error);
        }
    };

    useEffect(() => {
        fetchMileageData();
    }, [reload]);

    // คำนวณข้อมูลที่จะนำมาแสดงในหน้านี้
    const offset = currentPage * itemsPerPage;
    const currentData = isMileageData.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(isMileageData.length / itemsPerPage);

    // ฟังก์ชันเปลี่ยนหน้า
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleBranchChange = (e) => {
        setSearchBranch(e.target.value);
    };

    const handleCarTypeChange = (e) => {
        setSearchCarType(e.target.value);
    };

    // ฟังก์ชันที่แปลงวันที่เป็น 'yyyy-mm-dd'
    const formatDateForSearch = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // คืนค่าในรูปแบบ 'yyyy-mm-dd'
    };

    // ฟังก์ชันกรองข้อมูลที่ใช้วันที่ในการค้นหา
    const filteredVehicleData = isMileageData.filter((dataRow) => {
        const reg_Number = dataRow.reg_number.toLowerCase();
        const branchName = dataRow.branch_name.toLowerCase();
        const carType = dataRow.car_type_name.toLowerCase();
        const formattedDate = formatDateForSearch(dataRow.recorded_date);

        const isDateMatch = searchTermDate ? formattedDate.includes(searchTermDate) : true;

        return (
            reg_Number.includes(searchTerm.toLowerCase()) &&  // ใช้ searchTerm ที่เป็นค่าที่ถูกต้อง
            branchName.includes(searchBranch.toLowerCase()) &&
            carType.includes(searchCarType.toLowerCase()) &&
            isDateMatch
        );
    });



    return (
        <div className="container">
            <div className="p-3">
                <div className="text-center fw-bolder fs-3 mb-3">
                    <p>
                        <i className="bi bi-speedometer"></i> ติดตามเลขไมล์รถ
                    </p>
                </div>
                <div className="mb-3 row">
                    <div className="col-lg-2">
                        <label htmlFor="input_searchTerm" className="form-label fw-medium">ค้นหาทะเบียนรถ</label>
                        <input
                            type="text"
                            id="input_searchTerm"
                            name="input_searchTerm"
                            className="form-control"
                            placeholder="ค้นหาทะเบียนรถ"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </div>
                    <div className="col-lg-2">
                        <label htmlFor="input_Branch" className="form-label fw-medium">สาขา</label>
                        <select
                            id="input_Branch"
                            className="form-select"
                            name="Branch"
                            onChange={handleBranchChange}>
                            <option value="">สาขา (ทั้งหมด)</option>
                            {branches.map((br) => (
                                <option key={br.id_branch} value={br.branch_name}>
                                    {br.branch_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-lg-2">
                        <label htmlFor="input_CarType" className="form-label fw-medium">ประเภทรถ</label>
                        <select
                            id="input_CarType"
                            className="form-select"
                            name="CarType"
                            onChange={handleCarTypeChange}
                        >
                            <option value="">ประเภทรถ (ทั้งหมด)</option>
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
                    <div className="col-lg-2">
                        <label htmlFor="input_date_sh" className="form-label fw-medium">วันที่</label>
                        <input
                            type="date"
                            id="input_date_sh"
                            name="input_date_sh"
                            className="form-control"
                            value={searchTermDate}
                            onChange={(e) => setSearchTermDate(e.target.value)}
                        />
                    </div>

                    <div className="col button-container-td-mileage">
                        <button className="btn btn-mileage" onClick={() => handleOpenModalImportExcle()} >
                            Import <i className="bi bi-file-earmark-spreadsheet-fill" style={{ color: "Green" }}></i>
                        </button>
                    </div>
                </div>
                <div className="">
                    <div className="">
                        <div className="">
                            <table className="table table-hover table-borderless">
                                <thead className="table-secondary ">

                                    <tr>
                                        <th>ทะเบียนรถ</th>
                                        <th>เลขไมล์รถ</th>
                                        <th>เลขไมล์รถรวม</th>
                                        <th>วันที่อัปเดท</th>
                                        <th className=""></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentData.map((rowMi, index) => (
                                        <tr key={index}>
                                            <td>{rowMi.reg_number}</td>
                                            <td style={{ color: "blue" }}>{rowMi.odometer ? Number(rowMi.odometer).toLocaleString() : "N/A"}</td>
                                            <td style={{ color: "green" }}>{rowMi.total_distance ? Number(rowMi.total_distance).toLocaleString() : "N/A"}</td>
                                            <td>{rowMi.recorded_date ? formatDate(rowMi.recorded_date) : "N/A"}</td>
                                            <td className="button-container-td-mileage">
                                                <button className="btn-circle" onClick={() => handleOpenModalAddMileage(rowMi)}>
                                                    <i className="bi bi-pencil-fill"></i>
                                                </button>
                                                <Link to="/truck/CarMileageDetails" state={rowMi} className="btn-circle">
                                                    <i className="bi bi-three-dots"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* ตัวแบ่งหน้า */}
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                        />
                    </div>
                </div>
            </div>

            {isOpenModalEditMileage && (
                <Modal_Edit_MIleage isOpen={isOpenModalEditMileage} onClose={handleCloseModalEditMileage} dataMileage={isDataMileageAdd} />
            )}
            {isOpenModalAddMileage && (
                <Modal_Add_Mileage isOpen={isOpenModalAddMileage} onClose={handleCloseModalAddMileage} dataMileage={isDataMileageAdd} user={user} onSuccess={() => setReload(prev => !prev)} />
            )}
            {isOpenModalImportExcel && (
                <Modal_Import_Excel isOpen={isOpenModalImportExcel} onClose={handleCloseModalImportExcel} />
            )}
        </div>
    );
};

export default CarMileageShow;
