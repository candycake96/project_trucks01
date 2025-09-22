import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import '../Repair/MainternanceAnalysisApprover.css';

const MainternanceAnalysisApprover = ({ maintenanceJob, onSaved }) => {

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // ดึงข้อมูลผู้ใช้จาก localStorage
    const [user, setUser] = useState(null);  //token
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const [isEditing, setIsEditing] = useState(false);


    const [isAnalysisApprover, setAnalysisApprover] = useState([]);
    const [isDataApprover, setDataApprover] = useState({
        analysis_id: "",
        approver_emp_id: "",
        approver_name: "",
        // position: "",
        approval_status: "",
        approval_date: "",
        remark: "",
    });

    // เพิ่ม state สำหรับใบเสนอราคาแบบ array
    const [quotations, setQuotations] = useState([
        {
            quotation_id: "",
            vendor_id: "",
            garage_name: "",
            quotation_date: "",
            quotation_file: null,
            note: "",
            is_selected: false,
            quotation_vat: "",
            vendor_name: "",
            parts: [
                { item_id: "", request_id: "", parts_used_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "", is_approved_part: false }
            ],
        }
    ]);

    useEffect(() => {
        setDataApprover({
            request_id: maintenanceJob?.request_id,
            approver_emp_id: user?.id_emp,
            approver_name: `${user?.fname || ""} ${user?.lname || ""}`,
        });
    }, [maintenanceJob, user]);



    const fetchAnalysisDataApprover = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/ananlysis_approver_show/${maintenanceJob?.request_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setAnalysisApprover(response.data);
        } catch (error) {
            console.error("Error fetching vehicle data:", error);
        }
    };

    useEffect(() => {
        fetchAnalysisDataApprover();
    },
        []);

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


    useEffect(() => {
        if (isAnalysisApprover?.quotations) {
            // สมมติ apiUrl คือ base url ของไฟล์
            const fileBaseUrl = `${apiUrl}/uploads/quotation_files/`;

            const mapped = isAnalysisApprover.quotations.map(q => ({
                quotation_id: q.quotation_id,
                vendor_id: q.vendor_id,
                garage_name: q.garage_name || "",
                quotation_date: q.quotation_date ? q.quotation_date.slice(0, 10) : "",
                quotation_file: q.quotation_file ? fileBaseUrl + q.quotation_file : "",
                note: q.note || "",
                is_selected: !!q.is_selected,
                quotation_vat: q.quotation_vat ?? "",
                vendor_name: q.vendor_name || "",
                parts: (q.parts || []).map(p => ({
                    item_id: p.item_id,
                    quotation_parts_id: p.quotation_parts_id,
                    request_id: p.request_id || "",
                    parts_used_id: p.parts_used_id || "",
                    part_id: p.part_id,
                    system_name: p.system_name || "",
                    part_name: p.part_name,
                    price: p.part_price,
                    unit: p.part_unit,
                    maintenance_type: p.maintenance_type,
                    qty: p.part_qty,
                    discount: p.part_discount,
                    vat: p.part_vat,
                    total: "", // จะคำนวณในฟังก์ชัน handleChange/calculateSummary
                    is_approved_part: !!p.is_approved_part,
                })),
            }));

            setQuotations(mapped);
        }
    }, [isAnalysisApprover]);

    // input Analysis
    const handleDataAnalysis = (index, field, value) => {
        setDataApprover(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated; // ต้อง return ค่าใหม่
        });
    }

    const handleDataApprover = (field, value) => {
        setDataApprover(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // ฟังก์ชันเปลี่ยนแปลงข้อมูลใบเสนอราคา
    const handleQuotationChange = (index, field, value) => {
        if (!isEditing) return;
        setQuotations(prev => {
            const updated = [...prev];
            if (field === 'quotation_file') {
                updated[index][field] = value; // อาจเป็น File หรือ string
            } else {
                updated[index][field] = value;
            }
            return updated;
        });
    };


    const handleChange = (quotationIndex, partIndex, field, value) => {
        const updatedQuotations = [...quotations];
        const part = updatedQuotations[quotationIndex].parts[partIndex];
        console.log("CLICKED:", quotationIndex, partIndex, field, value);

        // ถ้า field คือ is_approved_part ให้แปลงเป็น boolean
        if (field === "is_approved_part") {
            part[field] = !!value;
        } else {
            part[field] = value;
        }

        const price = parseFloat(part.price) || 0;
        const qty = parseFloat(part.qty) || 0;
        const vat = parseFloat(part.vat) || 0;
        const discount = parseFloat(part.discount) || 0;

        // หักส่วนลดก่อนคิด VAT
        const subtotal = price * qty - discount;
        const vatVal = subtotal * vat / 100;
        const total = subtotal + vatVal;

        part.total = total.toFixed(2);

        setQuotations(updatedQuotations);
    };



    // ฟังก์ชันคำนวณสรุปราคารวมของอะไหล่ในใบเสนอราคา
    const calculateSummary = (parts, quotation_vat) => {
        let total = 0;
        let vatAmountPerItem = 0;

        parts.forEach((part) => {
            const price = parseFloat(part.price) || 0;
            const qty = parseFloat(part.qty) || 0;
            const vat = parseFloat(part.vat) || 0;
            const discount = parseFloat(part.discount) || 0;

            // หักส่วนลดออกจาก subtotal
            const subtotal = price * qty - discount;
            const vatVal = subtotal * vat / 100;

            total += subtotal;
            vatAmountPerItem += vatVal;
        });

        const vatRate = parseFloat(quotation_vat) || 0;
        const extraVat = total * vatRate / 100;

        const vatAmount = vatAmountPerItem + extraVat;

        return {
            total: total.toFixed(2),
            vat: vatAmount.toFixed(2),
            grandTotal: (total + vatAmount).toFixed(2),
        };
    };


    const handleApprovalPass = async (e) => {
        e.preventDefault();
        try {
            // ตรวจสอบข้อมูลผู้อนุมัติ
            if (
                !isDataApprover.approver_emp_id ||
                !isDataApprover.approver_name
            ) {
                alert("กรุณากรอกข้อมูลผู้อนุมัติให้ครบถ้วน...");
                return;
            }

            // เตรียมข้อมูลที่จะส่ง
            const payload = {
                approver: isDataApprover,
                quotations: quotations
            };


            // เรียก API
            const response = await axios.put(
                `${apiUrl}/api/analysis_approver_save/${user?.id_emp}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // แสดงผลลัพธ์
            if (response.status === 200) {
                alert("✅ อนุมัติสำเร็จ!");
                console.log("Response:", response.data);
                setMessage(response.data.message);
                setMessageType("success");
                 if (onSaved) {
                                onSaved(response.data.data); // API ควรส่งข้อมูลใหม่ของ analysis
                            }
            } else {
                alert("❌ ไม่สามารถอนุมัติได้");
            }

        } catch (error) {
            console.error("❌ Error:", error);
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            setMessage("เกิดข้อผิดพลาด");
            setMessageType("error");
        }
    };


    return (
        <>
            <div className="md-2">
                <div className="">

                    {message && (
                        <div
                            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                        >
                            {message}
                        </div>
                    )}

                    <div>
                        <form id="approval-form" action="" onSubmit={handleApprovalPass}>
                            <div className="">

                                <div className="">
                                    <div className="row mb-2">
                                        <div className="col-lg-3 mb-2">
                                            <label className="form-label">ผู้อนุมัติผลตรวจ</label>
                                            <div className="input-group "     >
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="approver_name"
                                                    value={isDataApprover?.approver_name || ""}
                                                    onChange={e => handleDataApprover('approver_name', e.target.value)}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 mb-2">
                                            <label className="form-label">วันที่ทำการอนุมัติผลตรวจ</label>
                                            <div className="input-group "     >
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    //  value={new Date().toISOString().slice(0, 10)}
                                                    value={isDataApprover?.approval_date}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mb-4">
                                            <label className="form-label">หมายเหตุ</label>
                                            <div className="input-group "     >
                                                <textarea
                                                    type="date"
                                                    className="form-control"
                                                    value={isDataApprover?.remark}
                                                    onChange={e => handleDataApprover('remark', e.target.value)}
                                                />

                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {quotations.map((q, idx) => (
                                    <div key={idx} className="mb-4 border rounded p-3">
                                        <div className="row mb-2">
                                            <div className="col-lg-5">
                                                <p className="fw-bolder">ใบเสนอราคาที่ {idx + 1}
                                                    <strong className="ms-2">

                                                    </strong>
                                                </p>
                                            </div>
                                            <div className="col-lg-2 mb-2">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`is_selected_${idx}`}
                                                        name={`is_selected`}
                                                        checked={q.is_selected}
                                                        onChange={e => handleQuotationChange(idx, 'is_selected', e.target.checked)}
                                                    />
                                                    <label
                                                        className={`form-check-label ${q.is_selected ? 'font-bold text-black' : 'text-gray-400'}`}
                                                        htmlFor={`is_selected_${idx}`}
                                                    >
                                                        เลือกใช้งาน
                                                    </label>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-3 mb-3">
                                                <label className="form-label">ชื่ออู่/ร้านค้า</label>
                                                <div className="input-group input-group-sm"     >
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={q.vendor_name}
                                                        onChange={e => handleQuotationChange(idx, "vendor_name", e.target.value)}
                                                        disabled={!isEditing}
                                                    />
                                                    <button className="btn btn-outline-secondary" type="button" >
                                                        <i className="bi bi-search"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="col-lg-3 mb-3">
                                                <label className="form-label">วันที่สร้างใบเสนอราคา</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={q.quotation_date}
                                                    onChange={e => handleQuotationChange(idx, "quotation_date", e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label className="form-label">เอกสารแนบ</label>
                                                {isEditing && (
                                                    <input
                                                        type="file"
                                                        className="form-control form-control-sm mb-2"
                                                        onChange={e => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                handleQuotationChange(idx, 'quotation_file', file);
                                                            }
                                                        }}
                                                    />
                                                )}
                                                {/* แสดงชื่อไฟล์ใหม่ที่เลือก */}
                                                {isEditing && q.quotation_file instanceof File && (
                                                    <div className="mb-2 text-success">
                                                        <i className="bi bi-file-earmark-arrow-up me-1"></i>
                                                        ไฟล์ใหม่: {q.quotation_file.name}
                                                    </div>
                                                )}
                                                {/* แสดงปุ่มดาวน์โหลดไฟล์เดิม */}
                                                {!isEditing && typeof q.quotation_file === "string" && q.quotation_file ? (
                                                    <div className="mb-2">
                                                        <a
                                                            href={q.quotation_file}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-primary"
                                                            download
                                                        >
                                                            <i className="bi bi-download me-1"></i>
                                                            ดาวน์โหลด: {q.quotation_file.split("/").pop()}
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p>ไม่มีเอกสารแนบ</p>
                                                    </>
                                                )}
                                            </div>

                                        </div>
                                        <div className="col-lg mb-3">
                                            <label className="form-label">หมายเหตุ</label>
                                            <textarea
                                                className="form-control"
                                                rows={2}
                                                value={q.note}
                                                onChange={e => handleQuotationChange(idx, "note", e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)"
                                            ></textarea>
                                        </div>
<div style={{ overflowX: "auto" }}>
  {q.parts.map((part, partIdx) => (
    <div className="part-row mb-2" key={partIdx}>
      <input type="hidden" value={part.part_id} readOnly />

      <div className="part-col">
        <label className="form-label compact-label">ระบบ</label>
        <input
          type="text"
          className="form-control form-control-sm compact-input"
          value={part.system_name}
          onChange={e => handleChange(idx, partIdx, "system_name", e.target.value)}
          disabled
        />
      </div>

      <div className="part-col" style={{ minWidth: "180px" }}>
        <label className="form-label compact-label">อะไหล่ <span style={{ color: "red" }}>*</span></label>
        <div className="input-group input-group-sm">
          <input
            type="text"
            className="form-control compact-input"
            value={part.part_name}
            onChange={e => handleChange(idx, partIdx, "part_name", e.target.value)}
            disabled={!isEditing}
            placeholder="ค้นหาอะไหล่..."
          />
          <button
            className="btn btn-outline-secondary btn-sm"
            type="button"
            disabled={!isEditing}
          >
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>

      <div className="part-col">
        <label className="form-label compact-label">ประเภท *</label>
        <select
          className="form-select form-select-sm compact-select"
          value={part.maintenance_type}
          onChange={e => handleChange(idx, partIdx, "maintenance_type", e.target.value)}
          disabled={!isEditing}
        >
          <option value=""></option>
          <option value="CM">CM</option>
          <option value="PM">PM</option>
        </select>
      </div>

      <div className="part-col">
        <label className="form-label compact-label">ตัดรอบ PM *</label>
        <select
          className="form-select form-select-sm compact-select"
          value={part.item_id}
          onChange={(e) => handleChange(idx, partIdx, "item_id", e.target.value)}
          disabled={!isEditing}
        >
          <option value=""></option>
          {dataItem.map((row, ndx) => (
            <option value={row.item_id} key={ndx}>{row.item_name}</option>
          ))}
          <option value="อื่นๆ">อื่นๆ</option>
        </select>
      </div>

      <div className="part-col">
        <label className="form-label compact-label">ราคา *</label>
        <input
          type="number"
          className="form-control form-control-sm compact-input"
          value={part.price}
          onChange={e => handleChange(idx, partIdx, "price", e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="part-col">
        <label className="form-label compact-label">หน่วย *</label>
        <input
          type="text"
          className="form-control form-control-sm compact-input"
          value={part.unit}
          onChange={e => handleChange(idx, partIdx, "unit", e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="part-col">
        <label className="form-label compact-label">จำนวน *</label>
        <input
          type="number"
          className="form-control form-control-sm compact-input"
          value={part.qty}
          onChange={e => handleChange(idx, partIdx, "qty", e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="part-col">
        <label className="form-label compact-label">ส่วนลด</label>
        <input
          type="number"
          className="form-control form-control-sm compact-input"
          value={part.discount || ""}
          onChange={e => handleChange(idx, partIdx, "discount", e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="part-col" style={{ width: "60px" }}>
        <label className="form-label compact-label">VAT%</label>
        <input
          type="number"
          className="form-control form-control-sm compact-input"
          value={part.vat}
          onChange={e => handleChange(idx, partIdx, "vat", e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="part-col" style={{ width: "100px" }}>
        <label className="form-label compact-label">ราคารวม</label>
        <input
          type="number"
          className="form-control form-control-sm compact-input"
          value={part.total || ""}
          disabled
        />
      </div>

      <div className="part-col d-flex align-items-center">
        <input
          type="checkbox"
          className="form-check-input"
          checked={!!part.is_approved_part}
          onChange={e => handleChange(idx, partIdx, "is_approved_part", e.target.checked)}
          style={{
            boxShadow: '0 0 5px #0000FF',
            borderRadius: '4px',
            padding: '8px',
            outline: 'none',
          }}
        />
      </div>
    </div>
  ))}

  {isEditing && (
    <div className="d-flex justify-content-end mb-3">
      <button
        className="btn btn-outline-primary"
        type="button"
        disabled={!isEditing}
      >
        เพิ่มรายการอะไหล่ <i className="bi bi-plus-square-fill"></i>
      </button>
    </div>
  )}
</div>


                                        <div className="text-end">
                                            {(() => {
                                                // คำนวณสรุปราคารวมของอะไหล่ในใบเสนอราคา
                                                const summary = calculateSummary(q.parts, q.quotation_vat);


                                                return (
                                                    <div className="bg-white rounded-lg p-3 w-full max-w-xs ml-auto">
                                                        <div className="space-y-1 text-right">
                                                            <p className="text-gray-700 text-sm">
                                                                ราคารวม <span className="font-medium text-black">{summary.total}</span> บาท
                                                            </p>

                                                            <p className="text-gray-700 text-sm">
                                                                ส่วนลด <span className="font-medium text-black">0.00</span> บาท
                                                            </p>

                                                            <p className="text-gray-700 text-sm">
                                                                ภาษีมูลค่าเพิ่ม <span className="font-medium text-black">{summary.vat}</span> บาท
                                                            </p>

                                                            <div className="col-lg d-flex align-items-center justify-content-end">
                                                                <label className="form-label text-sm mb-0 me-2">VAT จากยอดรวม </label>
                                                                <input
                                                                    type="number"
                                                                    name="quotation_vat"
                                                                    className="form-control form-control-sm me-2"
                                                                    style={{ width: "100px" }}
                                                                    value={q.quotation_vat || ""}
                                                                    onChange={e => handleQuotationChange(idx, "quotation_vat", e.target.value)}
                                                                    placeholder="0"
                                                                    disabled={!isEditing}
                                                                />
                                                                <p className="fw-bolder me-2">(%)</p>
                                                            </div>

                                                            <p className="text-gray-900 text-sm font-semibold border-t pt-1">
                                                                ราคารวมสุทธิ <span className="text-green-600">{summary.grandTotal}</span> บาท (รวมภาษีแล้ว)
                                                            </p>
                                                            <p className="text-gray-900 text-sm font-semibold border-t pt-1"></p>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        {/* <hr className="mb-3" /> */}
                                    </div>
                                ))}

                                {/* // ในปุ่ม */}
                                {/* // ...existing code... */}
                                <div className="mb-3">
                                    <label className="form-label">สถานะการอนุมัติ</label>
                                    <div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="approval_status"
                                                id="approved"
                                                value="approved"
                                                checked={isDataApprover.approval_status === "approved"}
                                                onChange={e => setDataApprover(prev => ({ ...prev, approval_status: e.target.value }))}
                                            />
                                            <label className="form-check-label" htmlFor="approved">อนุมัติ</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="approval_status"
                                                id="rejected"
                                                value="rejected"
                                                checked={isDataApprover.approval_status === "rejected"}
                                                onChange={e => setDataApprover(prev => ({ ...prev, approval_status: e.target.value }))}
                                            />
                                            <label className="form-check-label" htmlFor="rejected">ไม่อนุมัติ</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="approval_status"
                                                id="revise"
                                                value="revise"
                                                checked={isDataApprover.approval_status === "revise"}
                                                onChange={e => setDataApprover(prev => ({ ...prev, approval_status: e.target.value }))}
                                            />
                                            <label className="form-check-label" htmlFor="revise">ส่งกลับแก้ไข</label>
                                        </div>
                                    </div>
                                </div>
                                {/* // ...existing code... */}
                                <div className="text-center">
                                    <button
                                        className="btn btn-primary w-25"
                                        type="submit"
                                        style={{ minWidth: 120 }}
                                    >
                                        อนุมัติ
                                    </button>
                                </div>

                                {/* // ...existing code... */}

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}


export default MainternanceAnalysisApprover;