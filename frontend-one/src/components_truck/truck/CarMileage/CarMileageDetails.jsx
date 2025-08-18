import React, { useEffect, useState } from "react";
import Modal_Edit_Mileage from "./Modal/Modal_Edit_Mileage";
import Modal_Add_Mileage from "./Modal/Modal_Add_Milaege";
import ReactPaginate from "react-paginate";
import "./CarMileageShow.css";
import "./CarMileageDetails.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../../../config/apiConfig";

const CarMileageDetails = () => {
    const [isMileageData, setMileageData] = useState([]);
    const [isOpenModalEditMileage, setOpenModalEditMileage] = useState(false);
    const [isOpenModalAddMileage, setOpenModalAddMileage] = useState(false);
    const [isDataMileageAdd, setDataMileageAdd] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);  // Tracks the current page
    const itemsPerPage = 10;  // The number of items per page
    const [user, setUser] = useState(null);
    const [searchTermDate, setSearchTermDate] = useState("");
    const location = useLocation();
    const rowMiData = location.state || {};
    const [reload, setReload] = useState(false); // Reload when `reload` changes

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: "numeric", month: "numeric", day: "numeric", calendar: "gregory" };
        return date.toLocaleDateString("th-TH-u-ca-gregory", options);
    };

    const fetchMileageData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/getMileageData/${rowMiData.reg_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setMileageData(response.data.data || []);
        } catch (error) {
            console.error("Error fetching mileage data:", error);
        }
    };

    useEffect(() => {
        if (rowMiData?.reg_id) {
            fetchMileageData();
        }
    }, [rowMiData?.reg_id, reload]);

    const formatDateForSearch = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Filter the data based on the search term
    const filteredVehicleData = isMileageData.filter((dataRow) => {
        const formattedDate = formatDateForSearch(dataRow.recorded_date);
        const isDateMatch = searchTermDate ? formattedDate.includes(searchTermDate) : true;
        return isDateMatch;
    });

    // Pagination logic
    const offset = currentPage * itemsPerPage;
    const currentData = filteredVehicleData.slice(offset, offset + itemsPerPage);  // Get the current page data
    const pageCount = Math.ceil(filteredVehicleData.length / itemsPerPage);  // Calculate total page count

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);  // Update the current page based on user's selection
    };

    const handleDeleteMileageDataRow = async (id) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?")) return; // Confirm before delete
        try {
            await axios.delete(`${apiUrl}/api/car_mileage_delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            // Refresh data without reloading the page
            setReload(prev => !prev);

        } catch (error) {
            console.error("❌ Error deleting mileage data:", error);
        }
    };

    return (
        <div className="container">
            <div className="p-3">
                <div className="text-center fw-bolder fs-4 mb-3">
                    <p>เลขไมล์ทะเบียนรถ {rowMiData.reg_number}</p>
                </div>
                <div className="row g-3 mb-3 align-items-end">
                    <div className="col-lg-3">
                        <label htmlFor="input_date_sh" className="form-label fw-medium">วันที่</label>
                        <input
                            type="date"
                            id="input_date_sh"
                            name="input_date_sh"
                            className="form-control"
                            value={searchTermDate}
                            onChange={(e) => setSearchTermDate(e.target.value)} // Update search term for filtering
                        />
                    </div>
                    <div className="col-lg-2 d-flex align-items-end">
                        <button 
                            className="btn w-100" 
                            onClick={() => {
                                setSearchTermDate("");  // Clear search term and fetch data
                                fetchMileageData();
                            }}
                        >
                            📋 ดูทั้งหมด
                        </button>
                    </div>
                    <div className="col-lg-2 d-flex align-items-end">
                        <button className="btn btn-mileage-gold w-100" onClick={() => handleOpenModalAddMileage(rowMiData)}>
                            ➕ เพิ่มข้อมูล
                        </button>
                    </div>
                </div>
                <div>
                    <table className="table table-hover table-borderless ">
                        <thead className="table-secondary  ">
                            <tr>
                                <th >วันที่อัปเดท</th>
                                <th>เลขไมล์รถ</th>
                                <th>เลขไมล์รถรวม</th>
                                <th>สถานะ</th>
                                <th>หมายเหตุ</th>
                                <th>ผู้คีย์ข้อมูล</th>
                                <th ></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVehicleData.length > 0 ? (
                                currentData.map((rowMi, index) => (
                                    <tr key={index}>
                                        <td >{rowMi.recorded_date ? formatDate(rowMi.recorded_date) : "N/A"}</td>
                                        <td style={{ color: "blue" }}>{rowMi.odometer ? Number(rowMi.odometer).toLocaleString() : "N/A"}</td>
                                        <td style={{ color: "green" }}>{rowMi.total_distance ? Number(rowMi.total_distance).toLocaleString() : "N/A"}</td>
                                        <td>{rowMi.status ? rowMi.status : "-"}</td>
                                        <td>{rowMi.notes ? rowMi.notes : "-"}</td>
                                        <td>{`${rowMi.fname || ""} ${rowMi.lname || ""}`.trim() || "-"}</td>
                                        <td className="button-container-td-mileage">
                                            <button className="btn-circle" onClick={() => handleOpenModalEditMileage(rowMi)}>
                                                <i className="bi bi-tools"></i> {/* Edit icon */}
                                            </button>
                                            <button className="btn-circle" onClick={() => handleDeleteMileageDataRow(rowMi.id)}>
                                                <i className="bi bi-trash3-fill"></i> {/* Delete icon */}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", color: "red" }}>
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
            {isOpenModalEditMileage && (
                <Modal_Edit_Mileage isOpen={isOpenModalEditMileage} onClose={handleCloseModalEditMileage} dataMileage={isDataMileageAdd} user={user} onSuccess={() => setReload(prev => !prev)} />
            )}
            {isOpenModalAddMileage && (
                <Modal_Add_Mileage isOpen={isOpenModalAddMileage} onClose={handleCloseModalAddMileage} dataMileage={isDataMileageAdd} user={user} onSuccess={() => setReload(prev => !prev)} />
            )}
        </div>
    );
};

export default CarMileageDetails;
