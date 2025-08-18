import axios from "axios";
import React, { useEffect, useState } from "react";
import RepairCloseListTable from "./RepairCloseListTable";
import { apiUrl } from "../../../../config/apiConfig";


const RepairCloseList = () => {
  const [isPendingTable, setPendingTable] = useState([]);
    const [filterType, setFilterType] = useState("closeList");
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ ตัวแปรที่จะใช้เมื่อ "กดค้นหา"
    const [appliedStartDate, setAppliedStartDate] = useState("");
    const [appliedEndDate, setAppliedEndDate] = useState("");
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

    const fetchPendingTable = async () => {
        let endpoint = "";
        if (filterType === "closeList") {
            endpoint = "/api/waiting_closing_list_table";
        } else if (filterType === "approved") {
            endpoint = "/api/waiting_closing_list_table";
        } else if (filterType === "finished") {
            endpoint = "/api/closing_list_table";
        }

        setLoading(true);
        setPendingTable([]);

        try {
            const response = await axios.get(`${apiUrl}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setPendingTable(response.data);
        } catch (error) {
            console.error("Error fetching Planning data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTable();
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
        isPendingTable.filter((item) => {
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
                        <h5 className="fw-bold text-primary mb-1">รายการปิดงานซ่อม</h5>
                        <p className="text-muted mb-0">
                            แสดงรายการซ่อมที่ดำเนินการเสร็จและรอการปิดงาน
                        </p>
                    </div>
                    <div className="btn-group" role="group">
                        <button
                            className={`btn btn-sm ${filterType === "closeList" ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setFilterType("closeList")}
                        >
                            <i className="bi bi-clock me-1"></i> รายการปิดงานซ่อม
                        </button>
                        <button
                            className={`btn btn-sm ${filterType === "approved" ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setFilterType("approved")}
                        >
                            <i className="bi bi-check2-circle me-1"></i> รายการยกเลิก
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
                        <RepairCloseListTable dataCloseList={filteredData} loading={loading} />
                    </>
                )}

            </div>
        </div>

    );
};

export default RepairCloseList;
