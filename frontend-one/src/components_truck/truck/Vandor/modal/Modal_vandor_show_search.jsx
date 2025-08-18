import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { Link } from "react-router-dom";
import { apiUrl } from "../../../../config/apiConfig";
import Modal_vandor_details from "./Modal_vandor_details";

const Modal_vandor_show_search = ({ isOpen, onClose, onSubmit }) => {
    const [isShowDataVendor, setShowDataVender] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // เพิ่ม state สำหรับค้นหา
    const [searchText, setSearchText] = useState("");
    const [searchValue, setSearchValue] = useState(""); // สำหรับ input

    // API URL
    const fetchVendorShowData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vendor_show`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setShowDataVender(response.data);
        } catch (error) {
            console.error("Error fetching coverage type:", error);
        }
    };

    useEffect(() => {
        fetchVendorShowData();
    }, []);

    // ข้อมูล
    const [isOpenModalVendorDetails, setOpenModalVendorDetails] = useState(false);
    const [isVendorID, setVendorID] = useState(null);

    // ข้อมูล 
    const handleOpenModalVandorDetails = (data) => {
        setVendorID(data);
        setOpenModalVendorDetails(true);
    };
    const handleCloseModalVandorDetails = () => {
        setOpenModalVendorDetails(false);
    };

    // ฟิลเตอร์ข้อมูลตามชื่อ vendor_name
    const filteredVendors = isShowDataVendor.filter(v =>
        v.vendor_name?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Pagination
    const pageCount = Math.ceil(filteredVendors.length / itemsPerPage);
    const paginatedData = filteredVendors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Reset page เมื่อค้นหาใหม่
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText]);

    // ฟังก์ชันสำหรับการเลือก item ส่งข้อมูลไปยัง onSubmit
     const handleSelectItem = (item) => {
        onSubmit(item);
        onClose(); // ปิด Modal
    }

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="Vendor Details"
            style={{
                content: {
                    width: "90%",
                    maxWidth: "950px",
                    maxHeight: "80vh",
                    height: "auto",
                    margin: "auto",
                    padding: "0",
                    border: "none",
                    borderRadius: "0.5rem",
                    overflowY: "auto",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            }}
        >
            <div
                className="modal-header"
                style={{
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        cursor: "pointer",
                    }}
                >
                    ×
                </button>
                <h5 className="modal-title text-center fw-bolder">
                    ข้อมูลผู้จำหน่าย (อู่ซ่อม)
                </h5>
            </div>

            <div className="modal-body" style={{ padding: "1rem" }}>
                {/* ช่องค้นหา */}
                <div className="mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="ค้นหาชื่ออู่/ร้าน/บริษัท"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") setSearchText(searchValue);
                            }}
                        />
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => setSearchText(searchValue)}
                        >
                            <i className="bi bi-search"></i> ค้นหา
                        </button>
                    </div>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>รายชื่ออู่/ร้าน/บริษัท</th>
                            <th>โทร</th>
                            <th>เงื่อนไขเครดิต</th>
                            <th>ลักษณะประกอบการ</th>
                            <th><i className="bi bi-file-text-fill"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr key={index}>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{row.vendor_name}</td>
                                <td>{row.phone}</td>
                                <td>{row.credit_terms} วัน</td>
                                <td>{row.organization_type_name}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary rounded-circle me-1" onClick={() => handleOpenModalVandorDetails(row)}>
                                        <i className="bi bi-file-text-fill"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-primary rounded-circle me-1"
                                        onClick={() => handleSelectItem(row)} // เรียกใช้ฟังก์ชันเมื่อคลิก
                                    >
                                        <i className="bi bi-arrow-down"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination */}
                {pageCount > 1 && (
                    <nav>
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: pageCount }, (_, i) => (
                                <li
                                    key={i}
                                    className={`page-item${currentPage === i + 1 ? " active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
                {/* แสดงจำนวนทั้งหมด ค้างด้านล่าง */}
                <div
                    style={{
                        position: "sticky",
                        bottom: 0,
                        textAlign: "right",
                        padding: "0.5rem",
                        background: "white",
                        fontSize: "0.875rem",
                        color: "#666",
                        zIndex: 1,
                    }}
                >
                    จำนวนทั้งหมด {filteredVendors.length} รายการ
                </div>
            </div>

            {isOpenModalVendorDetails && (
                <Modal_vandor_details
                    isOpen={isOpenModalVendorDetails}
                    onClose={handleCloseModalVandorDetails}
                    vendorID={isVendorID}
                />
            )}
        </ReactModal>
    );
}

export default Modal_vandor_show_search;