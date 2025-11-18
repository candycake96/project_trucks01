import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // ใช้ดึงข้อมูลที่ถูกส่งมาจากหน้าอื่นผ่าน <Link to="..." state={...} />
import { apiUrl } from "../../../config/apiConfig";
import Modal_vehicle_parts_details from "../Parts/Modal/Modal_vehicle_parts_details";
import Modal_vandor_show_search from "../Vandor/modal/Modal_vandor_show_search";
import '../Repair/MainternanceAnalysis_showsEdit.css'
// import '../Repair/MainternanceAnalysis_showEdit.css';
// import { use } from "react";
// import { data } from "autoprefixer";


const MainternanceAnalysis_showEdit = ({ maintenanceJob, data, hasPermission }) => {

    if (!data) return null;

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


    const [analysisData, setAnalysisData] = useState({
        analysis_id: "",
        request_id: "",
        analysis_emp_id: "",
        is_quotation_required: false,
        urgent_repair: false,
        inhouse_repair: false,
        send_to_garage: false,
        plan_date: "",
        plan_time: "",
        remark: "",
        is_pm: false,
        is_cm: false,
        fname: "",
        lname: "",
    });

    console.log("AnalysisData after set:", analysisData);

    // คอนฟิกข้อมูลที่จะส่งไปยัง API
    const dataToSend = {
        // รวมข้อมูลจาก analysisData เพื่อส่งไปยัง API
        ...analysisData,
        fname: analysisData.fname || "",
        lname: analysisData.lname || "",
        analysis_id: analysisData.analysis_id || "",
        request_id: analysisData.request_id || "",
        analysis_emp_id: analysisData.analysis_emp_id || (user ? user.id_emp : ""),
        plan_date: analysisData.plan_date || "",
        plan_time: analysisData.plan_time || "",
        remark: analysisData.remark || "",

        // แปลง boolean เป็น 0/1 สำหรับ MSSQL BIT
        is_pm: analysisData.is_pm ? 1 : 0,
        is_cm: analysisData.is_cm ? 1 : 0,
        is_quotation_required: analysisData.is_quotation_required ? 1 : 0,
        urgent_repair: analysisData.urgent_repair ? 1 : 0,
        inhouse_repair: analysisData.inhouse_repair ? 1 : 0,
        send_to_garage: analysisData.send_to_garage ? 1 : 0,
    };


    useEffect(() => {
        if (maintenanceJob && user) {
            setAnalysisData(prev => ({
                ...prev, // เก็บค่าที่มีอยู่แล้ว
                request_id: maintenanceJob.request_id || "",
                analysis_emp_id: user.id_emp || "",
            }));
        }
    }, [maintenanceJob, user]);



    // เพิ่ม state สำหรับใบเสนอราคาแบบ array
    const [quotations, setQuotations] = useState([
        {
            quotation_id: "",
            analysis_id: "",
            vendor_id: "",
            quotation_date: "",
            quotation_file: null,
            note: "",
            is_selected: false,
            quotation_vat: "",
            vendor_name: "",
            parts: [
                { item_id: "", quotation_parts_id: "", request_id: "", parts_used_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" }
            ],
        }
    ]);

    // ฟังก์ชันเพิ่มใบเสนอราคาใหม่
    const handleAddQuotation = () => {
        setQuotations([
            ...quotations,
            {
                quotation_id: "",
                analysis_id: "",
                vendor_id: "",
                quotation_date: "",
                quotation_file: null,
                note: "",
                is_selected: false,
                quotation_vat: "",
                vendor_name: "",
                parts: [
                    { item_id: "", quotation_parts_id: "", request_id: "", parts_used_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" }
                ]
            }
        ]);
    };

    // ฟังก์ชันลบใบเสนอราคา
    const handleRemoveQuotation = (quotationIndex) => {
        const updatedQuotations = quotations.filter((_, index) => index !== quotationIndex);
        setQuotations(updatedQuotations);
    };


    // ฟังก์ชันเพิ่มรายการอะไหล่ในใบเสนอราคา
    const handleAddPart = (quotationIndex) => {
        const updatedQuotations = [...quotations];
        updatedQuotations[quotationIndex].parts.push({
            item_id: "", request_id: "", parts_used_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: ""
        });
        setQuotations(updatedQuotations);
    };


    useEffect(() => {
        if (maintenanceJob) {
            setAnalysisData((prevData) => ({
                ...prevData,
                request_id: maintenanceJob.request_id || "",
            }));
        }
    }, [maintenanceJob]);


    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
    const handleAnalysisInputChange = (e) => {
        if (!isEditing) return; // ไม่ให้แก้ไขถ้าไม่ได้อยู่ในโหมดแก้ไข
        const { name, value, type, checked } = e.target;
        setAnalysisData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    // ฟังก์ชันลบข้อมูลอะไหล่
    const handleRemovePart = (quotationIndex, partIndex) => {
        const updated = [...quotations];
        updated[quotationIndex].parts.splice(partIndex, 1);
        setQuotations(updated);
    };

    // ฟังก์ชันการเปลี่ยนแปลงข้อมูลอะไหล่  
    const handleChange = (quotationIndex, partIndex, field, value) => {
        const updatedQuotations = [...quotations];
        const part = updatedQuotations[quotationIndex].parts[partIndex];

        part[field] = value;

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


    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
    const [requestParts, setRequestParts] = useState([]);
    useEffect(() => {
        const fetchRequestAndParts = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/repair_requests_and_part_detail/${maintenanceJob?.request_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                setRequestParts(response.data);
            } catch (error) {
                console.error("Error fetching parts:", error);
            }
        };

        if (maintenanceJob?.request_id) {
            fetchRequestAndParts();
        }
    }, [maintenanceJob]);

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


    // ฟังก์ชันดึงข้อมูลอะไหล่จาก requestParts และอัปเดตใบเสนอราคา 
    const handleInputChangeImportParts = (quotationIndex) => {
        if (requestParts?.request_id && Array.isArray(requestParts.parts_used)) {
            const mappedParts = requestParts.parts_used.map((item) => {
                const price = parseFloat(item.repair_part_price) || 0;
                const qty = parseFloat(item.repair_part_qty) || 0;
                const vat = parseFloat(item.repair_part_vat) || 0;
                const subtotal = price * qty;
                const total = subtotal + (subtotal * vat / 100);
                return {
                    item_id: item.item_id || "",
                    part_id: item.part_id || "",
                    system_name: item.system_name || "",
                    part_name: item.repair_part_name || "",
                    price: price.toString(),
                    unit: item.repair_part_unit || "",
                    maintenance_type: item.maintenance_type || "",
                    qty: qty.toString(),
                    discount: "",
                    vat: vat.toString(),
                    total: total.toFixed(2),
                };
            });
            // อัปเดตใบเสนอราคาที่เลือก
            setQuotations((prev) => {
                const updated = [...prev];
                if (updated[quotationIndex]) {
                    updated[quotationIndex].parts = mappedParts;
                }
                return updated;
            });
        }
    };

    useEffect(() => {
        if (requestParts?.parts_used && requestParts.parts_used.length > 0) {
            setQuotations(prev => {
                const updated = [...prev];
                // ถ้ามี quotation แรก ให้ใส่ parts เข้าไป
                if (updated[0]) {
                    updated[0].parts = requestParts.parts_used.map(item => {
                        const price = parseFloat(item.repair_part_price) || 0;
                        const qty = parseFloat(item.repair_part_qty) || 0;
                        const vat = parseFloat(item.repair_part_vat) || 0;
                        const subtotal = price * qty;
                        const total = subtotal + (subtotal * vat / 100);
                        return {
                            item_id: item.item_id || "",
                            parts_used_id: item.parts_used_id || "",
                            part_id: item.part_id || "",
                            system_name: item.system_name || "",
                            part_name: item.repair_part_name || "",
                            price: price.toString(),
                            unit: item.repair_part_unit || "",
                            maintenance_type: item.maintenance_type || "",
                            qty: qty.toString(),
                            discount: "",
                            vat: vat.toString(),
                            total: total.toFixed(2),
                        };
                    });
                }
                return updated;
            });
        }
    }, [requestParts]);


    // Modal
    const [isOpenModalVehicleParteDtails, setOpenModalVehicleParteDtails] = useState(false);
    const [selectedQuotationIndex, setSelectedQuotationIndex] = useState(null);
    const [selectedPartIndex, setSelectedPartIndex] = useState(null);

    // ฟังก์ชันรับข้อมูลจาก Modal_vehicle_parts_add สำหรับหลายใบเสนอราคา
    const handleDataFromAddModal = (quotationIndex, partIndex, data) => {
        setQuotations(prev => {
            const updated = [...prev];
            if (
                quotationIndex !== null &&
                quotationIndex !== undefined &&
                partIndex !== null &&
                partIndex !== undefined
            ) {
                updated[quotationIndex].parts[partIndex] = {
                    ...updated[quotationIndex].parts[partIndex],
                    ...data
                };
            }
            return updated;
        });
        setOpenModalVehicleParteDtails(false);
    };

    // ฟังก์ชันเปิด Modal สำหรับแสดงรายละเอียดของอะไหล่
    const handleOpenModalVehicleParteDtails = (quotationIndex, partIndex) => {
        setSelectedQuotationIndex(quotationIndex);
        setSelectedPartIndex(partIndex);
        setOpenModalVehicleParteDtails(true);
    };
    const handleClossModalVehicleParteDtails = () => {
        setOpenModalVehicleParteDtails(false);
    };


    // ฟังก์ชันเปิด Modal สำหรับแสดงรายละเอียดของผู้จำหน่าย
    const [isOpenModalVendorDetails, setIsOpenModalVendorDetails] = useState(false);
    // เปิด Modal พร้อมระบุใบเสนอราคาที่ต้องการแก้ไข
    const handleOpenModalVendorDetails = (quotationIndex) => {
        // รักษา index ของใบเสนอราคาเพื่อใช้ใน Modal เพื่ออัปเดตชื่ออู่/ร้านค้า
        setSelectedQuotationIndex(quotationIndex); // เก็บ index ของใบเสนอราคา
        setIsOpenModalVendorDetails(true); // เปิด Modal 
    };
    const handleCloseModalVendorDetails = () => {
        setIsOpenModalVendorDetails(false);
    }

    // ฟังก์ชันรับข้อมูลจาก Modal_vendor_show_search สำหรับการอัปเดตอะไหล่
    // ฟังก์ชันรับข้อมูลจาก Modal_vandor_show_search สำหรับการอัปเดตชื่ออู่/ร้านค้าในใบเสนอราคา
    const handleDataFromModalVehicleShowSearch = (vendorData) => {
        if (!vendorData || selectedQuotationIndex === null) return;
        setQuotations(prev => {
            const updated = [...prev];
            // เก็บชื่ออู่/ร้านค้า
            updated[selectedQuotationIndex].vendor_name = vendorData.vendor_name || "";
            // ถ้าต้องการเก็บ id จริงๆ ให้ใช้ vendorData.vendor_id ด้วย
            updated[selectedQuotationIndex].vendor_id = vendorData.vendor_id || "";
            return updated;
        });
        setIsOpenModalVendorDetails(false);
    };


    console.log("DEBUG → data:", data);
    console.log("DEBUG → data.analysis:", data?.analysis);
    // เพิ่มฟังก์ชันรีเซ็ตข้อมูล
    useEffect(() => {
        if (!data) return;
        const resetFormToInitial = () => {
            if (data) {

                if (data.analysis) {
                    const a = data.analysis;
                    setAnalysisData({
                        analysis_id: a.analysis_id || "",
                        request_id: a.request_id || "",
                        analysis_emp_id: a.analysis_emp_id || (user ? user.id_emp : ""),
                        is_quotation_required: !!a.is_quotation_required,
                        urgent_repair: !!a.urgent_repair,
                        inhouse_repair: !!a.inhouse_repair,
                        send_to_garage: !!a.send_to_garage,
                        plan_date: a.plan_date ? a.plan_date.substring(0, 10) : "",
                        plan_time: a.plan_time ? a.plan_time.substring(11, 16) : "",
                        remark: a.remark || "",
                        is_pm: !!a.is_pm,
                        is_cm: !!a.is_cm,
                        fname: a.fname || "",
                        lname: a.lname || "",
                    });
                }

                if (Array.isArray(data?.quotations)) {
                    setQuotations(
                        data?.quotations.map(q => ({
                            quotation_id: q.quotation_id || "",
                            analysis_id: q.analysis_id || "",
                            vendor_id: q.vendor_id || "",
                            garage_name: q.vendor_name || "",
                            quotation_date: q.quotation_date ? q.quotation_date.substring(0, 10) : "",
                            quotation_file: q.quotation_file || null,
                            note: q.note || "",
                            is_selected: !!q.is_selected,
                            quotation_vat: q.quotation_vat || "",
                            vendor_name: q.vendor_name || "",
                            parts: Array.isArray(q.parts)
                                ? q.parts.map(part => {
                                    const price = parseFloat(part.part_price) || 0;
                                    const qty = parseFloat(part.part_qty) || 0;
                                    const vat = parseFloat(part.part_vat) || 0;
                                    const discount = parseFloat(part.part_discount) || 0;
                                    const subtotal = price * qty - discount;
                                    const vatVal = subtotal * vat / 100;
                                    const total = subtotal + vatVal;
                                    return {
                                        item_id: part.item_id || "",
                                        part_id: part.part_id || "",
                                        system_name: part.system_name || "",
                                        part_name: part.part_name || "",
                                        price: part.part_price?.toString() || "",
                                        unit: part.part_unit || "",
                                        maintenance_type: part.maintenance_type || "",
                                        qty: part.part_qty?.toString() || "",
                                        discount: part.part_discount?.toString() || "",
                                        vat: part.part_vat?.toString() || "",
                                        total: total.toFixed(2),
                                    };
                                })
                                : [],
                        }))
                    );
                }
            }
        };
        resetFormToInitial(); // ✅ เรียกใช้งาน
    }, [data]);

    // ...existing code...
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("ข้อมูลที่ส่ง:", { dataToSend });
            console.log("ข้อมูลใบเสนอราคา:", quotations);
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setMessage("Access token is missing. Please log in.");
                setMessageType("error");
                return;
            }

            const formData = new FormData();

            for (const key in dataToSend) {
                formData.append(key, dataToSend[key]);
            }

            quotations.forEach((quotation, index) => {
                formData.append(`quotations[${index}][vendor_id]`, quotation.vendor_id);
                formData.append(`quotations[${index}][quotation_date]`, quotation.quotation_date);
                formData.append(`quotations[${index}][note]`, quotation.note);
                formData.append(`quotations[${index}][is_selected]`, quotation.is_selected ? 1 : 0);
                formData.append(`quotations[${index}][quotation_vat]`, quotation.quotation_vat || "");
                const vendorName =
                    Array.isArray(quotation.vendor_name)
                        ? quotation.vendor_name.find(name => name.trim() !== "") || ""
                        : quotation.vendor_name || "";

                formData.append(`quotations[${index}][vendor_name]`, vendorName);

                if (quotation.quotation_file instanceof File) {
                    formData.append(`quotations[${index}][quotation_file]`, quotation.quotation_file);
                } else if (typeof quotation.quotation_file === "string") {
                    formData.append(`quotations[${index}][quotation_file_old]`, quotation.quotation_file);
                }


                quotation.parts.forEach((part, partIndex) => {
                    for (const key in part) {
                        formData.append(`quotations[${index}][parts][${partIndex}][${key}]`, part[key]);
                    }
                });
            });

            // ดูค่าทั้งหมดใน formData
            for (let pair of formData.entries()) {
                console.log('', pair[0], pair[1]);
            }

            const response = await axios.put(
                `${apiUrl}/api/ananlysis_update/${user?.id_emp}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("บันทึกข้อมูลสำเร็จ:", response.data);
            setMessage(response.data.message);
            setMessageType("success");
            setIsEditing(false);

        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
            setMessage("เกิดข้อผิดพลาด");
            setMessageType("error");
        }
    };


    return (
        <div className=" mb-4 ">

            {/* {analysisData ? (<><p>True</p></>) : (<><p>NO</p></>)} */}
            {/* Display success or error message */}
            {message && (
                <div
                    className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} alert-dismissible fade show`}
                    role="alert"
                >
                    {message}
                    {/* กากระบาทปิด */}
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setMessage("")}
                    ></button>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0 fw-bold text-dark ">รายการตรวจเช็ครถและใบเสนอราคารายการซ่อม</p>



                {/* {maintenanceJob?.request_informer_emp_id === user?.id_emp && (<></>)} */}
                    <>
                        {/* ถ้าได้รับการอนุมัติจากผู้จัดการแล้ว */}
                        {["ผู้จัดการอนุมัติ", "ใบแจ้งหนี้", "ปิดงานซ่อม"].includes(maintenanceJob?.status) ? (
                            <button
                                className="btn btn-secondary btn-sm"
                                disabled
                                title="ไม่สามารถแก้ไขได้เนื่องจากผู้จัดการอนุมัติแล้ว"
                            >
                                <i className="bi bi-lock-fill me-1"></i> แก้ไขไม่ได้
                            </button>
                        ) : maintenanceJob?.status === 'รอคำขอแก้ไขหลังอนุมัติ' ? (
                            <button className="btn btn-warning btn-sm" disabled>
                                <i className="bi bi-hourglass-split me-1"></i> รออนุมัติคำขอแก้ไข
                            </button>
                        ) : (
                            // ปุ่มแก้ไขปกติ
                            <>
                                {hasPermission("EDIT_CAR_CHECK") && (
                                    !isEditing && (
                                        <div className="">
                                            {/* <button className="btn btn-primary btn-sm">เพิ่มข้อมูลเพื่อขออนุมัติใหม่</button> */}
                                            <button
                                                type="button"
                                                className="btn btn-success btn-sm"
                                                onClick={() => setIsEditing(true)}
                                                style={{ whiteSpace: 'nowrap' }}
                                            >
                                                <i className="bi bi-pencil-fill me-1"></i>  แก้ไข
                                            </button>
                                        </div>
                                    )
                                )}
                            </>
                        )}
                    </>
                
            </div>

            <form onSubmit={handleSubmit} className="">
                {/* <div className="card-header fw-bold fs-5">
                    ความเห็นของแผนกซ่อมบำรุง {maintenanceJob ? maintenanceJob.request_no : "ไม่ระบุ"}
                </div> */}
                <div className="">
                    {/* ...ฟอร์มส่วนบน... */}
                    <div className="mb-3">
                        <div className="">

                            <div className="row mb-3 align-items-center" >
                                <div className="col-lg-4 mb-3">
                                    <label htmlFor="name" className="form-label">
                                        ผู้ตรวจเช็ครถ <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        value={`${analysisData.fname || ""} ${analysisData.lname || ""}`.trim()}  // ✅ ใช้ value แทน checked
                                        onChange={handleAnalysisInputChange}
                                        disabled   // ✅ disabled ไม่ใช่ disable
                                    />

                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label mb-2">ประเภทการซ่อม</label>
                                    <div className="d-flex gap-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input no-disable-style"
                                                type="checkbox"
                                                id="pm"
                                                name="is_pm"
                                                checked={!!analysisData.is_pm}
                                                onChange={handleAnalysisInputChange}
                                            // disabled={!isEditing}
                                            />
                                            <label
                                                className={`form-check-label ${analysisData.is_pm ? 'fw-bold' : 'text-muted'}`}
                                                htmlFor="pm"
                                            >
                                                PM (ซ่อมก่อนเสีย)
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="cm"
                                                name="is_cm"
                                                checked={!!analysisData.is_cm}
                                                onChange={handleAnalysisInputChange}
                                            // disabled={!isEditing}
                                            />
                                            <label
                                                className={`form-check-label ${analysisData.is_cm ? 'fw-bold' : 'text-muted'}`}
                                                htmlFor="cm"
                                            >
                                                CM (เสียก่อนซ่อม)
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="row mb-4">
                                <label className="form-label mb-2">แนวทางการดำเนินงาน</label>
                                <div className="col-lg-3 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="urgent_repair"
                                            name="urgent_repair"
                                            onChange={handleAnalysisInputChange}
                                            checked={analysisData.urgent_repair || false}

                                        />
                                        <label className="form-check-label ms-2" htmlFor="urgent_repair">
                                            จำเป็นต้องซ่อมด่วนทันที
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-3 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="inhouse_repair"
                                            name="inhouse_repair"
                                            onChange={handleAnalysisInputChange}
                                            checked={analysisData.inhouse_repair || false}


                                        />
                                        <label className="form-check-label ms-2" htmlFor="inhouse_repair">
                                            แผนกช่างซ่อมเองได้
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-3 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="send_to_garage"
                                            name="send_to_garage"
                                            onChange={handleAnalysisInputChange}
                                            checked={analysisData.send_to_garage || false}

                                        />
                                        <label className="form-check-label ms-2" htmlFor="send_to_garage">
                                            ต้องส่งอู่
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-4 mb-3">
                                    <div className=" d-flex gap-3">
                                        <div className="col-7">
                                            <label htmlFor="plan_date" className="form-label">
                                                ตั้งแต่วันที่
                                            </label>
                                            <input
                                                type="date"
                                                name="plan_date"
                                                id="plan_date"
                                                className="form-control"
                                                onChange={handleAnalysisInputChange}
                                                value={analysisData.plan_date || ""}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="mb-2 col-5">
                                            <label htmlFor="plan_time" className="form-label">
                                                เวลา
                                            </label>
                                            <input
                                                type="time"
                                                name="plan_time"
                                                id="plan_time"
                                                className="form-control"
                                                onChange={handleAnalysisInputChange}
                                                value={analysisData.plan_time || ""}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg mb-2">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="is_quotation_required"
                                                name="is_quotation_required"
                                                onChange={handleAnalysisInputChange}
                                                checked={!!analysisData.is_quotation_required}
                                            // disabled={!isEditing}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="is_quotation_required ">
                                                มีใบเสนอราคา
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-8 mb-3">
                                    <label htmlFor="remark" className="form-label">
                                        หมายเหตุ
                                    </label>
                                    <textarea
                                        name="remark"
                                        id="remark"
                                        className="form-control"
                                        rows={2}
                                        placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)"
                                        onChange={handleAnalysisInputChange}
                                        value={analysisData.remark || ""}
                                        disabled={!isEditing}
                                    ></textarea>
                                </div>
                            </div>

                        </div>
                        <hr className="mb-3" />
                        {/* แสดงใบเสนอราคาทั้งหมด */}
                        {quotations.map((q, idx) => (
                            <div key={idx} className="mb-4 border rounded p-3">
                                <div className="row mb-2">
                                    <div className="col-lg-5">
                                        <p className="fw-bolder">ใบเสนอราคาที่ {idx + 1}
                                            <strong className="ms-2">
                                                {isEditing && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-danger ms-2"
                                                            onClick={() => handleRemoveQuotation(idx)}
                                                            disabled={!isEditing}
                                                        >
                                                            <i className="bi bi-trash3-fill"></i>
                                                            ลบใบเสนอราคาที่ {idx + 1}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary ms-2"
                                                            onClick={() => handleInputChangeImportParts(idx)}
                                                            disabled={!isEditing}
                                                        >
                                                            <i class="bi bi-arrow-down-square-fill"></i>
                                                            ดึงข้อมูลอะไหล่
                                                        </button>
                                                    </>
                                                )}

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
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleOpenModalVendorDetails(idx)} disabled={!isEditing}>
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
                                        {!isEditing && typeof q.quotation_file === "string" && q.quotation_file && (
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
                                <div className="mb-3" style={{ overflowX: "auto" }}>
                                    {q.parts.map((part, partIdx) => (
                                        <div className="row mb-3" key={partIdx}>
                                            <input type="hidden" value={part.part_id} readOnly />
                                            <div className="col-lg-1">
                                                <label className="form-label text-sm">ระบบ</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={part.system_name}
                                                    onChange={e => handleChange(idx, partIdx, "system_name", e.target.value)}
                                                    disabled
                                                />
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="form-label text-sm">อะไหล่ <span style={{ color: "red" }}>*</span></label>
                                                <div className="input-group input-group-sm">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={part.part_name}
                                                        onChange={e => handleChange(idx, partIdx, "part_name", e.target.value)}
                                                        disabled={!isEditing}
                                                        placeholder="ค้นหาอะไหล่..."
                                                    />
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        type="button"
                                                        onClick={() => handleOpenModalVehicleParteDtails(idx, partIdx)}
                                                        disabled={!isEditing}
                                                    >
                                                        <i className="bi bi-search"></i>
                                                    </button>

                                                </div>
                                            </div>
                                            <div className="col-lg-1">
                                                <label className="form-label text-sm">ประเภท <span style={{ color: "red" }}>*</span></label>
                                                <select
                                                    className="form-select mb-3 form-select-sm"
                                                    value={part.maintenance_type}
                                                    onChange={e => handleChange(idx, partIdx, "maintenance_type", e.target.value)}
                                                    disabled={!isEditing}
                                                >
                                                    <option value=""></option>
                                                    <option value="CM">CM</option>
                                                    <option value="PM">PM</option>
                                                </select>
                                            </div>


                                            <div className="col-lg-1">
                                                <label className="form-label text-sm">ตัดรอบ PM <span className="" style={{ color: "red" }}>*</span></label>
                                                <select
                                                    className="form-select  mb-3  form-select-sm"
                                                    aria-label="Large select example"
                                                    value={part.item_id}
                                                    onChange={e => handleChange(idx, partIdx, "item_id", e.target.value)}
                                                    disabled={!isEditing}
                                                >
                                                    <option value=""></option>
                                                    {dataItem.map((row, ndx) => (
                                                        <option value={row.item_id} key={ndx}> {row.item_name}</option>
                                                    ))}
                                                    <option value="อื่นๆ">อื่นๆ</option>
                                                </select>
                                            </div>

                                            <div className="col-lg-1">
                                                <label className="form-label text-sm">ราคา <span style={{ color: "red" }}>*</span></label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={part.price}
                                                    onChange={e => handleChange(idx, partIdx, "price", e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="col-lg-1">
                                                <label className="form-label text-sm">หน่วย <span style={{ color: "red" }}>*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={part.unit}
                                                    onChange={e => handleChange(idx, partIdx, "unit", e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="col-lg-1">
                                                <label className="form-label text-sm">จำนวน <span style={{ color: "red" }}>*</span></label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={part.qty}
                                                    onChange={e => handleChange(idx, partIdx, "qty", e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="col-lg-1">
                                                <label className="form-label text-sm">ส่วนลด</label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={part.discount || ""}
                                                    onChange={e => handleChange(idx, partIdx, "discount", e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="col" style={{ flex: "0 0 7.5%", maxWidth: "7.5%" }}>
                                                <label className="form-label text-sm">VAT%</label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={part.vat}
                                                    onChange={e => handleChange(idx, partIdx, "vat", e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="col " style={{ flex: "0 0 12.5%", maxWidth: "12.5%" }}>
                                                <label className="form-label text-sm">ราคารวม</label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={part.total || ""}
                                                    disabled
                                                />
                                            </div>

                                            <div className={`col-lg-1 d-flex justify-content-center align-items-center mt-3 ${isEditing ? "" : " d-none"}`} style={{ flex: "0 0 4.5%", maxWidth: "4.5%" }} >
                                                <button
                                                    className={`btn btn-sm btn-danger`}
                                                    type="button"
                                                    onClick={() => handleRemovePart(idx, partIdx)}
                                                    disabled={!isEditing}
                                                >
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                            </div>

                                        </div>
                                    ))}

                                    {isEditing && (
                                        <div className="d-flex justify-content-end mb-3">
                                            <button
                                                className="btn btn-outline-primary"
                                                type="button"
                                                onClick={() => handleAddPart(idx)}
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
                    </div>




                    {isEditing && (
                        <>
                            <div className="text-center mb-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-success"
                                    onClick={handleAddQuotation}
                                >
                                    เพิ่มใบเสนอราคา <i className="bi bi-plus-square-fill"></i>
                                </button>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary me-2">
                                    บันทึก
                                </button>
                                <button
                                    type="reset"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        resetFormToInitial();
                                        setIsEditing(false);
                                    }}
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </form>


            {isOpenModalVehicleParteDtails && (
                <Modal_vehicle_parts_details
                    isOpen={isOpenModalVehicleParteDtails}
                    onClose={handleClossModalVehicleParteDtails}
                    onSubmit={(data) =>
                        handleDataFromAddModal(selectedQuotationIndex, selectedPartIndex, data)
                    }
                />
            )}

            {isOpenModalVendorDetails && (
                <Modal_vandor_show_search
                    isOpen={isOpenModalVendorDetails}
                    onClose={handleCloseModalVendorDetails}
                    onSubmit={(data) => handleDataFromModalVehicleShowSearch(data)}
                />
            )}
        </div>
    );
};

export default MainternanceAnalysis_showEdit;