import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";

const Modal_vendor_details = ({ isOpen, onClose, vendorID }) => {
    if (!vendorID) return null;

    const [vendorDetails, setVendorDetails] = useState(null);

    const fetchVendorDetails = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/vendor_show_details/${vendorID.vendor_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setVendorDetails(response.data);
        } catch (error) {
            console.error("Error fetching vendor details:", error);
        }
    };

    useEffect(() => {
        if (isOpen) fetchVendorDetails();
    }, [vendorID, isOpen]);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="Vendor Details"
            style={{
                content: {
                    width: "95%",
                    maxWidth: "950px",
                    maxHeight: "85vh",
                    margin: "auto",
                    padding: "0",
                    border: "none",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
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
            {/* Header */}
            <div
                className="modal-header text-white"
                style={{
                    background: "linear-gradient(135deg, #007bff, #00c6ff)",
                    padding: "1rem",
                }}
            >
                <h5 className="modal-title fw-bold">
                    <i className="bi bi-person-vcard-fill me-2"></i>
                    ข้อมูลผู้จำหน่าย (อู่ซ่อม)
                </h5>
                <button
                    onClick={onClose}
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    ×
                </button>
            </div>

            {/* Body */}
            <div className="p-3" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {vendorDetails ? (
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-0">
                            <table className="table table-striped align-middle mb-0">
                                <tbody>
                                    <tr>
                                        <th className="col-lg-3">
                                            <i className="bi bi-building me-2 text-primary"></i>ชื่อ
                                        </th>
                                        <td>{vendorDetails.vendor_name}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-upc-scan me-2 text-primary"></i>
                                            เลขผู้เสียภาษี
                                        </th>
                                        <td>{vendorDetails.tax_id}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                                            ผู้ติดต่อ
                                        </th>
                                        <td>{vendorDetails.contact_person}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-telephone-fill me-2 text-primary"></i>
                                            เบอร์โทรติดต่อ
                                        </th>
                                        <td>{vendorDetails.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-envelope-fill me-2 text-primary"></i>
                                            อีเมล
                                        </th>
                                        <td>{vendorDetails.email}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                                            ที่อยู่
                                        </th>
                                        <td>{vendorDetails.address}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-send-check-fill me-2 text-primary"></i>
                                            ที่อยู่จัดส่งเอกสาร
                                        </th>
                                        <td>{vendorDetails.delivery_address}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-shield-check me-2 text-primary"></i>
                                            การรับประกัน
                                        </th>
                                        <td>{vendorDetails.warranty_policy}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-cash-stack me-2 text-primary"></i>
                                            เครดิต
                                        </th>
                                        <td>{vendorDetails.credit_terms} วัน</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-diagram-3-fill me-2 text-primary"></i>
                                            ประเภทองค์กร
                                        </th>
                                        <td>{vendorDetails.organization_type_name}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-tools me-2 text-primary"></i>
                                            ประเภทการบริการ
                                        </th>
                                        <td>
                                            {vendorDetails?.service_list
                                                ? vendorDetails.service_list
                                                    .split(",")
                                                    .map(item => item.split(":")[1]?.trim()) // เอาเฉพาะชื่อด้านหลัง :
                                                    .join(", ")
                                                : "-"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-tags-fill me-2 text-primary"></i>
                                            หมวดหมู่
                                        </th>
                                        <td>{vendorDetails.vendor_type_name}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-journal-text me-2 text-primary"></i>
                                            หมายเหตุ
                                        </th>
                                        <td>{vendorDetails.remarks}</td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <i className="bi bi-file-earmark-pdf-fill me-2 text-danger"></i>
                                            เอกสารสำคัญ
                                        </th>
                                        <td>
                                            {vendorDetails.file_vendor ? (
                                                <a
                                                    href={vendorDetails.file_vendor}
                                                    className="btn btn-sm btn-outline-danger"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="bi bi-file-earmark-pdf-fill me-1"></i>
                                                    เปิดไฟล์เอกสาร
                                                </a>
                                            ) : (
                                                <span className="text-muted">ไม่มีไฟล์แนบ</span>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-muted">กำลังโหลดข้อมูล...</p>
                )}
            </div>
        </ReactModal>
    );
};

export default Modal_vendor_details;
