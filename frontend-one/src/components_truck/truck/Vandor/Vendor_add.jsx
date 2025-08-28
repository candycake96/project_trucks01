import axios from "axios";
import React, { useEffect, useState } from "react";

import Modal_orginization_type_details from "./modal/Modal_orginization_type_details";
import Modal_vandor_type from "./modal/Modal_vander_type";
import Modal_service_type from "./modal/Modal_service_type";
import { apiUrl } from "../../../config/apiConfig";

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


    const [errors, setErrors] = useState({});

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

        // ✅ real-time validation
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // ✅ validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formDataVendor.vendor_name) newErrors.vendor_name = "กรุณากรอกชื่อผู้ขาย / อู่";
        if (!formDataVendor.phone) newErrors.phone = "กรุณากรอกเบอร์โทร";
        if (!formDataVendor.organization_type_id) newErrors.organization_type_id = "กรุณาเลือกประเภทองค์กร";
        if (!formDataVendor.vendor_type_id) newErrors.vendor_type_id = "กรุณาเลือกหมวดหมู่";
        if (!formDataVendor.email) {
            newErrors.email = "กรุณากรอกอีเมล";
        } else if (!/\S+@\S+\.\S+/.test(formDataVendor.email)) {
            newErrors.email = "อีเมลไม่ถูกต้อง";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
            return;
        }

        const payload = new FormData();
        Object.keys(formDataVendor).forEach((key) => {
            if (key === "file_vendor" && formDataVendor[key]) {
                payload.append(key, formDataVendor[key]);
            } else if (key !== "file_vendor") {
                payload.append(key, formDataVendor[key]);
            }
        });

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
                remarks: "",
                service_id: [],
            });
            setMessage(response.data.message || "บันทึกข้อมูลสำเร็จ");
            setMessageType("success");
            setErrors({});
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการส่งข้อมูล", error);
            alert("เกิดข้อผิดพลาดในการบันทึก");
            setMessage("ไม่สามารถบันทึกข้อมูลได้");
            setMessageType("error");
        }
    };

    const fetchVendorType = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vendor_type_show`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            setVendorType(response.data);
        } catch (error) { }
    };

    const fetchOrganizationType = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vendor_organization_type_show`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            setOrganization(response.data);
        } catch (error) { }
    };

    const fetchVendorServiceType = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vendor_service_types_show`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            setVandorServiceType(response.data);
        } catch (error) { }
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

    // modal handlers
    const handleOpenModalOrpganizition = () => setOpenModalOrganizition(true);
    const handleClossModalOrganizition = () => setOpenModalOrganizition(false);

    const handleOpenModalVendorType = () => setOpenModalVendolType(true);
    const handleClossModalVerdorType = () => setOpenModalVendolType(false);

    const handleOpenModaalServiceType = () => setOpenModalServitType(true);
    const handleClossModalServiceType = () => setOpenModalServitType(false);

    return (
        <div className="container">
            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="mb-0 fw-bold fs-5">เพิ่มข้อมูลผู้จำหน่ายสินค้า / อู่ซ่อม</p>
                    <a
                        role="button"
                        className="link-primary text-decoration-underline"
                        onClick={() => window.history.back()}
                        style={{ cursor: "pointer" }}
                    >
                        <i className="bi bi-arrow-left-circle me-1"></i> ย้อนกลับ
                    </a>
                </div>

                <div className="d-flex mb-1">
                    <button type="button" className="btn btn-secondary px-4 me-1" onClick={handleOpenModalOrpganizition}>
                        ประเภทองค์กร
                    </button>
                    <button type="button" className="btn btn-secondary px-4 me-1" onClick={handleOpenModalVendorType}>
                        หมวดหมู่
                    </button>
                    <button type="button" className="btn btn-secondary px-4 me-1" onClick={handleOpenModaalServiceType}>
                        ประเภทการบริการ
                    </button>
                </div>
                <hr />
            </div>

            <div className="mb-3">
                <form onSubmit={handleSubmit}>
                    <div className="card p-3 shadow-sm">
                        <h6 className="mb-4 fw-bold">เพิ่มข้อมูลผู้จำหน่ายสินค้า / อู่ซ่อม</h6>

                        {/* ✅ แจ้งเตือน */}
                        {message && (
                            <div className="p-1">
                                <div
                                    className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                                >
                                    {message}
                                </div>
                            </div>
                        )}

                        <div className="row g-2 mb-3">
                            {/* vendor_name */}
                            <div className="col-sm-6">
                                <label className="form-label">ชื่อผู้ขาย / อู่ <span className="text-danger">*</span></label>
                                <input
                                    className={`form-control ${errors.vendor_name ? "is-invalid" : ""}`}
                                    name="vendor_name"
                                    value={formDataVendor.vendor_name}
                                    onChange={handleChange}
                                />
                                {errors.vendor_name && <div className="invalid-feedback">{errors.vendor_name}</div>}
                            </div>

                            {/* tax_id */}
                            <div className="col-sm-6">
                                <label className="form-label">เลขผู้เสียภาษี</label>
                                <input
                                    className="form-control"
                                    name="tax_id"
                                    value={formDataVendor.tax_id}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* phone */}
                            <div className="col-sm-4">
                                <label className="form-label">เบอร์โทร <span className="text-danger">*</span></label>
                                <input
                                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                    name="phone"
                                    value={formDataVendor.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>

                            {/* contact_person */}
                            <div className="col-sm-4">
                                <label className="form-label">ผู้ติดต่อ</label>
                                <input
                                    className="form-control"
                                    name="contact_person"
                                    value={formDataVendor.contact_person}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* email */}
                            <div className="col-sm-4">
                                <label className="form-label">อีเมล <span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    name="email"
                                    value={formDataVendor.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            {/* credit_terms */}
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

                            {/* organization_type_id */}
                            <div className="col-sm-4">
                                <label className="form-label">ประเภทองค์กร <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.organization_type_id ? "is-invalid" : ""}`}
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
                                {errors.organization_type_id && (
                                    <div className="invalid-feedback">{errors.organization_type_id}</div>
                                )}
                            </div>

                            {/* vendor_type_id */}
                            <div className="col-sm-4">
                                <label className="form-label">หมวดหมู่ <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.vendor_type_id ? "is-invalid" : ""}`}
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
                                {errors.vendor_type_id && (
                                    <div className="invalid-feedback">{errors.vendor_type_id}</div>
                                )}
                            </div>

                            {/* address */}
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

                            {/* delivery_address */}
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

                            {/* warranty_policy */}
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

                            {/* remarks */}
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

                            {/* file */}
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

                        {/* Service type */}
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

            {/* modals */}
            {isOpenModalOrganizition && (
                <Modal_orginization_type_details
                    isOpen={isOpenModalOrganizition}
                    onClose={handleClossModalOrganizition}
                />
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
