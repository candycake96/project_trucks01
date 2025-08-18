import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";

const Modal_vendor_edit = ({isOpen, onClose, isData}) => {
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

    useEffect(() => {
        if (isData) {
            setFormDataVendor({
                vendor_name: isData.vendor_name || "",
                contact_person: isData.contact_person || "",
                phone: isData.phone || "",
                email: isData.email || "",
                address: isData.address || "",
                delivery_address: isData.delivery_address || "",
                tax_id: isData.tax_id || "",
                organization_type_id: isData.organization_type_id || "",
                file_vendor: isData.file_vendor || null,
                credit_terms: isData.credit_terms || "",
                warranty_policy: isData.warranty_policy || "",
                vendor_type_id: isData.vendor_type_id || "",
                remarks: isData.remarks || "",
                service_id: isData.service_id || [],
            });
        }
    }, [isData]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormDataVendor((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormDataVendor((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormDataVendor((prev) => {
            const updatedServices = checked
                ? [...prev.service_id, value]
                : prev.service_id.filter((id) => id !== value);
            return { ...prev, service_id: updatedServices };
        });
    };

    if (!isData) return null;

    return(
        <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        ariaHideApp={false}
        contentLabel="Vendor Details"
        style={{
            content: {
                width: "90%",
                maxWidth: "950px",
                maxHeight: "80vh",
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
        <div className="p-3">
            <div className="text-center mb-3">
                <p className="fw-bolder ">
                    แก้ไขข้อมูลผู้จำหน่ายสินค้า / อู่ซ่อม
                </p>
            </div>
<div className="mb-3">



<div className="mb-3">
                <form >
                    <div className="">
                       
{/* 
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
                        )} */}

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
                                    {/* {isOrganization.map((row, index) => (
                                        <option key={index} value={row.organization_type_id}>
                                            {row.organization_type_name}
                                        </option>
                                    ))} */}
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
                                    {/* {isVendorType.map((row, index) => (
                                        <option key={index} value={row.vendor_type_id}>
                                            {row.vendor_type_name}
                                        </option>
                                    ))} */}
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
                                                {/* ประเภทการบริการ (checkbox) */}
                                                <div className="mb-3">
                            <label className="form-label">ประเภทการบริการ</label>
                            <div>
                                {/* ตัวอย่าง mock service checkbox */}
                                {/* สมมุติคุณมี isVendorServiceType */}
                                {/* {isVendorServiceType.map((row) => ( */}
                                {/* จำลองไว้ก่อน */}
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="service-1"
                                        value="1"
                                        checked={formDataVendor.service_id.includes("1")}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className="form-check-label" htmlFor="service-1">
                                        ตัวอย่างบริการ
                                    </label>
                                </div>
                                {/* ))} */}
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


</div>
        </div>
        </ReactModal>
    )
};

export default Modal_vendor_edit;
