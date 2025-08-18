import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";

const Modal_setting_doc_repair = ({ isOpen, onClose }) => {
    const [prefix, setPrefix] = useState("");
    const [sequence, setSequence] = useState("4"); // จำนวนหลัก
    const [resetType, setResetType] = useState("none");
    const [dateFormat, setDateFormat] = useState("");
    const [formatPreview, setFormatPreview] = useState("");

    // ฟังก์ชันสร้างตัวอย่าง SEQ เช่น 0001
    const generateSequencePreview = (length) => {
        return "1".padStart(length, "0");
    };

    const updatePreview = (newPrefix, newFormat, seqLength) => {
        const previewSeq = generateSequencePreview(Number(seqLength) || 1);
        const format = newFormat.replaceAll("/", "");
        setFormatPreview(`${newPrefix}-${format}-${previewSeq}`);
    };

    const handleDateFormatChange = (format) => {
        setDateFormat(format);
        updatePreview(prefix, format, sequence);
    };

    const handlePrefixChange = (value) => {
        setPrefix(value);
        updatePreview(value, dateFormat, sequence);
    };

    const handleSequenceChange = (value) => {
        setSequence(value);
        updatePreview(prefix, dateFormat, value);
    };

    const fetchSetting = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/setting_doc_repair`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            // สมมุติ response.data เป็น array ให้ดึง object ตัวแรกมาใช้
            if (Array.isArray(response.data) && response.data.length > 0) {
                const firstSetting = response.data[0];
                setPrefix(firstSetting.doc_set_prefix || "");
                setSequence(firstSetting.seq_number || "4");
                setDateFormat(firstSetting.date_part || "");
                setResetType(firstSetting.reset_type || "none");

                updatePreview(
                    firstSetting.doc_set_prefix || "",
                    firstSetting.date_part || "",
                    firstSetting.seq_number || "4"
                );
            } else if (typeof response.data === "object" && response.data !== null) {
                // กรณี response.data เป็น object เลย
                setPrefix(response.data.doc_set_prefix || "");
                setSequence(response.data.seq_number || "4");
                setDateFormat(response.data.date_part || "");
                setResetType(response.data.reset_type || "none");

                updatePreview(
                    response.data.doc_set_prefix || "",
                    response.data.date_part || "",
                    response.data.seq_number || "4"
                );
            }
        } catch (error) {
            console.error("Error fetching parts:", error);
        }
    };

    useEffect(() => {
        fetchSetting();
    }, []);

    const handleSaveSetting = async () => {
        try {
            const response = await axios.put(
                `${apiUrl}/api/setting_doc_repair_update`,
                {
                    doc_set_prefix: prefix,
                    seq_number: sequence,
                    reset_type: resetType,
                    date_part: dateFormat,
                }, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                  }
            );
            alert("บันทึกเรียบร้อยแล้ว");
            onClose(); // ปิด modal ถ้าต้องการ

        } catch (error) {
            console.error("Error updating setting:", error);
            alert("เกิดข้อผิดพลาดในการบันทึก");
        }
    }

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="Manage Vehicle Status"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "1100px",
                    maxHeight: "100%",
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
            {/* Header */}
            <div
                className="modal-header"
                style={{
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
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
                    <i className="bi bi-gear-fill"></i> ตั้งค่างานแจ้งซ่อมบำรุงงานรถ
                </h5>
            </div>

            <div className="container mt-3">
                <div className="col-md-3 mb-3">
                    <label className="form-label">รูปแบบที่ได้</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formatPreview}
                        disabled
                    />
                </div>

                <div className="row g-2 align-items-end">
                    <div className="col-md-2">
                        <label className="form-label">อักษรย่อ</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            value={prefix}
                            onChange={(e) => handlePrefixChange(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">รูปแบบวันที่</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            value={dateFormat}
                            onChange={(e) => handleDateFormatChange(e.target.value)}
                            disabled
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">จำนวนหลักเลขลำดับ</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            value={sequence}
                            onChange={(e) => handleSequenceChange(e.target.value)}
                            min="1"
                            max="10"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">รีเซตเลขใหม่ตอนไหน</label>
                        <select
                            className="form-select form-select-sm"
                            value={resetType}
                            onChange={(e) => setResetType(e.target.value)}
                        >
                            <option value="none">ไม่มี</option>
                            <option value="daily">ทุกวัน</option>
                            <option value="monthly">ทุกเดือน</option>
                            <option value="yearly">ทุกปี</option>
                        </select>
                    </div>
                </div>

                <div className="mt-3 mb-3">
                    <label className="form-label fw-bold">เลือกรูปแบบวันที่</label>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                        {[
                            "dd/mm/yyyy",
                            "mm/yyyy",
                            "dd/yyyy",
                            "yyyy/mm/dd",
                            "mm/dd",
                            "yyyy/dd",
                            "yyyy/mm",
                            "mm/yyyy/dd",
                        ].map((format) => (
                            <button
                                key={format}
                                type="button"
                                className={`btn btn-sm ${dateFormat === format
                                        ? "btn-primary"
                                        : "btn-outline-secondary"
                                    }`}
                                onClick={() => handleDateFormatChange(format)}
                            >
                                {format}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-lg p-3">
                    <button className="btn btn-primary" type="supmit" onClick={handleSaveSetting}>บันทึก</button>
                </div>
            </div>
        </ReactModal>
    );
};

export default Modal_setting_doc_repair;
