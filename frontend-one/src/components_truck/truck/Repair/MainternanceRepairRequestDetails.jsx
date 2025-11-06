import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../../config/apiConfig";

const MainternanceRepairRequestDetails = ({ parts, summary, formData, user, permissions }) => {
    // ฟังก์ชันแปลงวันที่ให้อยู่ในรูปแบบ yyyy-mm-dd
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const dataRepairID = formData;

    const [dataItem, setDataItem] = useState([]);

    const fetchDataItem = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/setting_mainternance_item_show`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setDataItem(response.data);
        } catch (error) {
            console.error("Error fetching parts:", error);
        }
    };

    useEffect(() => {
        fetchDataItem();
    }, []);




    return (
        <>
            <div className=" mb-3">
                <div className="">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="mb-0 fw-bold text-dark ">รายการเปิดงานซ่อมบำรุง </p>
                        {/* {formData?.status !== ''} 
                        {formData?.request_informer_emp_id === user?.id_emp && (
                            <Link
                                to="/truck/RepairRequestFormEdit"
                                state={dataRepairID}
                                className="btn btn-success btn-sm"
                            >
                                <i className="bi bi-pencil-fill me-1"></i> แก้ไข
                            </Link>
                        )} */}
                        {formData?.request_informer_emp_id === user?.id_emp && (
                            <>
                                {/* ถ้าได้รับการอนุมัติจากผู้จัดการแล้ว */}
                                {["ผู้จัดการอนุมัติ", "ใบแจ้งหนี้"].includes(formData?.status) ? (
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        disabled
                                        title="ไม่สามารถแก้ไขได้เนื่องจากผู้จัดการอนุมัติแล้ว"
                                    >
                                        <i className="bi bi-lock-fill me-1"></i> แก้ไขไม่ได้
                                    </button>
                                ) : formData?.status === 'รอคำขอแก้ไขหลังอนุมัติ' ? (
                                    <button className="btn btn-warning btn-sm" disabled>
                                        <i className="bi bi-hourglass-split me-1"></i> รออนุมัติคำขอแก้ไข
                                    </button>
                                ) : (
                                    // ปุ่มแก้ไขปกติ
                                    <Link
                                        to="/truck/RepairRequestFormEdit"
                                        state={dataRepairID}
                                        className="btn btn-success btn-sm"
                                    >
                                        <i className="bi bi-pencil-fill me-1"></i> แก้ไข
                                    </Link>
                                )}
                            </>
                        )}

                    </div>

                    <form>
                        <div className="row">
                            <div className="col-lg-3 mb-3">
                                <label className="form-label">เลขที่ใบแจ้งซ่อม </label>
                                <input type="text" className="form-control" value={formData?.request_no || ""} disabled />
                            </div>
                            <div className="col-lg-3 mb-3">
                                <label className="form-label">วันที่แจ้ง</label>
                                <input type="date" className="form-control" value={formatDate(formData?.request_date)} disabled />
                            </div>
                            <div className="col-lg-3 mb-3">
                                <label className="form-label">ผู้แจ้ง</label>
                                <input type="text" className="form-control" value={`${formData?.fname || ""} ${formData?.lname || ""}`} disabled />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 mb-3">
                                <label className="form-label">ทะเบียนรถ <span style={{ color: "red" }}>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="reg_number"
                                    value={formData?.reg_number || ""}
                                    disabled
                                />
                            </div>
                            <div className="col-lg-3 mb-3">
                                <label className="form-label">เลขไมล์ปัจจุบัน <span style={{ color: "red" }}>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="odometer"
                                    value={formData?.car_mileage || ""}
                                    disabled
                                />
                            </div>
                        </div>

                        <hr />

                        <div style={{ overflowX: "auto" }}>
                            {parts.map((part, index) => (
                                <div className="row g-2 align-items-center mb-3" key={index}>
                                    <input type="hidden" value={part.part_id} readOnly />
                                    <div className="col-lg-1">
                                        <label className="form-label text-sm mb-0">ระบบ</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={part.system_name}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <label className="form-label text-sm mb-0">อะไหล่ <span style={{ color: "red" }}>*</span></label>
                                        <div className="input-group input-group-sm">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={part.part_name}
                                                placeholder="ค้นหาอะไหล่..."
                                                disabled
                                            />
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                type="button"
                                                disabled
                                            >
                                                <i className="bi bi-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-lg-1">
                                        <label className="form-label text-sm mb-0">ประเภท <span style={{ color: "red" }}>*</span></label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={part.maintenance_type}
                                            disabled
                                        >
                                            <option value=""></option>
                                            <option value="CM">CM</option>
                                            <option value="PM">PM</option>
                                        </select>
                                    </div>


                                    <div className="col-lg-2">
                                        <label className="form-label text-sm">ตัดรอบ PM <span className="" style={{ color: "red" }}>*</span></label>
                                        <select
                                            className="form-select  mb-3  form-select-sm"
                                            aria-label="Large select example"
                                            value={part.item_id || ''}
                                            disabled
                                        // onChange={(e) => handleChange(index, "item_id", e.target.value)}
                                        >
                                            <option value=""></option>
                                            {dataItem.map((row, ndx) => (
                                                <option value={row.item_id} key={ndx}> {row.item_name}</option>
                                            ))}
                                            <option value="อื่นๆ">อื่นๆ</option>
                                        </select>
                                    </div>

                                    <div className="col-lg-1">
                                        <label className="form-label text-sm mb-0">ราคา <span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={part.price}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-lg-1">
                                        <label className="form-label text-sm mb-0">หน่วย <span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={part.unit}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-lg-1">
                                        <label className="form-label text-sm mb-0">จำนวน <span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={part.qty}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-lg-1">
                                        <label className="form-label text-sm mb-0">VAT %</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={part.vat}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <label className="form-label text-sm mb-0">ราคารวม</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={part.total || ""}
                                            disabled
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="mb-3" />

                        <div className="bg-white rounded-lg p-3 w-full max-w-xs ml-auto">
                            <div className="space-y-1 text-right">
                                <p className="text-gray-700 text-sm">
                                    ราคารวม <span className="font-medium text-black">{summary.total}</span> บาท
                                </p>
                                <p className="text-gray-700 text-sm">
                                    ภาษีมูลค่าเพิ่ม <span className="font-medium text-black">{summary.vat}</span> บาท
                                </p>
                                <p className="text-gray-900 text-sm font-semibold border-t pt-1">
                                    ราคารวมสุทธิ <span className="text-green-600">{summary.grandTotal}</span> บาท (รวมภาษีแล้ว)
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default MainternanceRepairRequestDetails;