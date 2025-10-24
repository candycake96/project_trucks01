import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { data } from "autoprefixer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Modal_car_tax from "../../CarTaxRenewal/Modal/Modal_car_tax";
import Modal_car_cmi from "../../CarCMI/Modal/Modal_car_cmi";
import Modal_car_insurance from "../../Car_insurance/modal/Modal_car_insurance";

const ReportVehicleAndInsurancy = () => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    const [vehicles, setVehicles] = useState([]);
    const [isBranches, setBranches] = useState([]);
    const [isCartype, setCarType] = useState([]);
    const [user, setUser] = useState(null);

    // 🔎 state สำหรับ filter/sort
    const [searchText, setSearchText] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedCarType, setSelectedCarType] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const [fromSearch, setFromSearch] = useState({
        date_start: "",
        date_end: ""
    });


    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const fetchVegDetails = async () => {
        try {
            let endpoint = "/api/vehicle_insurancy_details";
            let config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            };

            let response;

            // ถ้ามีการกรอกวันที่ → POST พร้อม body
            if (fromSearch.date_start && fromSearch.date_end) {
                response = await axios.post(
                    `${apiUrl}/api/vehicle_insurancy_details_search`,
                    {
                        date_start: fromSearch.date_start,
                        date_end: fromSearch.date_end,
                    },
                    config
                );
            } else {
                // default → GET ทั้งหมด
                response = await axios.get(`${apiUrl}${endpoint}`, config);
            }

            setVehicles(response.data.results || []);
        } catch (error) {
            console.error("Error fetching analysis data:", error);
        }
    };


    useEffect(() => {
        fetchVegDetails();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/getbranches/${user?.company_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setBranches(response.data);
        } catch (error) {
            console.error("Error fetching analysis data:", error);
        }
    };

    useEffect(() => {
        if (user) fetchBranches();
    }, [user]);

    const fetchCartype = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/detailscartype`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setCarType(response.data);
        } catch (error) {
            console.error("Error fetching analysis data:", error);
        }
    };

    useEffect(() => {
        fetchCartype();
    }, []);

    // สรุปข้อมูล
    const summaryCards = [
        { title: "รถทั้งหมด", icon: "🚚", value: vehicles.length, color: "success", path: "handleOpenModalTax" },
        { title: "หมดอายุภาษี", icon: "⚡", value: vehicles.filter(v => v.tax_date_end && new Date(v.tax_date_end) < new Date()).length, color: "brand", onClick: () => handleOpenModalTax() },
        { title: "หมดประกันภัยรถ", icon: "❌", value: vehicles.filter(v => v.vehicle_insurance_date_end && new Date(v.vehicle_insurance_date_end) < new Date()).length, onClick: () => handleOpenModalInsurance() },
        { title: "หมด พรบ.", icon: "⚠️", value: vehicles.filter(v => v.act_date_end && new Date(v.act_date_end) < new Date()).length, color: "indigo", onClick: () => handleOpenModalCMI() },
    ];

    // ฟังก์ชันแสดง badge
    const getStatusBadge = (status) => {
        switch (status) {
            case "ปกติ": return <span className="badge bg-success">{status}</span>;
            case "ใกล้หมดอายุ": return <span className="badge bg-warning">{status}</span>;
            case "หมดอายุ": return <span className="badge bg-danger">{status}</span>;
            default: return <span className="badge bg-secondary">ไม่ระบุ</span>;
        }
    };

    // ฟังก์ชัน format วันที่
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
    };

    // 🔎 ฟังก์ชัน sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // ✅ filter + sort ข้อมูล
    const filteredVehicles = vehicles
        .filter(v =>
            (selectedBranch ? v.branch_name === selectedBranch : true) &&
            (selectedCarType ? v.car_type_name === selectedCarType : true) &&
            (searchText ? v.reg_number.toLowerCase().includes(searchText.toLowerCase()) : true)
        )
        .sort((a, b) => {
            if (!sortField) return 0;
            let valA = a[sortField] || "";
            let valB = b[sortField] || "";
            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();
            if (sortOrder === "asc") return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });

    // ✅ รวมยอดภาษี, ประกันภัยรถ, ประกันสินค้า
    const totalTax = filteredVehicles.reduce((sum, v) => sum + (v.tax_price || 0), 0);
    const totalVehicleInsurance = filteredVehicles.reduce((sum, v) => sum + (v.vehicle_insurance_price || 0), 0);
    const totalGoodsInsurance = filteredVehicles.reduce((sum, v) => sum + (v.goods_insurance_price || 0), 0);


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredVehicles.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            filteredVehicles.map((v, idx) => ({
                ลำดับ: idx + 1,
                สาขา: v.branch_name || "-",
                ทะเบียนรถ: v.reg_number,
                ประเภทรถ: v.car_type_name,
                "วันที่จดทะเบียน": formatDate(v.reg_date),
                "วันหมดอายุภาษี": formatDate(v.tax_date_end),
                "จำนวนเงิน (ภาษี)": v.tax_price || 0,
                พรบ: v.act_price || 0,
                "วันสิ้นสุด พรบ": formatDate(v.act_date_end),
                "ประกันภัยรถ": v.vehicle_insurance_class || "-",
                "วันสิ้นสุดประกัน": formatDate(v.vehicle_insurance_date_end),
                "จำนวนเงิน (ประกัน)": v.vehicle_insurance_price || 0,
                "ประกันสินค้า": v.goods_insurance_class || "-",
                "วันสิ้นสุดประกันสินค้า": formatDate(v.goods_insurance_date_end),
                "จำนวนเงิน (ประกันสินค้า)": v.goods_insurance_price || 0,
                "สถานะรถ": v.status || "ปกติ",
                "ประกอบการชื่อ": v.owner_name || "-",
                กรรมสิทธิ์: v.operators || "-",
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Vehicles");
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Vehicle_Report.xlsx");
    };

    const [isOpenModalTax, setOpenModalTax] = useState(false);
    const [dataOpenModalTax, setDataOpenModalTax] = useState(false);

    const handleOpenModalTax = (data) => {
        setOpenModalTax(true);
        setDataOpenModalTax(data);
    }
    const handleClonseModalTax = () => {
        setOpenModalTax(false);
        setDataOpenModalTax(null);
    }

    const [isOpenModalCMI, setOpenModalCMI] = useState(false);
    const [dataOpenModalCMI, setDataOpenModalCMI] = useState(false);

    const handleOpenModalCMI = (data) => {
        setOpenModalCMI(true);
        setDataOpenModalCMI(data);
    }
    const handleClonseModalCMI = () => {
        setOpenModalCMI(false);
        setDataOpenModalCMI(null);
    }

    const [isOpenModalInsurance, setOpenModalInsurance] = useState(false);
    const [dataOpenModalInsurance, setDataOpenModalInsurance] = useState(false);

    const handleOpenModalInsurance = (data) => {
        setOpenModalInsurance(true);
        setDataOpenModalInsurance(data);
    }
    const handleClonseModalInsurance = () => {
        setOpenModalInsurance(false);
        setDataOpenModalInsurance(null);
    }


    return (
        <div className="container my-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h2 className="fw-bold text-primary mb-1">📊 รายงานสรุปยานพาหนะและประกันภัย </h2>
                <p className="text-secondary">สรุปข้อมูลรถทั้งหมด พร้อมสถานะภาษีและประกัน</p>
            </div>

            {/* Summary Cards */}
            <div className="row g-4 mb-4">
                {summaryCards.map((card, idx) => (
                    <div key={idx} className="col-md-3">
                        <div
                            onClick={card.onClick}
                            className={`card h-100 border-0 shadow-lg text-center hover-scale`}
                            style={{ cursor: "pointer" }}
                        >
                            <div className={`card-body text-${card.color}`}>
                                <h5 className="fw-bold">{card.icon} {card.title}</h5>
                                <h2 className="fw-bold">{card.value}</h2>
                                <p className="text-muted">คัน</p>
                            </div>
                        </div>
                    </div>

                ))}
            </div>


            <div className="card p-3 shadow-sm mb-4">
                {/* Date Filter */}
                <div className="row g-2 align-items-end">
                    <div className="col-12 col-md-3">
                        <label htmlFor="dateStart" className="form-label mb-1 small">วันที่เริ่มต้น</label>
                        <input
                            type="date"
                            id="dateStart"
                            className="form-control form-control-sm"
                            value={fromSearch.date_start}
                            onChange={(e) => setFromSearch({ ...fromSearch, date_start: e.target.value })}
                        />
                    </div>

                    <div className="col-12 col-md-3">
                        <label htmlFor="dateEnd" className="form-label mb-1 small">ถึงวันที่</label>
                        <input
                            type="date"
                            id="dateEnd"
                            className="form-control form-control-sm"
                            value={fromSearch.date_end}
                            onChange={(e) => setFromSearch({ ...fromSearch, date_end: e.target.value })}
                        />
                    </div>

                    <div className="col-12 col-md-2">
                        <button
                            className="btn btn-primary btn-sm w-100"
                            onClick={fetchVegDetails}
                        >
                            🔍 ค้นหา
                        </button>
                    </div>
                    <div className="col-12 col-md-2">
                        <button className="btn btn-outline-danger btn-sm me-1"><i class="bi bi-file-earmark-pdf-fill"></i> PDF</button>
                        <button className="btn btn-success btn-sm" onClick={exportToExcel}>
                            <i className="bi bi-file-earmark-spreadsheet-fill"></i> Excel
                        </button>


                    </div>
                </div>



                {/* Filter */}
                <div className="row g-2 align-items-center mt-3">
                    <div className="col-12 col-md-4">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="ค้นหาทะเบียนรถ..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <select
                            className="form-select form-select-sm"
                            value={selectedCarType}
                            onChange={(e) => setSelectedCarType(e.target.value)}
                        >
                            <option value="">ประเภทรถ (ทั้งหมด)</option>
                            {isCartype.map((row, ndx) => (
                                <option value={row.car_type_name} key={ndx}>{row.car_type_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 col-md-4">
                        <select
                            className="form-select form-select-sm"
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                        >
                            <option value="">สาขา (ทั้งหมด)</option>
                            {isBranches.map((row, ndx) => (
                                <option value={row.branch_name} key={ndx}>{row.branch_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>





            {/* Table */}
            <div className="card shadow-lg border-0">
                <div className="card-header bg-primary d-flex justify-content-between align-items-center">
                    <p className="text-white fw-bold mb-0">รายละเอียดยานพาหนะและประกันภัย</p>
                    <div className="d-flex gap-1">
                        <button className="btn btn-danger btn-sm">
                            <i className="bi bi-file-earmark-pdf-fill"></i> PDF
                        </button>
                        <button className="btn btn-success btn-sm" onClick={exportToExcel}>
                            <i className="bi bi-file-earmark-spreadsheet-fill"></i> Excel
                        </button>
                    </div>
                </div>

                <div className="card-body p-0 table-responsive">
                    <table className="table table-striped table-hover mb-0">
                        <thead className="table-primary">
                            <tr>
                                <th>ลำดับ</th>
                                <th>สาขา</th>
                                <th>ทะเบียนรถ</th>
                                <th>ประเภทรถ</th>
                                <th onClick={() => handleSort("reg_date")} style={{ cursor: "pointer" }}>
                                    วันที่จดทะเบียน {sortField === "reg_date" ? (sortOrder === "asc" ? "▲" : "▼") : "▼"}
                                </th>
                                <th onClick={() => handleSort("tax_date_end")} style={{ cursor: "pointer" }}>
                                    วันหมดอายุภาษี {sortField === "tax_date_end" ? (sortOrder === "asc" ? "▲" : "▼") : "▼"}
                                </th>
                                <th onClick={() => handleSort("tax_price")} style={{ cursor: "pointer" }}>
                                    จำนวนเงิน (ภาษี) {sortField === "tax_price" ? (sortOrder === "asc" ? "▲" : "▼") : "▼"}
                                </th>
                                <th onClick={() => handleSort("act_date_end")} style={{ cursor: "pointer" }}>
                                    วันสิ้นสุด พรบ {sortField === "act_date_end" ? (sortOrder === "asc" ? "▲" : "▼") : "▼"}
                                </th>
                                <th> จำนวนเงิน (พรบ)</th>
                                <th>ประกันภัยรถ</th>
                                <th onClick={() => handleSort("vehicle_insurance_date_end")} style={{ cursor: "pointer" }}>
                                    วันสิ้นสุดประกัน  {sortField === "vehicle_insurance_date_end" ? (sortOrder === "asc" ? "▲" : "▼") : "▼"}
                                </th>
                                <th onClick={() => handleSort("vehicle_insurance_price")} style={{ cursor: "pointer" }}>
                                    จำนวนเงิน (ประกัน) {sortField === "vehicle_insurance_price" ? (sortOrder === "asc" ? "▲" : "▼") : "▼"}
                                </th>
                                <th>ประกันสินค้า</th>
                                <th onClick={() => handleSort("goods_insurance_date_end")} style={{ cursor: "pointer" }}>
                                    วันสิ้นสุดประกันสินค้า {sortField === "goods_insurance_date_end" ? (sortOrder === "asc" ? "▲" : "▼") : "▼"}
                                </th>
                                <th onClick={() => handleSort("goods_insurance_price")} style={{ cursor: "pointer" }}>
                                    จำนวนเงิน (ประกันสินค้า) {sortField === "goods_insurance_price" ? (sortOrder === "asc" ? "▲" : "▼") : "▼"}
                                </th>
                                <th>สถานะรถ</th>
                                <th>ประกอบการชื่อ</th>
                                <th>กรรมสิทธิ์</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.length > 0 ? currentRows.map((v, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{v.branch_name || "-"}</td>
                                    <td>{v.reg_number}</td>
                                    <td>{v.car_type_name}</td>
                                    <td>{formatDate(v.reg_date)}</td>
                                    <td>{formatDate(v.tax_date_end)}</td>
                                    <td>{v.tax_price ? v.tax_price.toLocaleString() : "-"}</td>
                                    <td>{formatDate(v.act_date_end)}</td>
                                    <td>{v.act_price ? v.act_price.toLocaleString() : "-"}</td>                                    
                                    <td>{v.vehicle_insurance_class || "-"}</td>
                                    <td>{formatDate(v.vehicle_insurance_date_end)}</td>
                                    <td>{v.vehicle_insurance_price ? v.vehicle_insurance_price.toLocaleString() : "-"}</td>
                                    <td>{v.goods_insurance_class || "-"}</td>
                                    <td>{formatDate(v.goods_insurance_date_end)}</td>
                                    <td>{v.goods_insurance_price ? v.goods_insurance_price.toLocaleString() : "-"}</td>
                                    <td>{getStatusBadge(v.status || "ปกติ")}</td>
                                    <td>{v.owner_name || "-"}</td>
                                    <td>{v.operators || "-"}</td>
                                </tr>
                            )) : (<>
                                <tr>
                                    <td colSpan="10" className="text-center text-muted">ไม่มีข้อมูล</td>
                                </tr>
                            </>)}
                        </tbody>
                        <tbody className="" style={{ background: "#6495ED" }}>
                            <tr className="fw-bold table-light">
                                <td colSpan={5}></td>
                                <td>(ภาษี) รวม</td>
                                <td>{totalTax.toLocaleString()}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>(ประกันรถ) รวม</td>
                                <td>{totalVehicleInsurance.toLocaleString()}</td>
                                <td></td>
                                <td>(ประกันสินค้า) รวม</td>
                                <td>{totalGoodsInsurance.toLocaleString()}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                    <button disabled={currentPage === 1} className="btn btn-sm me-1" onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} className={`btn btn-sm me-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </button>
                    ))}
                    <button disabled={currentPage === totalPages} className="btn btn-sm" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                </div>
            )}

            {/* CSS Hover Effect */}
            <style>{`
        .hover-scale:hover {
          transform: translateY(-5px);
          transition: 0.3s;
        }
      `}</style>

            {isOpenModalTax && (
                <Modal_car_tax isOpen={isOpenModalTax} onClose={handleClonseModalTax} />

            )}

            {isOpenModalCMI && (
                <Modal_car_cmi isOpen={isOpenModalCMI} onClose={handleClonseModalCMI} />

            )}

            {isOpenModalInsurance && (
                <Modal_car_insurance isOpen={isOpenModalInsurance} onClose={handleClonseModalInsurance} />

            )}
        </div>
    );
};

export default ReportVehicleAndInsurancy;
