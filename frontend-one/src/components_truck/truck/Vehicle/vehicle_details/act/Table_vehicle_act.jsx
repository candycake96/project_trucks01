import React, { useEffect, useState } from "react";
import Modale_act_add from "./Modal_act_add";
import Modal_act_update from "./Modal_act_update";
import { apiUrl } from "../../../../../config/apiConfig";
import axios from "axios";

const Table_vehicle_act = ({ dataVehicle }) => {
    const [isModalactAdd, setModalactAdd] = useState(false);
    const [isModalactEdit, setModalactEdit] = useState(false);
    const [dataModalactEdit, setDataModalactEdit] = useState(false);
    const [showDataact, setShowdataact] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleOpenModalActAdd = () => setModalactAdd(true);
    const handleCloseModalActAdd = () => setModalactAdd(false);
    const handleOpenModalActEdit = (data) => {
        setModalactEdit(true);
        setDataModalactEdit(data);
    };
    const handleCloseModalActEdit = () => setModalactEdit(false);

    const fetchShowact = async () => {
        if (!dataVehicle?.reg_id) return;
        try {
            const response = await axios.get(
                `${apiUrl}/api/act_details/${dataVehicle?.reg_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setShowdataact(response.data);
        } catch (error) {
            console.error("Error fetching vehicle data:", error);
            setShowdataact([]);
        }
    };

    useEffect(() => {
        fetchShowact();
    }, [dataVehicle?.reg_id]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const handleSortByDate = () => {
        const sortedData = [...showDataact].sort((a, b) => {
            const dateA = new Date(a.tax_date_end);
            const dateB = new Date(b.tax_date_end);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        setShowdataact(sortedData);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = showDataact.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(showDataact.length / itemsPerPage);

    const handleDeleteAct = async (actId) => {
        if (!window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) return;
        try {
            await axios.delete(`${apiUrl}/api/act_delete/${actId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            alert("✅ ลบข้อมูลเรียบร้อยแล้ว");
            fetchShowact();
        } catch (error) {
            console.error("Error deleting act:", error);
            alert("❌ เกิดข้อผิดพลาดในการลบ");
        }
    };

    return (
        <div className="card shadow-lg border-0 rounded-4 mt-3">
            <div className="card-header bg-gradient bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    <i className="bi bi-car-front-fill me-2"></i>ข้อมูล พ.ร.บ. รถ
                </h5>
                <button
                    className="btn btn-light btn-sm fw-bold shadow-sm"
                    onClick={handleOpenModalActAdd}
                >
                    <i className="bi bi-file-earmark-plus"></i> เพิ่มข้อมูลใหม่
                </button>
            </div>
            <div className="card-body p-0">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-center">
                        <tr>
                            <th>วันเริ่มต้น</th>
                            <th>
                                วันที่หมดอายุ{" "}
                                <button
                                    onClick={handleSortByDate}
                                    className="btn btn-sm btn-outline-secondary ms-2"
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
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {currentItems.length > 0 ? (
                            currentItems.map((row, ndx) => {
                                const today = new Date();
                                const expireDate = new Date(row.act_date_end);
                                const diffTime = expireDate - today;
                                const diffDays =
                                    diffTime / (1000 * 60 * 60 * 24);

                                let statusBadge;
                                if (expireDate < today) {
                                    statusBadge = (
                                        <span className="badge bg-danger shadow-sm">
                                            หมดอายุแล้ว
                                        </span>
                                    );
                                } else if (diffDays <= 90) {
                                    statusBadge = (
                                        <span className="badge bg-warning text-dark shadow-sm">
                                            ใกล้หมดอายุ
                                        </span>
                                    );
                                } else {
                                    statusBadge = (
                                        <span className="badge bg-success shadow-sm">
                                            ยังไม่หมดอายุ
                                        </span>
                                    );
                                }

                                return (
                                    <tr key={ndx}>
                                        <td>{formatDate(row.act_date_start)}</td>
                                        <td>{formatDate(row.act_date_end)}</td>
                                        <td>
                                            {row.price?.toLocaleString()} บาท
                                        </td>
                                        <td>
                                            {row.act_doc ? (
                                                <a
                                                    href={row.act_doc}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-danger"
                                                >
                                                    <i className="bi bi-file-earmark-pdf-fill"></i>{" "}
                                                    ดูเอกสาร
                                                </a>
                                            ) : (
                                                <span className="text-muted">
                                                    ไม่มีไฟล์
                                                </span>
                                            )}
                                        </td>
                                        <td>{statusBadge}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning me-2 shadow-sm"
                                                onClick={() =>
                                                    handleOpenModalActEdit(row)
                                                }
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger shadow-sm"
                                                onClick={() =>
                                                    handleDeleteAct(row.act_id)
                                                }
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center text-muted py-4"
                                >
                                    <i className="bi bi-inbox fs-3"></i>
                                    <div>ไม่มีข้อมูล</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="card-footer bg-light">
                    <nav>
                        <ul className="pagination justify-content-center mb-0">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li
                                    key={i + 1}
                                    className={`page-item ${
                                        currentPage === i + 1 ? "active" : ""
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
                </div>
            )}

            {/* Modals */}
            {isModalactAdd && (
                <Modale_act_add
                    isOpen={isModalactAdd}
                    onClose={handleCloseModalActAdd}
                    dataVehicle={dataVehicle}
                    onSaved={() => fetchShowact()}
                />
            )}

            {isModalactEdit && (
                <Modal_act_update
                    isOpen={isModalactEdit}
                    onClose={handleCloseModalActEdit}
                    dataAct={dataModalactEdit}
                    onSaved={() => fetchShowact()}
                />
            )}
        </div>
    );
};

export default Table_vehicle_act;
