import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // ใช้ดึงข้อมูลที่ถูกส่งมาจากหน้าอื่นผ่าน <Link to="..." state={...} />
import { apiUrl } from "../../../config/apiConfig";
import Modal_vehicle_parts_details from "../Parts/Modal/Modal_vehicle_parts_details";
import { useNavigate } from 'react-router-dom';

const RepairRequestFormEdit = () => {

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        request_id: "",
        request_informer_emp_id: "",
        request_no: "",
        request_date: "",
        status: "",
        reg_id: "",
        car_mileage: "",
        fname: "",
        lname: "",
        reg_number: "",
    });



    const location = useLocation();
    const [dataRepairID] = useState(location.state || {}); // รับค่าจาก state ที่ส่งมาผ่าน Link
    // console.log(dataRepairID); // ✅ ตรวจสอบข้อมูลที่ถูกส่งมา
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: "numeric", month: "numeric", day: "numeric", calendar: "gregory" };
        return date.toLocaleDateString("th-TH-u-ca-gregory", options);
    };

    const [requestParts, setRequestParts] = useState([]);
    // ดึงข้อมูลจาก API
    useEffect(() => {
        const fetchRequestAndParts = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/repair_requests_and_part_detail/${dataRepairID?.request_id}`,
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

        if (dataRepairID?.request_id) {
            fetchRequestAndParts();
        }
    }, [dataRepairID]);


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


    // เมื่อ requestParts มีข้อมูลแล้ว ค่อย setFormData
    useEffect(() => {
        if (requestParts?.request_id) {
            setFormData({
                request_id: requestParts.request_id,
                request_informer_emp_id: requestParts.request_informer_emp_id,
                request_no: requestParts.request_no,
                request_date: requestParts.request_date,
                status: requestParts.status,
                reg_id: requestParts.reg_id,
                car_mileage: requestParts.car_mileage,
                fname: requestParts.fname,
                lname: requestParts.lname,
                reg_number: requestParts.reg_number,
            });
            if (Array.isArray(requestParts.parts_used)) {
                const mappedParts = requestParts.parts_used.map((item) => {
                    const price = parseFloat(item.repair_part_price) || 0;
                    const qty = parseFloat(item.repair_part_qty) || 0;
                    const vat = parseFloat(item.repair_part_vat) || 0;
                    const subtotal = price * qty;
                    const total = subtotal + (subtotal * vat / 100);
                    return {
                        item_id: item.item_id || "",
                        request_id: item.request_id || "",
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
                setParts(mappedParts);
            } else {
                setParts([]);
            }
        }
    }, [requestParts]);

    const [summary, setSummary] = useState({
        total: 0,
        vat: 0,
        grandTotal: 0,
    });


    const [isOpenModalVehicleParteDtails, setOpenModalVehicleParteDtails] = useState(false);
    const [selectedPartIndex, setSelectedPartIndex] = useState(null);

    const [parts, setParts] = useState([
        { item_id: "", request_id: "", parts_used_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" },
    ]);

    const handleAddPart = () => {
        setParts([...parts, { item_id: "", request_id: "", parts_used_id: "", part_id: "", system_name: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" }]);
    };



    // ฟังก์ชันรับข้อมูลจาก Modal_vehicle_parts_add
    const handleDataFromAddModal = (data) => {
        if (selectedPartIndex !== null) {
            const updatedParts = [...parts];
            updatedParts[selectedPartIndex] = {
                ...updatedParts[selectedPartIndex],
                ...data
            };
            setParts(updatedParts);
            setSelectedPartIndex(null); // reset after update
        } else {
            setParts([...parts, data]); // fallback: add new
        }
    };

    // ฟังก์ชันลบข้อมูลอะไหล่
    const handleRemovePart = (index) => {
        const updatedParts = [...parts];
        updatedParts.splice(index, 1);
        setParts(updatedParts);
    };


    // ฟังก์ชันการเปลี่ยนแปลงข้อมูลอะไหล่  
    const handleChange = (index, field, value) => {
        const updatedParts = [...parts];
        updatedParts[index][field] = value;

        // แปลงเป็นตัวเลขเพื่อคำนวณ
        const price = parseFloat(updatedParts[index].price) || 0;
        const qty = parseFloat(updatedParts[index].qty) || 0;
        const vat = parseFloat(updatedParts[index].vat) || 0;
        const discount = parseFloat(updatedParts[index].discount) || 0;

        const subtotal = price * qty;
        const total = subtotal + (subtotal * vat / 100); // รวม VAT
        // const grandTotal = total - discount; 
        updatedParts[index].total = total.toFixed(2); // เก็บทศนิยม 2 ตำแหน่ง

        setParts(updatedParts);

    };

    // Modal
    const handleOpenModalVehicleParteDtails = (index) => {
        setSelectedPartIndex(index);
        setOpenModalVehicleParteDtails(true);
    }
    const handleClossModalVehicleParteDtails = () => {
        setOpenModalVehicleParteDtails(false);
    }




    useEffect(() => {
        let total = 0;
        let vatAmount = 0;

        parts.forEach((part) => {
            const price = parseFloat(part.price) || 0;
            const qty = parseFloat(part.qty) || 0;
            const vat = parseFloat(part.vat) || 0;

            const subtotal = price * qty;
            const vatVal = subtotal * vat / 100;

            total += subtotal;
            vatAmount += vatVal;
        });

        setSummary({
            total: total.toFixed(2),
            vat: vatAmount.toFixed(2),
            grandTotal: (total + vatAmount).toFixed(2),
        });

    }, [parts]);



    const handleChangeRequestjob = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmitMaintenance = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setErrorMessage("Access token is missing. Please log in again.");
            return;
        }

        try {
            const response = await axios.put(
                `${apiUrl}/api/repair_requests_edit/${formData.request_id}`,
                {
                    ...formData,
                    parts: parts // สมมติว่า parts เป็น array หรือ object
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Updated successfully:", response.data);
            setMessage(response.data.message);
            setMessageType("success");
        } catch (error) {
            console.error("Error updating:", error);
            setMessage("เกิดข้อผิดพลาด");
            setMessageType("error");
        }
    };




    return (
        <div className="p-3">
            <div className="container">
                <div className="mb-3 ">
                    <nav aria-label="breadcrumb" style={{ color: '#0000FF' }}>
                        <div className="d-flex justify-content-between align-items-center small">
                            <ol className="breadcrumb mb-0 d-flex align-items-center" style={{ gap: '0.5rem' }}>
                                <li className="breadcrumb-item">
                                    <Link to="/truck/MaintenanceRequest">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </li>
                                <i className="bi bi-chevron-right"></i>

                                <li>
                                    <Link to="/truck/MaintenanceRequest"> รายการแจ้งซ่อมเกี่ยวกับบำรุงรักษา </Link>
                                </li>
                                <i className="bi bi-chevron-right"></i>

                                <li className="breadcrumb-item">
                                    <Link to="/truck/MaintenanceJob" state={dataRepairID}> รายละเอียดการซ่อม </Link>
                                </li>
                                <i className="bi bi-chevron-right"></i>

                                <li className="breadcrumb-item active" aria-current="page">
                                    แก้ไขแจ้งซ่อม
                                </li>
                            </ol>
                        </div>
                    </nav>

                </div>
                <div className="mb-1">
                    <p className="fw-bolder fs-4">
                        Repair Details Edit
                    </p>
                </div>
                <hr className="mb-3" />
                <div className="mb-2">
                    <div className="mb-2">
                        {/* <div className="d-flex justify-content-end">
        <button className="btn btn-primary me-1">Report  <i class="bi bi-printer-fill"></i></button>
        <button className="btn btn-primary">Edit  <i class="bi bi-pencil-fill"></i></button>
    </div> */}
                    </div>

                </div>
                <div className="card">
                    <div className="card-body">
                        {/* Display success or error message */}
                        {message && (
                            <div
                                className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                            >
                                {message}
                            </div>
                        )}
                        <form action="" onSubmit={handleSubmitMaintenance}>
                            <div className="row">
                                <div className="col-lg-3 mb-3">
                                    <label className="form-label">เลขที่ใบแจ้งซ่อม</label>
                                    <input type="text" className="form-control" value={(formData?.request_no || "")} disabled />
                                </div>
                                <div className="col-lg-3 mb-3">
                                    <label className="form-label">วันที่แจ้ง</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData?.request_date?.slice(0, 10) || ""} // Keep it ISO format
                                        disabled
                                    />

                                </div>
                                <div className="col-lg-3 mb-3">
                                    <label className="form-label">ผู้แจ้ง</label>
                                    <input type="text" className="form-control" value={(formData?.fname || "") + " " + (formData?.lname || "")} disabled
                                    />
                                </div>
                                <div className="col-lg-3 mb-3">
                                    <label className="form-label">ตำแหน่ง</label>
                                    <input type="text" className="form-control" disabled />
                                </div>
                                <div className="col-lg-3 mb-3">
                                    <label className="form-label">ทะเบียนรถ <span className="" style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="reg_number"
                                        value={formData?.reg_number}
                                        onChange={handleChangeRequestjob}
                                    // disabled
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">เลขไมล์ปัจจุบัน <span className="" style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="car_mileage"
                                        value={formData?.car_mileage}
                                        onChange={handleChangeRequestjob}
                                    // disabled
                                    />
                                </div>
                            </div>

                            <hr />
                            {/* <p className="">รายการอะไหล่</p> */}
                            <div className="mb-3"
                                style={{ overflowX: "auto" }}
                            >


                                {parts.map((part, index) => (

                                    <div className="row  mb-3" key={index}>
                                        <input type="hidden" value={part.part_id} onChange={(e) => handleChange(index, "part_id", e.target.value)} /> {/* part_id */}
                                        <div className="col-lg-1">
                                            <label className="form-label text-sm">ระบบ</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={part.system_name}
                                                onChange={(e) => handleChange(index, "system_name", e.target.value)} disabled
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label htmlFor={`partSearch-${index}`} className="form-label text-sm">อะไหล่ <span className="" style={{ color: "red" }}>*</span></label>
                                            <div className="input-group input-group-sm">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id={`partSearch-${index}`}
                                                    value={part.part_name}
                                                    onChange={(e) => handleChange(index, "part_name", e.target.value)}
                                                    placeholder="ค้นหาอะไหล่..."

                                                />
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    type="button"
                                                    onClick={() => handleOpenModalVehicleParteDtails(index)}
                                                >
                                                    <i className="bi bi-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-lg-1">
                                            <label className="form-label text-sm">ประเภท <span className="" style={{ color: "red" }}>*</span></label>
                                            <select
                                                className="form-select  mb-3  form-select-sm"
                                                aria-label="Large select example"
                                                value={part.maintenance_type}
                                                onChange={(e) => handleChange(index, "maintenance_type", e.target.value)}
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
                                                value={part.item_id}
                                                onChange={(e) => handleChange(index, "item_id", e.target.value)}
                                            >
                                                <option value=""></option>
                                                {dataItem.map((row, ndx) => (
                                                    <option value={row.item_id} key={ndx}> {row.item_name}</option>
                                                ))}
                                                <option value="อื่นๆ">อื่นๆ</option>
                                            </select>
                                        </div>

                                        <div className="col-lg-1">
                                            <label className="form-label text-sm">ราคา <span className="" style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={part.price}
                                                onChange={(e) => handleChange(index, "price", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-lg-1">
                                            <label className="form-label text-sm">หน่วย <span className="" style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={part.unit}
                                                onChange={(e) => handleChange(index, "unit", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-lg-1">
                                            <label className="form-label text-sm">จำนวน <span className="" style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={part.qty}
                                                onChange={(e) => handleChange(index, "qty", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-lg-1">
                                            <label className="form-label text-sm" >VAT <span className="" style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={part.vat}
                                                onChange={(e) => handleChange(index, "vat", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label className="form-label text-sm">ราคารวม</label>

                                            <div className=" d-flex justify-content-center align-items-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm me-1"
                                                    value={part.total || ""}
                                                    onChange={(e) => handleChange(index, "total", e.target.value)} // REMOVE THIS
                                                    disabled
                                                />
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    type="button"
                                                    onClick={() => handleRemovePart(index)}
                                                >
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                            </div>
                                        </div>


                                    </div>

                                ))}





                            </div>

                            <div className="d-flex justify-content-end mb-3">
                                <button className="btn btn-outline-primary" type="button" onClick={handleAddPart}>
                                    เพิ่มรายการอะไหล่
                                </button>
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

                            <div className="text-center">
                                <button type="submit" className="btn btn-primary me-1">บันทึก</button>
                                <Link to="/truck/MaintenanceJob" state={dataRepairID} className="btn btn-secondary">
                                    ยกเลิก
                                </Link>
                            </div>
                        </form>


                    </div>
                </div>
            </div>

            {isOpenModalVehicleParteDtails && (
                <Modal_vehicle_parts_details
                    isOpen={isOpenModalVehicleParteDtails} onClose={handleClossModalVehicleParteDtails} onSubmit={handleDataFromAddModal} />
            )}


        </div>
    );
};

export default RepairRequestFormEdit;
