import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import axios from "axios";
import MainternancePlanning_table from "./MainternancePlanning_table";

const MaintenancPlanning = () => {
    const [isPlanningData, setPlanningData] = useState([]);
    const [filterType, setFilterType] = useState("pending");
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ ตัวแปรที่จะใช้เมื่อ "กดค้นหา"
    const [appliedStartDate, setAppliedStartDate] = useState("");
    const [appliedEndDate, setAppliedEndDate] = useState("");
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

    const fetchPlanningTable = async () => {
        let endpoint = "";
        if (filterType === "pending") {
            endpoint = "/api/planning_show";
        } else if (filterType === "approved") {
            endpoint = "/api/planning_table_submit";
        } else if (filterType === "finished") {
            endpoint = "/api/closing_list_table";
        }

        setLoading(true);
        setPlanningData([]);

        try {
            const response = await axios.get(`${apiUrl}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setPlanningData(response.data);
        } catch (error) {
            console.error("Error fetching Planning data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlanningTable();
    }, [filterType]);

    // ✅ ฟังก์ชันกรองตามวันที่
    const filterByDateRange = (data) => {
        if (!appliedStartDate && !appliedEndDate) return data;

        return data.filter(item => {
            if (!item.request_date) return false;

            const itemDate = new Date(item.request_date).toISOString().split("T")[0];
            if (appliedStartDate && appliedEndDate)
                return itemDate >= appliedStartDate && itemDate <= appliedEndDate;
            if (appliedStartDate)
                return itemDate >= appliedStartDate;
            if (appliedEndDate)
                return itemDate <= appliedEndDate;

            return true;
        });
    };

    // ✅ กรองตามข้อความ + วันที่
    const filteredData = filterByDateRange(
        isPlanningData.filter((item) => {
            const keyword = appliedSearchTerm.toLowerCase();
            return (
                item.request_no?.toLowerCase().includes(keyword) ||
                item.reg_number?.toLowerCase().includes(keyword) ||
                item.status?.toLowerCase().includes(keyword)
            );
        })
    );

    // ✅ เมื่อกดปุ่ม "ค้นหา"
    const handleSearch = () => {
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setAppliedSearchTerm(searchTerm);
    };

    return (
        <div className="container py-3">
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h5 className="fw-bold text-primary mb-1">ตรวจสอบความพร้อม</h5>
                        <p className="text-muted mb-0">
                            รายงานการตรวจสอบความพร้อมและการจัดวันเวลารถเข้าซ่อม
                        </p>
                    </div>
                    <div className="btn-group" role="group">
                        <button
                            className={`btn btn-sm ${filterType === "pending" ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setFilterType("pending")}
                        >
                            <i className="bi bi-clock me-1"></i> รอจัดรถ
                        </button>
                        <button
                            className={`btn btn-sm ${filterType === "approved" ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setFilterType("approved")}
                        >
                            <i className="bi bi-check2-circle me-1"></i> จัดรถแล้ว
                        </button>
                        <button
                            className={`btn btn-sm ${filterType === "finished" ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setFilterType("finished")}
                        >
                            <i className="bi bi-archive me-1"></i> ประวัติงานที่จบ
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="row mb-3 g-2">
                    <div className="col-sm-3">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="ค้นหาเลขเอกสาร / ทะเบียน"
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
                     <MainternancePlanning_table PlanningData={filteredData} loading={loading} />
                    </>
                    
                )}
            </div>
        </div>
    );
};

export default MaintenancPlanning;
