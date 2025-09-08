import React, { useEffect, useState } from "react";
import Modal_vehicle_parts_details from "../Parts/Modal/Modal_vehicle_parts_details";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";
import Modal_Check_PM from "./Mobal/Modal_Check_PM";
import { useLocation } from "react-router-dom";
import Modal_pm_show_all from "../PreventiveMaintenance/Modal/Modal_pm_show_all";

const RepairRequestForm = () => {

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [formData, setFormData] = useState({
        emp_id: "",
        reg_number: "",
        odometer: "",
    });



    const [user, setUser] = useState(null);
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // "YYYY-MM-DD"
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // ////
    const [summary, setSummary] = useState({
        total: 0,
        vat: 0,
        grandTotal: 0,
    });

    const location = useLocation();
    const [rowMiData] = useState(location.state || {});
    const carData = rowMiData;
    useEffect(() => {
        if (user && carData) {
            setFormData({
                reg_number: carData.reg_number || '',
                emp_id: user.id_emp || '',
                odometer: ''
            });
        }
    }, [user, carData]);


    const [isOpenCheckPM, setOpenCheckPM] = useState(false);
    const [isOpenModalVehicleParteDtails, setOpenModalVehicleParteDtails] = useState(false);
    const [selectedPartIndex, setSelectedPartIndex] = useState(null);

    const [parts, setParts] = useState([
        { part_id: "", system: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" },
    ]);

    const handleAddPart = () => {
        setParts([...parts, { part_id: "", system: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" }]);
    };

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



    // Modal
    const handleOpenModalChackPM = () => setOpenCheckPM(true);
    const handleClossModalChackPM = () => setOpenCheckPM(false);

    const handleMaintenanceAdd = async (e) => {
        e.preventDefault(); // ป้องกันการ reload หน้า
        console.log("ข้อมูล formData", formData);
        console.log("ข้อมูล parts", parts);
        try {
            const response = await axios.post(
                `${apiUrl}/api/repair_requests_add`,
                {
                    ...formData,
                    parts: parts
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
            setFormData({
                reg_number: '',
                emp_id: '',
                odometer: ''
            });
            setParts([
                { part_id: "", system: "", part_name: "", price: "", unit: "", maintenance_type: "", qty: "", discount: "", vat: "", total: "" },
            ])
            setMessage(response.data.message);
            setMessageType("success");
        } catch (error) {
            console.error("Error saving  data:", error);
            setMessage("เกิดข้อผิดพลาด");
            setMessageType("error");
        }
    };






    return (
        <div className=" p-3">
            <div className="mb-1">
                <nav aria-label="breadcrumb" style={{ color: '#0000FF' }}>
                    <div className="d-flex justify-content-between align-items-center small">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link to="/truck/MaintenanceRequest">
                                    <i className="bi bi-arrow-left"></i>
                                </Link>
                            </li>
                            <i className="bi bi-chevron-right"></i>
                            <li className="breadcrumb-item">
                                <Link to="/truck/MaintenanceRequest">รายการแจ้งซ่อมเกี่ยวกับบำรุงรักษา</Link>
                            </li>
                            <i className="bi bi-chevron-right"></i>
                            <li className="breadcrumb-item active" aria-current="page">
                                ฟอร์มแจ้งซ่อม
                            </li>
                        </ol>
                        <button className="btn btn-sm btn-primary" onClick={() => handleOpenModalChackPM()}>
                            ตรวจสอบ PM
                        </button>
                    </div>
                </nav>
            </div>

            <div className=" mb-1">
                <p className="fw-bolder fs-4">ฟอร์มแจ้งซ่อม</p>
            </div>

            <hr className="mb-3" />

            <div className="card mb-3">
                <div className="card-body">
                    {/* Display success or error message */}
                    {message && (
                        <div
                            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                        >
                            {message}
                        </div>
                    )}

                    <form action="" onSubmit={handleMaintenanceAdd}>
                        <div className="row">
                            <div className="col-lg-3 mb-3">
                                <label className="form-label">เลขที่ใบแจ้งซ่อม</label>
                                <input type="text" className="form-control" value="xxxxxxxx-x" disabled />
                            </div>
                            <div className="col-lg-3 mb-3">
                                <label className="form-label">วันที่แจ้ง</label>
                                <input type="date" className="form-control" value={date} disabled />
                            </div>
                            <div className="col-lg-3 mb-3">
                                <label className="form-label">ผู้แจ้ง</label>
                                <input type="text" className="form-control" value={(user?.fname || "") + " " + (user?.lname || "")} disabled
                                />
                            </div>
                            <div className="col-lg-3 mb-3">
                                <label className="form-label">ตำแหน่ง</label>
                                <input type="text" className="form-control" value={user?.position_name || ""} disabled />
                            </div>
                            <div className="col-lg-3 mb-3">
                                <label className="form-label">ทะเบียนรถ <span className="" style={{ color: "red" }}>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="reg_number"
                                    value={formData?.reg_number}
                                    onChange={handleChangeRequestjob}
                                />
                            </div>
                            <div className="col-lg-3">
                                <label className="form-label">เลขไมล์ปัจจุบัน <span className="" style={{ color: "red" }}>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="odometer"
                                    value={formData?.odometer}
                                    onChange={handleChangeRequestjob}
                                />
                            </div>
                        </div>

                        <hr />
                        {/* <p className="">รายการอะไหล่</p> */}
                        <div className=""
                            style={{ overflowX: "auto" }}
                        >
                            {parts.map((part, index) => (

                                <div className="row  mb-3" key={index}>
                                    <input type="hidden" value={part.part_id} onChange={(e) => handleChange(index, "part_id", e.target.value)} /> {/* part_id */}
                                    <div className="col-lg-2">
                                        <label className="form-label text-sm">ระบบ</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={part.system_name}
                                            onChange={(e) => handleChange(index, "system", e.target.value)} disabled
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
                                            <option value="PM">PM </option>

                                        </select>
                                    </div>

                                    {/* <div className="col-lg-2">
                                        <label className="form-label text-sm">ข้อมูลเชิงวิเคราะห์ <span className="" style={{ color: "red" }}>*</span></label>
                                        <select
                                            className="form-select  mb-3  form-select-sm"
                                            aria-label="Large select example"
                                            value={part.item_id}
                                            onChange={(e) => handleChange(index, "item_id", e.target.value)}
                                        >
                                            <option value="">ไม่ต้องการ</option>
                                            {dataItem.map((row, ndx) => (
                                                <option value={row.item_id} key={ndx}> {row.item_name}</option>
                                            ))}
                                        </select>
                                    </div> */}

                                    <div className="col-lg-2">
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

                                        <div className=" d-flex justify-content-center align-items-center ">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm me-2"
                                                value={part.total}
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
                            <button type="submit" className="btn btn-primary">บันทึก</button>
                        </div>
                    </form>

                </div>
            </div>
            {isOpenModalVehicleParteDtails && (
                <Modal_vehicle_parts_details
                    isOpen={isOpenModalVehicleParteDtails} onClose={handleClossModalVehicleParteDtails} onSubmit={handleDataFromAddModal} />
            )}

            {isOpenCheckPM && (
                <Modal_pm_show_all isOpen={isOpenCheckPM} onClose={handleClossModalChackPM} />
                // <Modal_Check_PM isOpen={isOpenCheckPM} onClose={handleClossModalChackPM} />
            )}
        </div>

    );
};

export default RepairRequestForm;
