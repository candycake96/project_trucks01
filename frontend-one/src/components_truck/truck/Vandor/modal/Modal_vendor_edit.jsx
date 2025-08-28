import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_vendor_edit = ({ isOpen, onClose, isData, onVendorUpdated }) => {
    const [isVendorType, setVendorType] = useState([]);
    const [isOrganization, setOrganization] = useState([]);
    const [isVendorServiceType, setVendorServiceType] = useState([]);

    const [formDataVendor, setFormDataVendor] = useState({
        vendor_id: "",
        vendor_name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        delivery_address: "",
        tax_id: "",
        organization_type_id: "",
        file_vendor: null,
        existing_file_vendor: null,
        credit_terms: "",
        warranty_policy: "",
        vendor_type_id: "",
        remarks: "",
        service_id: [],
    });

    const [isShowDataVendor, setShowDataVender] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // แปลง service_list เป็น array ของ id
    const parseServiceList = (serviceListStr) => {
        if (!serviceListStr) return [];
        return serviceListStr
            .split(",")
            .map((item) => item.split(":")[0].trim()); // ตัด whitespace / newline
    };

    const fetchVendorShowData = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/vendor_show_details/${isData?.vendor_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setShowDataVender(response.data);
        } catch (error) {
            console.error("Error fetching vendor details:", error);
        }
    };

    useEffect(() => {
        if (isData?.vendor_id) fetchVendorShowData();
    }, [isData]);

    useEffect(() => {
        if (!isShowDataVendor) return;

        const vendorInfo = Array.isArray(isShowDataVendor)
            ? isShowDataVendor[0]
            : isShowDataVendor;

        if (!vendorInfo) return; // ป้องกัน undefined

        const serviceIds = parseServiceList(vendorInfo.service_list || "").map(String);

        setFormDataVendor({
            vendor_id: vendorInfo.vendor_id || "",
            vendor_name: vendorInfo.vendor_name || "",
            contact_person: vendorInfo.contact_person || "",
            phone: vendorInfo.phone || "",
            email: vendorInfo.email || "",
            address: vendorInfo.address || "",
            delivery_address: vendorInfo.delivery_address || "",
            tax_id: vendorInfo.tax_id || "",
            organization_type_id: vendorInfo.organization_type_id || "",
            file_vendor: null,
            existing_file_vendor: vendorInfo.file_vendor || null,
            credit_terms: vendorInfo.credit_terms || "",
            warranty_policy: vendorInfo.warranty_policy || "",
            vendor_type_id: vendorInfo.vendor_type_id || "",
            remarks: vendorInfo.remarks || "",
            service_id: serviceIds,
        });
    }, [isShowDataVendor]);


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
                ? Array.from(new Set([...prev.service_id.map(String), value]))
                : prev.service_id.filter((id) => id !== value);
            return { ...prev, service_id: updatedServices };
        });
    };

    const fetchVendorType = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vendor_type_show`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            setVendorType(response.data.map(row => ({
                ...row,
                vendor_type_name: row.vendor_type_name.trim()
            })));
        } catch (error) { }
    };

    const fetchOrganizationType = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vendor_organization_type_show`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            setOrganization(response.data.map(row => ({
                ...row,
                organization_type_name: row.organization_type_name.trim()
            })));
        } catch (error) { }
    };

    const fetchVendorServiceType = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vendor_service_types_show`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            setVendorServiceType(response.data);
        } catch (error) { }
    };

    useEffect(() => {
        fetchVendorType();
        fetchOrganizationType();
        fetchVendorServiceType();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
 console.log('test : ', formDataVendor);
        const payload = new FormData();
        payload.append("formDataVendor", JSON.stringify(formDataVendor));
        if (formDataVendor.file_vendor) {
            payload.append("file_vendor", formDataVendor.file_vendor);
        }

        try {
            await axios.post(`${apiUrl}/api/vendor_update/${formDataVendor.vendor_id}`, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setMessage("แก้ไขข้อมูลสำเร็จ");
            setMessageType("success");
            fetchVendorShowData();

            if (onVendorUpdated) onVendorUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating vendor:", error);
            setMessage("ไม่สามารถแก้ไขข้อมูลได้");
            setMessageType("error");
        }
    };

    if (!isData) return null;

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="Vendor Edit"
            style={{
                content: {
                    width: "90%",
                    maxWidth: "900px",
                    maxHeight: "90vh",
                    margin: "auto",
                    padding: "0",
                    border: "none",
                    borderRadius: "0.5rem",
                    overflowY: "auto",
                },
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                },
            }}
        >
            <div className="p-4">
                <h5 className="text-center mb-3 fw-bold">
                    แก้ไขข้อมูลผู้จำหน่าย / อู่ซ่อม {isData?.vendor_id}
                </h5>

                {message && (
                    <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* ข้อมูลทั่วไป */}
                    <div className="card mb-3 shadow-sm">
                        <div className="card-header bg-primary text-white">ข้อมูลทั่วไป</div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">ชื่อผู้ขาย / อู่</label>
                                    <input className="form-control" name="vendor_name" value={formDataVendor.vendor_name} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">เลขผู้เสียภาษี</label>
                                    <input className="form-control" name="tax_id" value={formDataVendor.tax_id} onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">เบอร์โทร</label>
                                    <input className="form-control" name="phone" value={formDataVendor.phone} onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">ผู้ติดต่อ</label>
                                    <input className="form-control" name="contact_person" value={formDataVendor.contact_person} onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">อีเมล</label>
                                    <input type="email" className="form-control" name="email" value={formDataVendor.email} onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">เครดิต (วัน)</label>
                                    <input type="number" className="form-control" name="credit_terms" value={formDataVendor.credit_terms} onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">ประเภทองค์กร</label>
                                    <select className="form-select" name="organization_type_id" value={formDataVendor.organization_type_id} onChange={handleChange}>
                                        <option value="">เลือกประเภท</option>
                                        {isOrganization.map((row) => (
                                            <option key={row.organization_type_id} value={row.organization_type_id}>
                                                {row.organization_type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">หมวดหมู่</label>
                                    <select className="form-select" name="vendor_type_id" value={formDataVendor.vendor_type_id} onChange={handleChange}>
                                        <option value="">เลือกหมวดหมู่</option>
                                        {isVendorType.map((row) => (
                                            <option key={row.vendor_type_id} value={row.vendor_type_id}>
                                                {row.vendor_type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ที่อยู่และการรับประกัน */}
                    <div className="card mb-3 shadow-sm">
                        <div className="card-header bg-info text-white">ที่อยู่และการรับประกัน</div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">ที่อยู่</label>
                                    <textarea className="form-control" name="address" value={formDataVendor.address} onChange={handleChange} rows={2} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">ที่อยู่จัดส่ง</label>
                                    <textarea className="form-control" name="delivery_address" value={formDataVendor.delivery_address} onChange={handleChange} rows={2} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">การรับประกัน</label>
                                    <textarea className="form-control" name="warranty_policy" value={formDataVendor.warranty_policy} onChange={handleChange} rows={2} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">หมายเหตุ</label>
                                    <textarea className="form-control" name="remarks" value={formDataVendor.remarks} onChange={handleChange} rows={2} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">ไฟล์แนบ
                                        <span>
                                            {formDataVendor.existing_file_vendor ? (
                                                <a
                                                    href={`${formDataVendor.existing_file_vendor}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-danger"
                                                >
                                                    <i class="bi bi-file-pdf-fill"></i>Open File
                                                </a>
                                            ) : (
                                                "ไม่มี"
                                            )}
                                        </span>
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control mt-2"
                                        name="file_vendor"
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ประเภทการบริการ */}
                    <div className="card mb-3 shadow-sm">
                        <div className="card-header bg-warning text-dark">ประเภทการบริการ</div>
                        <div className="card-body">
                            {isVendorServiceType.map((row) => (
                                <div className="form-check form-check-inline" key={row.service_id}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`service-${row.service_id}`}
                                        value={row.service_id}
                                        checked={formDataVendor.service_id.map(String).includes(String(row.service_id))}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className="form-check-label" htmlFor={`service-${row.service_id}`}>
                                        {row.service_name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-success px-4">
                            บันทึกการแก้ไข
                        </button>
                        <button type="button" className="btn btn-secondary px-4 ms-2" onClick={onClose}>
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
};

export default Modal_vendor_edit;
