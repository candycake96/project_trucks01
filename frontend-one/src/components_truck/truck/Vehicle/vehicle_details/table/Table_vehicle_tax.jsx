import React, { useEffect, useState } from "react";
import Modale_tax_add from "../../expanded/modal/Modal_tax_add";
import { apiUrl } from "../../../../../config/apiConfig";
import axios from "axios";
import Modal_UpdateTax from "../../expanded/modal/Modal_UpdateTax";

const Table_vehicle_tax = ({ dataVehicle }) => {
    const [isModalTaxAdd, setModalTaxAdd] = useState(false);
    const [isModalTaxEdit, setModalTaxEdit] = useState(false);
    const [dataModalTaxEdit, setDataModalTaxEdit] = useState(false);
    const [showDatatax, setShowdatatax] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // แสดง 20 แถวต่อหน้า

    const handleOpenModalTaxAdd = () => setModalTaxAdd(true);
    const handleCloseModalTaxAdd = () => setModalTaxAdd(false);
    const handleOpenModalTaxEdit = (data) => { setModalTaxEdit(true), setDataModalTaxEdit(data) };
    const handleCloseModalTaxEdit = () => setModalTaxEdit(false);


    const fetchShowtax = async () => {
        if (!dataVehicle?.reg_id) return;
        try {
            const response = await axios.get(
                `${apiUrl}/api/tax_details/${dataVehicle.reg_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setShowdatatax(response.data);
        } catch (error) {
            console.error("Error fetching vehicle data:", error);
            setShowdatatax([]);
        }
    };

    useEffect(() => {
        fetchShowtax();
    }, [dataVehicle?.reg_id]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const handleSortByDate = () => {
        const sortedData = [...showDatatax].sort((a, b) => {
            const dateA = new Date(a.tax_date_end);
            const dateB = new Date(b.tax_date_end);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        setShowdatatax(sortedData);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    // 🔹 คำนวณข้อมูลที่จะแสดงต่อหน้า
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = showDatatax.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(showDatatax.length / itemsPerPage);


    const handleDeleteTax = async (taxId) => {
        if (!window.confirm("คุณต้องการลบข้อมูลภาษีนี้หรือไม่?")) return;

        try {
            await axios.delete(`${apiUrl}/api/tax_delete/${taxId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            alert("ลบข้อมูลภาษีเรียบร้อยแล้ว");
            fetchShowtax(); // โหลดข้อมูลใหม่
        } catch (error) {
            console.error("Error deleting tax:", error);
            alert("เกิดข้อผิดพลาดในการลบข้อมูลภาษี");
        }
    };


    return (
        <>
            <table className="table table-bordered align-middle">
                <thead className="table-light">
                    <tr>
                        <th>
                            วันที่หมดอายุ{" "}
                            <button
                                onClick={handleSortByDate}
                                className="btn-sm btn-outline-secondary"
                            >
                                {sortOrder === "asc" ? (
                                    <i className="bi bi-sort-down"></i>
                                ) : (
                                    <i className="bi bi-sort-up"></i>
                                )}
                            </button>
                        </th>
                        <th>ราคา</th>
                        <th>เอกสาร</th>
                        <th>สถานะ</th>
                        <th className="text-center">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleOpenModalTaxAdd}
                            >
                                <i className="bi bi-file-earmark-plus"></i> เพิ่มข้อมูลใหม่
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((row, ndx) => (
                            <tr key={ndx}>
                                <td>{formatDate(row.tax_date_end)}</td>
                                <td>{row.price}</td>
                                <td>
                                    {row.tax_doc ? (
                                        <a
                                            href={row.tax_doc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="bi bi-file-earmark-pdf-fill text-danger"></i>{" "}
                                            ดูเอกสาร
                                        </a>
                                    ) : (
                                        "ไม่มีไฟล์"
                                    )}
                                </td>
                                <td>
                                    {(() => {
                                        const today = new Date();
                                        const expireDate = new Date(row.tax_date_end);
                                        const diffTime = expireDate - today;
                                        const diffDays = diffTime / (1000 * 60 * 60 * 24);

                                        if (expireDate < today) {
                                            return <span className="badge bg-danger">หมดอายุแล้ว</span>;
                                        } else if (diffDays <= 90) {
                                            return (
                                                <span className="badge bg-warning text-dark">
                                                    ใกล้หมดอายุ
                                                </span>
                                            );
                                        } else {
                                            return (
                                                <span className="badge bg-success">ยังไม่หมดอายุ</span>
                                            );
                                        }
                                    })()}
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleOpenModalTaxEdit(row)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTax(row.tax_id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>

                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                ไม่มีข้อมูลภาษี
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 🔹 Pagination */}
            {totalPages > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li
                                key={i + 1}
                                className={`page-item ${currentPage === i + 1 ? "active" : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {isModalTaxAdd && (
                <Modale_tax_add
                    isOpen={isModalTaxAdd}
                    onClose={handleCloseModalTaxAdd}
                    dataVehicle={dataVehicle}
                    onSaved={() => fetchShowtax()}
                />
            )}
            {isModalTaxEdit && (
                <Modal_UpdateTax
                    isOpen={isModalTaxEdit}
                    onClose={handleCloseModalTaxEdit}
                    dataTax={dataModalTaxEdit}
                    onSaved={() => fetchShowtax()}
                />
            )}
        </>
    );
};

export default Table_vehicle_tax;
