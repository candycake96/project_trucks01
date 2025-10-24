import React, { useEffect, useState, useRef } from "react";
import Modal_quotation_part_details_job from "./Mobal/Modal_quotation_part_details_job";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";
import Modal_show_vehicle_details from "./Mobal/Modal_show_vehicle_details";

const MainternanceInvoice_showEdit = ({ requestId, invoiceID }) => {
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);

    // const location = useLocation();
    // const { requestId } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState({
        remarks: [],  // เก็บ error ของแต่ละ remark
        parts: []     // เก็บ error ของแต่ละ part [remarkIndex][partIndex]
    });


    const [isInvoice, setInvoice] = useState({
        invoice_id: "",
        invoice_no: "",
        request_id: "",
        invoice_date: "",
        invoice_created_emp_id: "",
        status: "",
        invoice_doc: ""
    });



    const [user, setUser] = useState(null);  //token
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        setInvoice({
            invoice_created_emp_id: user?.id_emp,
            request_id: requestId,
            invoice_date: new Date().toISOString()
        })
    }, [user, requestId])

    const toBuddhistDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [isRepairMaintenance, setRepairMaintenance] = useState([])

    const fetchRepairMaintenance = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No access token found");
                return;
            }

            const response = await axios.get(`${apiUrl}/api/approval_shows_id/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setRepairMaintenance(response.data);
        } catch (error) {
            console.error("Error fetching detailscartype:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status);
                console.error("Response Data:", error.response.data);
            }
        }
    };

    useEffect(() => {
        fetchRepairMaintenance();
    }, [requestId]);

    const dataRequest = isRepairMaintenance.length > 0 ? isRepairMaintenance[0] : null;


    const [remarks, setRemarks] = useState([
        {
            invoice_section_id: "",
            remark: "",
            parts: [{ invoice_parts_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" }]
        }
    ]);

    // เพิ่มหมายเหตุใหม่
    const addRemark = () => {
        setRemarks([...remarks, {
            invoice_section_id: "",
            remark: "",
            parts: [{ invoice_parts_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" }]
        }]);
    };

    // เพิ่มอะไหล่ภายใต้หมายเหตุ
    const addPart = (index) => {
        const newRemarks = [...remarks];
        newRemarks[index].parts.push({ invoice_parts_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" });
        setRemarks(newRemarks);
    };

    // เปลี่ยนค่าช่อง input
    const handleChangeRemark = (index, value) => {
        const newRemarks = [...remarks];
        newRemarks[index].remark = value;
        setRemarks(newRemarks);
    };

    const handleChangePart = (remarkIndex, partIndex, field, value) => {
        const newRemarks = [...remarks];
        newRemarks[remarkIndex].parts[partIndex][field] = value;
        setRemarks(newRemarks);
    };



    // ฟังก์ชันแปลงวันที่เป็น dd/mm/yyyy
    function formatDateDMY(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }


    // ฟังก์ชันแปลงเวลา ISO เป็น HH:MM 
    function formatTimeHM(timeString) {
        if (!timeString) return "-";
        // รองรับทั้ง "HH:MM:SS", "HH:MM" และ "1970-01-01T11:53:00.000Z"
        if (timeString.includes("T")) {
            // กรณีเป็น ISO string
            const date = new Date(timeString);
            if (isNaN(date)) return "-";
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
        }
        // กรณีเป็น HH:MM:SS หรือ HH:MM
        return timeString.length >= 5 ? timeString.substring(0, 5) : timeString;
    }


    const [isOpenModalQtationPart, setOpenModalQtationPart] = useState(false);
    const [dataOpenModalQtationPart, setDataOpenModalQtationPart] = useState(null);
    // ======= เปิด Modal =======
    const handleOpenModalQtationPart = (remarkIndex, partIndex) => {
        setOpenModalQtationPart(true);
        setDataOpenModalQtationPart({ remarkIndex, partIndex });
    };

    const handleClonseModalQtationPart = () => {
        setOpenModalQtationPart(false);
        setDataOpenModalQtationPart(null);
    };

    const [selectedParts, setSelectedParts] = useState([]);
    // ======= รับข้อมูลจาก Modal =======
    const handleDataFromAddModal = (remarkIndex, partIndex, data) => {
        setRemarks(prev => {
            const updated = [...prev];
            updated[remarkIndex].parts[partIndex] = {
                ...updated[remarkIndex].parts[partIndex],
                invoice_parts_id: Number(data.invoice_parts_id) || 0,
                part_id: data.part_id,
                system: data.system_name,
                name: data.part_name,
                type: data.maintenance_type,
                qty: Number(data.part_qty) || 0,
                price: Number(data.part_price) || 0,
                vat: Number(data.part_vat) || 0,
                discount: Number(data.part_discount) || 0,
                unit: data.part_unit,
                total: (Number(data.part_qty) * Number(data.part_price) - Number(data.part_discount))
                    + ((Number(data.part_qty) * Number(data.part_price) - Number(data.part_discount)) * Number(data.part_vat) / 100)
            };



            return updated;
        });
        setSelectedParts(prev => [...prev, data]);
        setOpenModalQtationPart(false);
    };


    // ปุ่มถังขยะ
    const handleDeletePart = (remarkIndex, partIndex) => {
        const partToDelete = remarks[remarkIndex].parts[partIndex];

        // เอา part ออกจาก selectedParts ก่อน
        setSelectedParts(prevSelected =>
            prevSelected.filter(p => p.invoice_parts_id !== partToDelete.invoice_parts_id)
        );

        // ลบ part ออกจาก remarks
        setRemarks(prevRemarks =>
            prevRemarks.map((remark, rIndex) => {
                if (rIndex === remarkIndex) {
                    return {
                        ...remark,
                        parts: remark.parts.filter((_, pIndex) => pIndex !== partIndex)
                    };
                }
                return remark;
            })
        );
    };


    // ฟังก์ชันลบ remark 
    const handleDeleteRemark = (remarkIndex) => {
        const remarkToDelete = remarks[remarkIndex];

        // เอา part ทั้งหมดออกจาก selectedParts
        setSelectedParts(prevSelected =>
            prevSelected.filter(
                p => !remarkToDelete.parts.some(dp => dp.invoice_parts_id === p.invoice_parts_id)
            )
        );

        // ลบ remark
        setRemarks(prevRemarks =>
            prevRemarks.filter((_, index) => index !== remarkIndex)
        );
    };



    // ฟังก์ชันคำนวณราคารวม
    const calculateTotals = () => {
        let totalPrice = 0;
        let totalVat = 0;

        remarks.forEach((remark) => {
            remark.parts.forEach((part) => {
                const qty = Number(part.qty) || 0;
                const price = Number(part.price) || 0;
                const discount = Number(part.discount) || 0;
                const vat = Number(part.vat) || 0;

                const partTotal = qty * price - discount;
                totalPrice += partTotal;
                totalVat += (partTotal * vat) / 100;
            });
        });

        const grandTotal = totalPrice + totalVat;

        return {
            totalPrice,
            totalVat,
            grandTotal,
        };
    };

    const { totalPrice, totalVat, grandTotal } = calculateTotals();

    // ฟังก์ชันนับจำนวนรายการที่ถูกเลือกจริง
    const getPartsSummary = () => {
        // จำนวนรายการทั้งหมด = รวม parts ที่มี invoice_parts_id
        const totalParts = remarks.reduce((sum, remark) => {
            return sum + remark.parts.filter(part => part.invoice_parts_id).length;
        }, 0);

        // จำนวนรายการที่ตัดไปใน invoice = จำนวน selectedParts
        const selectedPartsCount = selectedParts.length;

        return { totalParts, selectedPartsCount };
    };

    const { totalParts, selectedPartsCount } = getPartsSummary();

    // --------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = { remarks: [], parts: [] };
        let hasError = false;

        remarks.forEach((remark, rIdx) => {
            // ตรวจ remark
            newErrors.remarks[rIdx] = !remark.remark.trim();
            if (newErrors.remarks[rIdx]) hasError = true;

            newErrors.parts[rIdx] = [];
            remark.parts.forEach((part, pIdx) => {
                const partError = {
                    system: !part.system?.toString().trim(),
                    name: !part.name?.toString().trim(),
                    type: !part.type?.toString().trim(),
                    qty: !part.qty || Number(part.qty) <= 0,
                    price: !part.price || Number(part.price) <= 0
                };

                if (Object.values(partError).some(v => v)) hasError = true;
                newErrors.parts[rIdx][pIdx] = partError;
            });
        });

        setErrors(newErrors);

        if (hasError) {
            alert("กรุณากรอกข้อมูลหมายเหตุและอะไหล่ให้ครบถ้วน");
            return;
        }



        setErrors(newErrors);

        if (hasError) {
            alert("กรุณากรอกข้อมูลหมายเหตุและอะไหล่ให้ครบถ้วน");
            return;
        }

        // ส่งข้อมูลต่อ
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) return console.error("No access token found");

            const invoiceDataToSend = {
                ...isInvoice,
                sections: remarks.map(remark => ({
                    invoice_section_id: remark.invoice_section_id,
                    note: remark.remark,
                    part: remark.parts.map(part => ({
                        invoice_parts_id: part.invoice_parts_id || "", // ✅ รองรับทั้งสองชื่อ
                        part_id: part.part_id || "",
                        system_name: part.system,
                        part_name: part.name,
                        price: part.price,
                        unit: part.unit || "",
                        maintenance_type: part.type,
                        qty: part.qty,
                        discount: part.discount,
                        vat: part.vat,
                        total: (part.qty * part.price - part.discount) + (part.qty * part.price - part.discount) * part.vat / 100
                    }))
                }))
            };

            const formData = new FormData();
            formData.append("invoice_no", isInvoice.invoice_no);
            formData.append("request_id", isInvoice.request_id);
            formData.append("invoice_date", isInvoice.invoice_date);
            formData.append("invoice_created_emp_id", isInvoice.invoice_created_emp_id);
            formData.append("invoice_sections", JSON.stringify(invoiceDataToSend.sections));

            if (fileInputRef.current?.files?.length > 0) {
                formData.append("invoice_doc", fileInputRef.current.files[0]);
            }
            console.log('test isInvoice Info: ', isInvoice);
            console.log('test sections Info: ', invoiceDataToSend);
            const response = await axios.put(`${apiUrl}/api/invoice_maintenance_update/${isInvoice?.invoice_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Response:", response.data);
            alert("ส่งข้อมูลเรียบร้อย!");
            setIsEditing(false);

        } catch (error) {
            console.error("Error submitting form:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status);
                console.error("Response Data:", error.response.data);
            }
        }
    };
    // -------


    // ฟังก์ชันตรวจสอบเมื่อออกจากช่อง
    const handleBlur = (remarkIndex, value) => {
        setErrors((prev) => ({
            ...prev, // คงค่าที่มีอยู่
            remarks: prev.remarks.map((err, idx) =>
                idx === remarkIndex ? !value.trim() : err
            )
        }));
    };

    // ----------
    const [isOpenModaleVehicleDtail, setOpenModaleVehicleDtail] = useState(false);
    const [dataOpenModaleVehicleDtail, setDataOpenModaleVehicleDtail] = useState(null);
    const handleOpenModaleVehicleDtail = (data) => {
        setOpenModaleVehicleDtail(true);
        setDataOpenModaleVehicleDtail(data);
    };
    const handleClonseModaleVehicleDtail = () => {
        setOpenModaleVehicleDtail(false);
        setDataOpenModaleVehicleDtail(null);
    };



    const generateReport = async () => {
        setLoading(true); // เริ่มโหลด
        try {
            const response = await axios.post(
                `${apiUrl}/api/report-createRepair/${requestId}`,
                {},
                { responseType: 'blob' }
            );

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (error) {
            console.error("Error generating report:", error);
        } finally {
            setLoading(false); // โหลดเสร็จ
        }
    };


    // -------------
    const [isInvoiceData, setInvoiceData] = useState(null)
    useEffect(() => {
        const fetchInvoiceShowId = async () => {
            try {
                if (!invoiceID) return; // ✅ ถ้ายังไม่มี invoiceID จะไม่ fetch
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.error("No access token found");
                    return;
                }

                const response = await axios.get(`${apiUrl}/api/invoice_maintenance/${invoiceID}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Invoice data:", response.data);
                setInvoiceData(response.data);
            } catch (error) {
                console.error("Error fetching invoice:", error);
            }
        };

        fetchInvoiceShowId();
    }, [invoiceID]);


    useEffect(() => {
        if (isInvoiceData) {
            // set ข้อมูล invoice หลัก
            setInvoice({
                invoice_id: isInvoiceData.invoice_id,
                invoice_no: isInvoiceData.invoice_no,
                request_id: isInvoiceData.request_id,
                invoice_date: isInvoiceData.invoice_date,
                invoice_created_emp_id: isInvoiceData.invoice_created_emp_id,
                status: isInvoiceData.status,
                invoice_doc: isInvoiceData.invoice_doc,
            });

            // map sections -> remarks
            if (isInvoiceData.sections && Array.isArray(isInvoiceData.sections)) {
                const mappedRemarks = isInvoiceData.sections.map((section) => ({
                    remark: section.note || "",
                    invoice_section_id: section.invoice_section_id || "",
                    parts: section.parts?.map((part) => ({
                        invoice_parts_id: part.invoice_parts_id || 0, // เปลี่ยนเป็น invoice_parts_id
                        part_id: part.part_id || "",
                        system: part.system_name || "",
                        name: part.part_name || "",
                        type: part.maintenance_type || "",
                        price: part.part_price || 0,
                        unit: part.part_unit || "",
                        qty: part.part_qty || 0,
                        discount: part.part_discount || 0,
                        vat: part.part_vat || 0,
                        total: (part.part_qty * part.part_price - part.part_discount)
                            + ((part.part_qty * part.part_price - part.part_discount) * (part.vat || 0) / 100)
                    })) || [],

                }));
                setRemarks(mappedRemarks);
            }
        }
    }, [isInvoiceData]);







    return (

        <div className="container">
            <div className="mb-2"></div>

            <form action="" onSubmit={handleSubmit}>
                <div className="card mb-3 shadow-sm" style={{ backgroundColor: "#f8f9fa", borderRadius: "0.5rem" }}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                            <div>
                                <p className="fw-bold text-primary mb-0">ข้อมูลเอกสารแจ้งซ่อม (Job Info)</p>
                            </div>
                            <div>
                                <button type="button" className="btn btn-primary btn-sm me-1" onClick={() => handleOpenModaleVehicleDtail(requestId)}>
                                    <i className="bi bi-clipboard2-pulse-fill"></i> Job
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={generateReport}>
                                    {/* <i className="bi bi-printer"></i> PDF */}

                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            กำลังสร้างรายงาน...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-printer"></i> PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="p-3" style={{ backgroundColor: "#ffffff", borderRadius: "0.5rem" }}>
                            <div className="row mb-2">
                                <div className="col-lg-3">
                                    <label className="form-label">เลขที่ใบแจ้งซ่อม</label>
                                    <p className="mb-0">{dataRequest ? dataRequest.request_no : "-"}</p>
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">ทะเบียนรถ</label>
                                    <p className="mb-0">{dataRequest ? dataRequest.reg_number : "-"}</p>
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">ประเภท</label>
                                    <p className="mb-0">{dataRequest ? dataRequest.car_type_name : "-"}</p>
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">สถานะรถ</label>
                                    <p className="mb-0">000</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-3">
                                    <label className="form-label">วันที่แจ้งซ่อม</label>
                                    <p className="mb-0">{dataRequest ? formatDateDMY(dataRequest.request_date) : "-"}</p>
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">เลขไมล์</label>
                                    <p className="mb-0">{dataRequest ? dataRequest.car_mileage : "-"}</p>
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">ผู้แจ้ง</label>
                                    <p className="mb-0">{dataRequest ? dataRequest.request_emp_name : "-"}</p>
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">สาขา</label>
                                    <p className="mb-0">{dataRequest ? dataRequest.branch_name : "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="card mb-3">
                    <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "0.5rem" }}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                            <div className="">
                                <p className="text-primary fw-bolder">
                                    ข้อมูลซ่อมบำรุง รายการทั้งหมด {totalParts} รายการ
                                    ตัดรายการใบแจ้งหนี้ {selectedPartsCount} รายการ
                                </p>
                            </div>
                            {!isEditing ? (
                                <div className="">
                                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}><i class="bi bi-pencil-square"></i> แก้ไข</button>
                                </div>
                            ) : (

                                <div className="">
                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => setIsEditing(false)}><i class="bi bi-pencil-square"></i> ยกเลิก</button>
                                </div>
                            )}


                        </div>

                        <div className="mb-2 p-3 " style={{ backgroundColor: "#ffffff", borderRadius: "0.5rem" }}>
                            <div className="row">
                                <div className="mb-2 col-2">
                                    <label htmlFor="section_number" className="form-label">
                                        เลขเอกสาร (ครั้งที่)
                                    </label>
                                    <input
                                        type="text"
                                        name="section_number"
                                        id="section_number"
                                        className="form-control"
                                        value={isInvoiceData?.invoice_no}
                                        disabled
                                    />
                                </div>
                                <div className="mb-2 col-2">
                                    <label htmlFor="invoice_date" className="form-label">
                                        วันที่
                                    </label>
                                    <input
                                        type="date"
                                        name="invoice_date"
                                        id="invoice_date"
                                        className="form-control"
                                        value={toBuddhistDate(isInvoiceData?.invoice_date)}
                                        disabled
                                    />
                                </div>
                                <div className="mb-2 col-3">
                                    <label htmlFor="name" className="form-label">
                                        ผู้จัดทำ
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        value={`${isInvoiceData?.fname}  ${isInvoiceData?.lname}`}
                                        disabled
                                    />
                                </div>
                                <div className="mb-2 col-5">
                                    <label htmlFor="invoice_doc" className="form-label">
                                        เอกสารแนบ <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        name="invoice_doc"
                                        id="invoice_doc"
                                        ref={fileInputRef}
                                        className="form-control"
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>


                        {remarks.map((remark, remarkIndex) => (
                            <div key={remarkIndex} className="mb-4" style={{ backgroundColor: "#ffffff", borderRadius: "0.5rem" }}>
                                {/* ตารางหพมายเหตุ */}
                                <table className="table table-hover">
                                    <thead className="table-primary">
                                        <tr>
                                            <th style={{ width: "80px" }}>ลำดับ</th>
                                            <th>หมายเหตุ <span className="text-danger">*</span></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{remarkIndex + 1}</td>
                                            <td>
                                                <textarea
                                                    className={`form-control form-control-sm ${errors.remarks[remarkIndex] ? "is-invalid" : ""}`}
                                                    value={remark.remark}
                                                    onChange={(e) => handleChangeRemark(remarkIndex, e.target.value)}
                                                    onBlur={(e) => handleBlur(remarkIndex, e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                                {errors.remarks[remarkIndex] && <div className="text-danger mt-1">กรุณากรอกข้อมูล</div>}

                                            </td>
                                            <td className="col-lg-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteRemark(remarkIndex)}
                                                    disabled={!isEditing}
                                                >
                                                    <i className="bi bi-trash-fill"></i> DELETE
                                                </button>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* ตารางอะไหล่ภายใต้หมายเหตุ */}
                                <table className="table table-hover ">
                                    <thead className="table-light  ">
                                        <tr>
                                            <th>ระบบ </th>
                                            <th>ชื่ออะไหล่ <span className="text-danger">*</span> </th>
                                            <th>ประเภท <span className="text-danger">*</span> </th>
                                            <th>จำนวน <span className="text-danger">*</span> </th>
                                            <th>ราคา/หน่วย <span className="text-danger">*</span> </th>
                                            <th>VAT% </th>
                                            <th>ส่วนลด </th>
                                            <th>ราคารวม </th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {remark.parts.map((part, partIndex) => (
                                            <tr key={partIndex}>
                                                <td><input className={`form-control form-control-sm ${errors.parts[remarkIndex]?.[partIndex]?.system ? "is-invalid" : ""}`}
                                                    value={part.system} onChange={(e) => handleChangePart(remarkIndex, partIndex, "system", e.target.value)} readOnly disabled={!isEditing}
                                                />{errors.parts[remarkIndex]?.[partIndex]?.system && (<div className="text-danger mt-1">กรุณากรอกข้อมูล</div>)}</td>
                                                <td><input className={`form-control form-control-sm ${errors.parts[remarkIndex]?.[partIndex]?.system ? "is-invalid" : ""}`}
                                                    value={part.name} onChange={(e) => handleChangePart(remarkIndex, partIndex, "name", e.target.value)} disabled={!isEditing}
                                                />{errors.parts[remarkIndex]?.[partIndex]?.system && (<div className="text-danger mt-1">กรุณากรอกข้อมูล</div>)}</td>
                                                <td><input className={`form-control form-control-sm ${errors.parts[remarkIndex]?.[partIndex]?.system ? "is-invalid" : ""}`}
                                                    value={part.type} onChange={(e) => handleChangePart(remarkIndex, partIndex, "type", e.target.value)} disabled={!isEditing}
                                                />{errors.parts[remarkIndex]?.[partIndex]?.system && (<div className="text-danger mt-1">กรุณากรอกข้อมูล</div>)}</td>
                                                <td><input className={`form-control form-control-sm ${errors.parts[remarkIndex]?.[partIndex]?.system ? "is-invalid" : ""}`}
                                                    value={part.qty} onChange={(e) => handleChangePart(remarkIndex, partIndex, "qty", e.target.value)} disabled={!isEditing}
                                                />{errors.parts[remarkIndex]?.[partIndex]?.system && (<div className="text-danger mt-1">กรุณากรอกข้อมูล</div>)}</td>
                                                <td><input className={`form-control form-control-sm ${errors.parts[remarkIndex]?.[partIndex]?.system ? "is-invalid" : ""}`}
                                                    value={part.price} onChange={(e) => handleChangePart(remarkIndex, partIndex, "price", e.target.value)} disabled={!isEditing}
                                                />{errors.parts[remarkIndex]?.[partIndex]?.system && (<div className="text-danger mt-1">กรุณากรอกข้อมูล</div>)}</td>
                                                <td><input className={`form-control form-control-sm`}
                                                    value={part.vat} onChange={(e) => handleChangePart(remarkIndex, partIndex, "vat", e.target.value)} disabled={!isEditing}
                                                /></td>
                                                <td><input className={`form-control form-control-sm`}
                                                    value={part.discount} onChange={(e) => handleChangePart(remarkIndex, partIndex, "discount", e.target.value)} disabled={!isEditing}
                                                /></td>
                                                <td><input className={`form-control form-control-sm`}
                                                    value={part.total} onChange={(e) => handleChangePart(remarkIndex, partIndex, "total", e.target.value)} readOnly disabled={!isEditing}
                                                /></td>
                                                <td>
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            type="button"
                                                            onClick={() => handleOpenModalQtationPart(remarkIndex, partIndex)}
                                                            disabled={!isEditing}
                                                        >
                                                            <i className="bi bi-plus-lg"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            type="button"
                                                            onClick={() => handleDeletePart(remarkIndex, partIndex)}
                                                            disabled={!isEditing}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => addPart(remarkIndex)}
                                    disabled={!isEditing}
                                >
                                    ➕ เพิ่มอะไหล่ในหมายเหตุ {remarkIndex + 1}
                                </button>
                            </div>
                        ))}

                        <button type="button" className="btn btn-success mt-3" onClick={addRemark} disabled={!isEditing}>
                            ➕ เพิ่มหมายเหตุใหม่
                        </button>

                    </div>
                </div>


                <div className="card mb-3">
                    <div className="card-body d-flex justify-content-end">
                        <div className="col-lg-4">
                            <table className="table text-end">
                                <tbody>
                                    <tr>
                                        <th className="text-start">ราคารวม</th>
                                        <td>{totalPrice.toFixed(2)}</td>
                                        <th>บาท</th>
                                    </tr>
                                    <tr>
                                        <th className="text-start">ภาษีมูลค่าเพิ่ม</th>
                                        <td>{totalVat.toFixed(2)}</td>
                                        <th>บาท</th>
                                    </tr>
                                    <tr>
                                        <th className="text-start">ส่วนลด</th>
                                        <td>{grandTotal.toFixed(2)}</td>
                                        <th>บาท</th>
                                    </tr>
                                    <tr>
                                        <th className="text-start">ราคารวมสุทธิ</th>
                                        <td>{grandTotal.toFixed(2)}</td>
                                        <th>บาท (รวมภาษีแล้ว)</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {isEditing && (
                    <div className="mb-3">
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary me-1">บันทึก</button>
                        </div>
                    </div>
                )}
            </form>



            <Modal_quotation_part_details_job
                isOpen={isOpenModalQtationPart}
                onClose={handleClonseModalQtationPart}
                requestId={requestId}
                selectedParts={selectedParts} // ส่ง selectedParts ให้ modal
                totalParts={getPartsSummary().totalParts} // ส่งจำนวนรายการทั้งหมดให้ modal
                onSubmit={(data) =>
                    handleDataFromAddModal(
                        dataOpenModalQtationPart.remarkIndex,
                        dataOpenModalQtationPart.partIndex,
                        data
                    )
                }
            />

            <Modal_show_vehicle_details
                isOpen={isOpenModaleVehicleDtail}
                onClose={handleClonseModaleVehicleDtail}
                requestId={dataOpenModaleVehicleDtail}
            />



        </div>

    )
}

export default MainternanceInvoice_showEdit;
