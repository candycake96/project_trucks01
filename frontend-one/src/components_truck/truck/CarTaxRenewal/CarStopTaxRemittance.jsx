import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const CarStopTaxRemittanc = () => {
    const [currentPage, setCurrentPage] = useState(0); // หน้าปัจจุบัน
    const itemsPerPage = 50; // จำนวนแถวต่อหน้า
    const [isVehicleStatus, setVehicleStatus] = useState([]);
    const [isCarType, setCarType] = useState([]);

    // ค้นหา
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCarType, setSearchCarType] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    const fetchVehicleStatus = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vehicle_status_show`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setVehicleStatus(response.data);
        } catch (error) {
            console.error("Error fetching Vehicle Status:", error);
        }
    };

    useEffect(() => {
        fetchVehicleStatus();
    }, []);

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

    // ฟังก์ชันแปลงวันที่
    const formatDate = (dateString) => {
        if (!dateString) return "-"; // ป้องกัน error กรณีค่าเป็น null หรือ undefined
        const date = new Date(dateString);
        return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // ฟังก์ชันกรองข้อมูลจากทะเบียนรถ, ประเภทรถ และสถานะ
    const filteredVehicleData = isVehicleStatus.filter((dataRow) => {
        const regNumber = dataRow.reg_number.toLowerCase();
        const carType = dataRow.car_type_name.toLowerCase();
        const status = dataRow.status.toLowerCase();

        return (
            regNumber.includes(searchTerm.toLowerCase()) &&
            (searchCarType === "" || carType === searchCarType.toLowerCase()) &&
            (searchStatus === "" || status === searchStatus.toLowerCase())
        );
    });

    // คำนวณข้อมูลที่จะแสดงในหน้านี้ จากข้อมูลที่ถูกกรองแล้ว
    const offset = currentPage * itemsPerPage;
    const currentData = filteredVehicleData.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredVehicleData.length / itemsPerPage);
    
    // ฟังก์ชันเปลี่ยนหน้า
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleCarTypeChange = (e) => {
        setSearchCarType(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSearchStatus(e.target.value);
    };

    return (
        <div className="container">
            <div className="text-center p-3 mb-3">
                <p className="fw-bolder fs-5">สถานะรถ ม.79/ม.89/หาย</p>
            </div>
            <div className="row mb-3">
                <div className="col-lg-2">
                    <label htmlFor="input_searchTerm" className="form-label fw-medium">
                        ค้นหาทะเบียนรถ
                    </label>
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
                    <label htmlFor="input_CarType" className="form-label fw-medium">
                        ประเภทรถ
                    </label>
                    <select
                        id="input_CarType"
                        className="form-select"
                        name="CarType"
                        onChange={handleCarTypeChange}
                    >
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
                <div className="col-lg-2">
                    <label htmlFor="input_Branch" className="form-label fw-medium">
                        สถานะ
                    </label>
                    <select
                        id="input_Branch"
                        className="form-select"
                        name="Branch"
                        onChange={handleStatusChange}
                    >
                        <option value="">ทั้งหมด</option>
                        <option value="ม.79">ม.79</option>
                        <option value="ม.89">ม.89</option>
                        <option value="หาย">หาย</option>
                    </select>
                </div>
            </div>
            <div>

                <div className="card">
                    <div className="card-body">
                    <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>ทะเบียน</th>
                            <th>ประเภทรถ</th>
                            <th>วันที่แก้ไขข้อมูล</th>
                            <th>สถานะ</th>
                            <th className="text-center">#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((rewData, index) => (
                            <tr key={rewData.reg_id}>
                                <td>{offset + index + 1}</td>
                                <td>{rewData.reg_number || "-"}</td>
                                <td>{rewData.car_type_name || "-"}</td>
                                <td>{formatDate(rewData.updated_at)}</td>
                                <td>{rewData.status || "-"}</td>
                                <td className="text-center">
                                <Link 
  to={`/truck/Vehicle_status/${rewData.reg_id}`} 
//   state={{ data: rewData }} 
  className="btn btn-outline-primary"
>
  <i className="bi bi-clipboard2-fill"></i>
</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                    </div>
                </div>
                
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
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
            />
        </div>
    );
};

export default CarStopTaxRemittanc;
