import React, { useEffect, useState } from "react";
import AnalysisApprover_table from "./AnalysisApprover_table";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";
import MainternanceInvoice_table from "./MainternanceInvoice_table";
import Modal_Invoice_add from "./Mobal/Modal_Invoice_add";
import Modal_setting_doc_invoice from "./Mobal/Modal_setting_doc_invoice";

const MainternanceInvoice_main = () => {
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
        endpoint = "/api/invoice_show_table";
    } else if (filterType === "approved") { 
        endpoint = "/api/invoice_show_table_approval";
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

    const [isOpenModalInvoiceAdd, setOpenModalInvoiceAdd] = useState(false);
    const [dataOpenModalInvoiceAdd, setDataOpenModalInvoiceAdd] = useState(null);
    const handleOpenModalInvoiceAdd = (data) => {
        setOpenModalInvoiceAdd(true);
        setDataOpenModalInvoiceAdd(data);
    };
    const handleClonseModalInvoiceAdd = () => {
        setOpenModalInvoiceAdd(false);
        setDataOpenModalInvoiceAdd(null);
    };

    const [isOpenModalSettingInvoice, setOpenModalSettingInvoice] = useState(false);
    const [dataOpenModalSettingInvoice, setDataOpenModalSettingInvoice] = useState(null);
    const handleOpenModalSettingInvoice = (data) => {
        setOpenModalSettingInvoice(true);
    };
    const handleClonseModalSettingInvoice = () => {
        setOpenModalSettingInvoice(false);
    };

    return (
        <div className="container py-3">
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h5 className="fw-bold text-primary mb-1">ใบแจ้งหนี้</h5>
                        <p className="text-muted mb-0">
                            รายงานใบแจ้งหนี้
                        </p>
                    </div>
                    <div className="" role="">
                        <button
                            className={`btn btn-sm btn-outline-success me-1`}
                            onClick={() => handleOpenModalInvoiceAdd()}
                        >
                            <i className="bi bi-clock me-1"></i> เพิ่มใบแจ้งหนี้
                        </button>
                        <button
                            className={`btn btn-sm btn-outline-success`}
                            onClick={() => handleOpenModalSettingInvoice()}
                        >
                            <i class="bi bi-gear"></i> ตั้งค่า
                        </button>

                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <div className="btn-group" role="group">
                        <button
                            className={`btn btn-sm ${filterType === "pending" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setFilterType("pending")}
                        >
                            <i className="bi bi-clock me-1"></i> รออนุมัติใบแจ้งหนี้
                        </button>
                        <button
                            className={`btn btn-sm ${filterType === "approved" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setFilterType("approved")}
                        >
                            <i className="bi bi-check2-circle me-1"></i> อนุมัติแล้ว
                        </button>
                        {/* <button
                            className={`btn btn-sm ${filterType === "finished" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setFilterType("finished")}
                        >
                            <i className="bi bi-archive me-1"></i> ประวัติงานที่จบ
                        </button> */}
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
                    <MainternanceInvoice_table analysisData={filteredData} loading={loading} />
                )}
            </div>

            {isOpenModalInvoiceAdd && (
                <Modal_Invoice_add isOpen={isOpenModalInvoiceAdd} onClose={handleClonseModalInvoiceAdd} />
            )}

            {isOpenModalSettingInvoice && (
                <Modal_setting_doc_invoice isOpen={isOpenModalSettingInvoice} onClose={handleClonseModalSettingInvoice} />
            )}
        </div>
    )
}

export default MainternanceInvoice_main;
