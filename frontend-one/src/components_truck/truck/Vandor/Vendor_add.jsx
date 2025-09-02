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
  const [isOpenModalOrganizition, setOpenModalOrganizition] = useState(false);
  const [isOpenModalVendolType, setOpenModalVendolType] = useState(false);
  const [isOpenModalServiceType, setOpenModalServitType] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormDataVendor({ ...formDataVendor, [name]: files[0] });
    } else {
      setFormDataVendor({ ...formDataVendor, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

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
    payload.append("formDataVendor", JSON.stringify(formDataVendor));

    try {
      const response = await axios.post(`${apiUrl}/api/vendor_add`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setMessage(response.data.message || "บันทึกข้อมูลสำเร็จ");
      setMessageType("success");
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
      setErrors({});
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งข้อมูล", error);
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
    } catch {}
  };

  const fetchOrganizationType = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/vendor_organization_type_show`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setOrganization(response.data);
    } catch {}
  };

  const fetchVendorServiceType = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/vendor_service_types_show`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setVandorServiceType(response.data);
    } catch {}
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
      setFormDataVendor({ ...formDataVendor, service_id: [...updated, value] });
    } else {
      setFormDataVendor({ ...formDataVendor, service_id: updated.filter((v) => v !== value) });
    }
  };

  return (
    <div className="container py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary">
          <i className="bi bi-person-plus-fill me-2"></i>
          เพิ่มข้อมูลผู้จำหน่าย / อู่ซ่อม
        </h4>
        <a
          role="button"
          className="text-decoration-none text-secondary"
          onClick={() => window.history.back()}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-arrow-left-circle me-1"></i> ย้อนกลับ
        </a>
      </div>

      {/* Action buttons */}
      <div className="mb-3">
        <button className="btn btn-outline-secondary me-2" onClick={() => setOpenModalOrganizition(true)}>
          <i className="bi bi-building me-1"></i> ประเภทองค์กร
        </button>
        <button className="btn btn-outline-secondary me-2" onClick={() => setOpenModalVendolType(true)}>
          <i className="bi bi-tags-fill me-1"></i> หมวดหมู่
        </button>
        <button className="btn btn-outline-secondary" onClick={() => setOpenModalServitType(true)}>
          <i className="bi bi-gear-fill me-1"></i> ประเภทการบริการ
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm p-4 rounded-3">
          {/* Message */}
          {message && (
            <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} mb-3`}>
              {message}
            </div>
          )}

          {/* Inputs */}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">ชื่อผู้ขาย / อู่ <span className="text-danger">*</span></label>
              <input
                className={`form-control ${errors.vendor_name ? "is-invalid" : ""}`}
                name="vendor_name"
                value={formDataVendor.vendor_name}
                onChange={handleChange}
              />
              {errors.vendor_name && <div className="invalid-feedback">{errors.vendor_name}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">เลขผู้เสียภาษี</label>
              <input className="form-control" name="tax_id" value={formDataVendor.tax_id} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label">เบอร์โทร <span className="text-danger">*</span></label>
              <input
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                name="phone"
                value={formDataVendor.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">ผู้ติดต่อ</label>
              <input
                className="form-control"
                name="contact_person"
                value={formDataVendor.contact_person}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
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

            <div className="col-md-4">
              <label className="form-label">เครดิต (วัน)</label>
              <input
                type="number"
                className="form-control"
                name="credit_terms"
                value={formDataVendor.credit_terms}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">ประเภทองค์กร <span className="text-danger">*</span></label>
              <select
                className={`form-select ${errors.organization_type_id ? "is-invalid" : ""}`}
                name="organization_type_id"
                value={formDataVendor.organization_type_id}
                onChange={handleChange}
              >
                <option value="">เลือกประเภท</option>
                {isOrganization.map((row, i) => (
                  <option key={i} value={row.organization_type_id}>
                    {row.organization_type_name}
                  </option>
                ))}
              </select>
              {errors.organization_type_id && <div className="invalid-feedback">{errors.organization_type_id}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">หมวดหมู่ <span className="text-danger">*</span></label>
              <select
                className={`form-select ${errors.vendor_type_id ? "is-invalid" : ""}`}
                name="vendor_type_id"
                value={formDataVendor.vendor_type_id}
                onChange={handleChange}
              >
                <option value="">เลือกหมวดหมู่</option>
                {isVendorType.map((row, i) => (
                  <option key={i} value={row.vendor_type_id}>
                    {row.vendor_type_name}
                  </option>
                ))}
              </select>
              {errors.vendor_type_id && <div className="invalid-feedback">{errors.vendor_type_id}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">ที่อยู่</label>
              <textarea
                className="form-control"
                name="address"
                value={formDataVendor.address}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">ที่อยู่จัดส่ง</label>
              <textarea
                className="form-control"
                name="delivery_address"
                value={formDataVendor.delivery_address}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">การรับประกัน</label>
              <textarea
                className="form-control"
                name="warranty_policy"
                value={formDataVendor.warranty_policy}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">หมายเหตุ</label>
              <textarea
                className="form-control"
                name="remarks"
                value={formDataVendor.remarks}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">ไฟล์แนบ</label>
              <input type="file" className="form-control" name="file_vendor" onChange={handleChange} />
            </div>
          </div>

          {/* Service type */}
          <div className="mt-3">
            <label className="form-label fw-bold">ประเภทการบริการ</label>
            <div className="d-flex flex-wrap gap-3">
              {isVendorSeviceType.map((row) => (
                <div className="form-check" key={row.service_id}>
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

          <div className="text-end mt-4">
            <button type="submit" className="btn btn-success px-4">
              <i className="bi bi-save me-2"></i> บันทึก
            </button>
          </div>
        </div>
      </form>

      {/* Modals */}
      {isOpenModalOrganizition && (
        <Modal_orginization_type_details isOpen={isOpenModalOrganizition} onClose={() => setOpenModalOrganizition(false)} />
      )}
      {isOpenModalVendolType && <Modal_vandor_type isOpen={isOpenModalVendolType} onClose={() => setOpenModalVendolType(false)} />}
      {isOpenModalServiceType && <Modal_service_type isOpen={isOpenModalServiceType} onClose={() => setOpenModalServitType(false)} />}
    </div>
  );
};

export default Vendor_add;
