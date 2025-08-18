import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../../config/apiConfig";
import MainternanceRequest_table from "./MaintenanceRequest_table";
import Modal_setting_doc_repair from "./Mobal/Modal_setting_doc_repair";

const MaintenanceRequest = () => {

    const [analysisData, setAnalysisData] = useState([]);
    const [filterType, setFilterType] = useState("pending");
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ ตัวแปรที่ใช้เมื่อ "กดปุ่มค้นหา" เท่านั้น
    const [appliedStartDate, setAppliedStartDate] = useState("");
    const [appliedEndDate, setAppliedEndDate] = useState("");
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

    const fetchAnalysisTable = async () => {
        let endpoint = "";
        if (filterType === "pending") {
            endpoint = "/api/repair_requests_detail";
        } else if (filterType === "approved") {
            endpoint = "/api/repair_requests_detail";
        } else if (filterType === "finished") {
            endpoint = "/api/closing_list_table";
        }

        setLoading(true);
        setAnalysisData([]);

        try {
            const response = await axios.get(`${apiUrl}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setAnalysisData(response.data);
        } catch (error) {
            console.error("Error fetching analysis data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysisTable();
    }, [filterType]);

    const filterByDateRange = (data) => {
        if (!appliedStartDate && !appliedEndDate) return data;

        return data.filter(item => {
            const itemDate = new Date(item.request_date).toISOString().split("T")[0];
            if (appliedStartDate && appliedEndDate) return itemDate >= appliedStartDate && itemDate <= appliedEndDate;
            if (appliedStartDate) return itemDate >= appliedStartDate;
            if (appliedEndDate) return itemDate <= appliedEndDate;
            return true;
        });
    };

    const filteredData = filterByDateRange(
        analysisData.filter((item) => {
            const keyword = appliedSearchTerm.toLowerCase(); // ✅ ค้นหาเฉพาะตอนกดปุ่ม
            return (
                item.request_no?.toLowerCase().includes(keyword) ||
                item.reg_number?.toLowerCase().includes(keyword) ||
                item.status?.toLowerCase().includes(keyword)
            );
        })
    );



    // ✅ กดปุ่ม "ค้นหา" แล้วค่อยนำค่าปัจจุบันมาใช้งาน
    const handleSearch = () => {
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setAppliedSearchTerm(searchTerm);
    };

    const [isOpenModalSetting, setOpenModalSetting] = useState(false);
    const handleOpenModalSetting = () => setOpenModalSetting(true);
    const handleClossModalSetting = () => setOpenModalSetting(false);


    return (
        <div className="container py-3">
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h5 className="fw-bold text-primary mb-1">แจ้งซ่อม / งานซ่อม</h5>
                        <p className="text-muted mb-0">รายงานการแจ้งซ่อม</p>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                        {/* ปุ่มแจ้งซ่อม */}

                        <div className="btn-group" role="group">
                            <button
                                className={`btn btn-sm ${filterType === "pending" ? "btn-success" : "btn-outline-success"}`}
                                onClick={() => setFilterType("pending")}
                            >
                                <i className="bi bi-clock me-1"></i> รายการแจ้งซ่อม
                            </button>
                            
                            <button
                                className={`btn btn-sm ${filterType === "finished" ? "btn-success" : "btn-outline-success"}`}
                                onClick={() => setFilterType("finished")}
                            >
                                <i className="bi bi-archive me-1"></i> ประวัติงานที่จบ
                            </button>
                        </div>
                        <Link to="/truck/RepairRequestForm" className="btn btn-primary btn-sm "> <i className="bi bi-plus-circle me-1"></i> แจ้งซ่อม</Link>
                        <Link to="/truck/RepairRequestForm" className="btn btn-primary btn-sm me-1"> <i className="bi bi-plus-circle me-1"></i> PM </Link>

                        <button className="btn btn-secondary btn-sm" onClick={handleOpenModalSetting}> <i class="bi bi-gear"></i> ตั้งค่า</button>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="row mb-3 g-2">
                    <div className="col-sm-3">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="ค้นหาเลขเอกสาร / ทะเบียน "
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-3">
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-3">
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-3">
                        <button
                            className="btn btn-sm btn-outline-primary w-100"
                            onClick={handleSearch}
                        >
                            <i className="bi bi-search me-1"></i> ค้นหาช่วงวันที่
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-muted py-3">
                        <div className="spinner-border spinner-border-sm me-2" role="status" />
                        กำลังโหลดข้อมูล...
                    </div>
                ) : (
                    <>
                        <MainternanceRequest_table analysisData={filteredData} loading={loading} />
                    </>

                )}
            </div>

            {isOpenModalSetting && (
                <Modal_setting_doc_repair isOpen={isOpenModalSetting} onClose={handleClossModalSetting} />
            )}
        </div>
    )
}

export default MaintenanceRequest;
