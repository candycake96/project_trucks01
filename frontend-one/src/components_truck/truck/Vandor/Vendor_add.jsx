import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import Modal_orginization_type_details from "./modal/Modal_orginization_type_details";
import Modal_vandor_type from "./modal/Modal_vander_type";
import Modal_service_type from "./modal/Modal_service_type";

const Vendor_add = ({ onVendorAdded }) => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isVendorType, setVendorType] = useState([]);
    const [isOrganization, setOrganization] = useState([]);
    const [isVendorSeviceType, setVandorServiceType] = useState([]);
    const [formDataVendor, setFormDataVendor] = useState({
        vendor_name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        delivery_address: "",
        tax_id: "",
        organization_type_id: "",
        file_vendor: null,
        credit_terms: "",
        warranty_policy: "",
        vendor_type_id: "",
        remarks: "",
        service_id: [],
    });

// ประเภทองค์กร
    const [isOpenModalOrganizition, setOpenModalOrganizition] = useState(false);
// หมวดหมู่
    const [isOpenModalVendolType, setOpenModalVendolType] = useState(false);
// ประเภทบริการ
    const [isOpenModalServiceType, setOpenModalServitType] = useState(false);

    
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormDataVendor({ ...formDataVendor, [name]: files[0] });
        } else {
            setFormDataVendor({ ...formDataVendor, [name]: value });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("📦 Form Submitted:", formDataVendor);

        const payload = new FormData();

        Object.keys(formDataVendor).forEach((key) => {
            if (key === "file_vendor" && formDataVendor[key]) {
                payload.append(key, formDataVendor[key]);
            } else if (key !== "file_vendor") {
                payload.append(key, formDataVendor[key]);
            }
        });

        console.log("payload to be sent:", payload);
        payload.append('formDataVendor', JSON.stringify(formDataVendor)); // ใช้ JSON.stringify()

        try {
            const response = await axios.post(
                `${apiUrl}/api/vendor_add`,
                payload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            alert("บันทึกสำเร็จ");

            // ✅ Optional: Reset form
            setFormDataVendor({
                vendor_name: "",
                contact_person: "",
                phone: "",
                email: "",
                address: "",
                delivery_address: "",
                tax_id: "",
                organization_type_id: "",
                file_vendor: null,
                credit_terms: "",
                warranty_policy: "",
                vendor_type_id: "",
                remarks: ""
            });
            setMessage(response.data.message || "บันทึกข้อมูลสำเร็จ");
            setMessageType("success");




        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการส่งข้อมูล", error);
            alert("เกิดข้อผิดพลาดในการบันทึก");
            setMessage("ไม่สามารถบันทึกข้อมูลได้");
            setMessageType("error");
        }
    };


    const fetchVendorType = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/vendor_type_show`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setVendorType(response.data);
        } catch (error) {

        }
    };

    const fetchOrganizationType = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/vendor_organization_type_show`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setOrganization(response.data);
        } catch (error) {

        }
    };

    const fetchVendorServiceType = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/vendor_service_types_show`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setVandorServiceType(response.data);
        } catch (error) {

        }
    };

    useEffect(() => {
        fetchVendorType();
        fetchOrganizationType();
        fetchVendorServiceType();
    }, []);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const updated = formDataVendor.service_id || [];

        if (checked) {
            setFormDataVendor({
                ...formDataVendor,
                service_id: [...updated, value],
            });
        } else {
            setFormDataVendor({
                ...formDataVendor,
                service_id: updated.filter((v) => v !== value),
            });
        }
    };

// ประเภทองค์กร
    const handleOpenModalOrpganizition = (data) => {
        setOpenModalOrganizition(true);
    };
    const handleClossModalOrganizition = () => {
        setOpenModalOrganizition(false);
    };

// หมวดหมู่
    const handleOpenModalVendorType = () => {
        setOpenModalVendolType(true);
    };
    const handleClossModalVerdorType = () => {
        setOpenModalVendolType(false);
    }

// xประเภทบริการ
    const handleOpenModaalServiceType = () => {
        setOpenModalServitType(true);
    }
    const handleClossModalServiceType = () => {
        setOpenModalServitType(false);
    }

    return (
        <div className="container">
            <div className=" p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="mb-0 mb-bolder fs-5">เพิ่มข้อมูลผู้จำหน่ายสินค้า / อู่ซ่อม</p>

                    <a
                        role="button"
                        className="link-primary text-decoration-underline"
                        onClick={() => window.history.back()}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className="bi bi-arrow-left-circle me-1"></i> ย้อนกลับ
                    </a>
                </div>

                <div className="d-flex mb-1">
                    <button
                        type="button"
                        className="btn btn-secondary px-4 me-1"
                        onClick={()=>handleOpenModalOrpganizition()}
                    >
                        ประเภทองค์กร
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary px-4 me-1"
                        onClick={()=>handleOpenModalVendorType()}
                    >
                        หมวดหมู่
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary px-4 me-1"
                        onClick={()=>handleOpenModaalServiceType()}
                    >
                        ประเภทการบริการ
                    </button>
                </div>
                <hr />
            </div>
            <div className="mb-3">
                <form onSubmit={handleSubmit}>
                    <div className="card p-3 shadow-sm">
                        <h6 className="mb-4 fw-bold">เพิ่มข้อมูลผู้จำหน่ายสินค้า / อู่ซ่อม</h6>

                        {message && (
                            <div className="p-1">
                                <div
                                    className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                                    style={{
                                        backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                                        color: messageType === "success" ? "#155724" : "#721c24",
                                        border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                                    }}
                                >
                                    {message}
                                </div>
                            </div>
                        )}

                        <div className="row g-2 mb-3">

                            <div className="col-sm-6">
                                <label className="form-label">ชื่อผู้ขาย / อู่</label>
                                <input
                                    className="form-control"
                                    name="vendor_name"
                                    value={formDataVendor.vendor_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">เลขผู้เสียภาษี</label>
                                <input
                                    className="form-control"
                                    name="tax_id"
                                    value={formDataVendor.tax_id}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-sm-4">
                                <label className="form-label">เบอร์โทร</label>
                                <input
                                    className="form-control"
                                    name="phone"
                                    value={formDataVendor.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-sm-4">
                                <label className="form-label">ผู้ติดต่อ</label>
                                <input
                                    className="form-control"
                                    name="contact_person"
                                    value={formDataVendor.contact_person}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-sm-4">
                                <label className="form-label">อีเมล</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formDataVendor.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-sm-4">
                                <label className="form-label">เครดิต (วัน)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="credit_terms"
                                    value={formDataVendor.credit_terms}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-sm-4">
                                <label className="form-label">ประเภทองค์กร</label>
                                <select
                                    className="form-select"
                                    name="organization_type_id"
                                    value={formDataVendor.organization_type_id}
                                    onChange={handleChange}
                                >
                                    <option value="">เลือกประเภท</option>
                                    {isOrganization.map((row, index) => (
                                        <option key={index} value={row.organization_type_id}>
                                            {row.organization_type_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-sm-4">
                                <label className="form-label">หมวดหมู่</label>
                                <select
                                    className="form-select"
                                    name="vendor_type_id"
                                    value={formDataVendor.vendor_type_id}
                                    onChange={handleChange}
                                >
                                    <option value="">เลือกหมวดหมู่</option>
                                    {isVendorType.map((row, index) => (
                                        <option key={index} value={row.vendor_type_id}>
                                            {row.vendor_type_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">ที่อยู่</label>
                                <textarea
                                    className="form-control"
                                    name="address"
                                    value={formDataVendor.address}
                                    onChange={handleChange}
                                    rows={1}
                                />
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">ที่อยู่จัดส่ง</label>
                                <textarea
                                    className="form-control"
                                    name="delivery_address"
                                    value={formDataVendor.delivery_address}
                                    onChange={handleChange}
                                    rows={1}
                                />
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">การรับประกัน</label>
                                <textarea
                                    className="form-control"
                                    name="warranty_policy"
                                    value={formDataVendor.warranty_policy}
                                    onChange={handleChange}
                                    rows={1}
                                />
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">หมายเหตุ</label>
                                <textarea
                                    className="form-control"
                                    name="remarks"
                                    value={formDataVendor.remarks}
                                    onChange={handleChange}
                                    rows={1}
                                />
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">ไฟล์แนบ</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="file_vendor"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">ประเภทการบริการ</label>
                            <div>
                                {isVendorSeviceType.map((row) => (
                                    <div className="form-check form-check-inline" key={row.service_id}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`service-${row.service_id}`}
                                            value={row.service_id}
                                            checked={formDataVendor.service_id?.includes(String(row.service_id)) || false}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label className="form-check-label" htmlFor={`service-${row.service_id}`}>
                                            {row.service_name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>






                        <div className="text-center justify-content-end mb-3">
                            <button type="submit" className="btn btn-success px-3">
                                บันทึก
                            </button>
                        </div>
                    </div>
                </form>
            </div>

{isOpenModalOrganizition && (
    <Modal_orginization_type_details isOpen={isOpenModalOrganizition} onClose={handleClossModalOrganizition} />
)}
{isOpenModalVendolType && (
    <Modal_vandor_type isOpen={isOpenModalVendolType} onClose={handleClossModalVerdorType} />
)}
{isOpenModalServiceType && (
    <Modal_service_type isOpen={isOpenModalServiceType} onClose={handleClossModalServiceType} />
)}
        </div>
    );
};

export default Vendor_add;
