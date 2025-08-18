import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";

const Modal_vendor_details = ({ isOpen, onClose, vendorID }) => {
    if (!vendorID) return null;

    const [vendorDetails, setVendorDetails] = useState([]);

    const fetchVendorDetails = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vendor_show_details/${vendorID.vendor_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setVendorDetails(response.data);
        } catch (error) {
            console.error("Error fetching vendor details:", error);
        }
    };

    useEffect(() => {
        fetchVendorDetails();
    }, [vendorID]);

    return (
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
            <div
                className="modal-header"
                style={{
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        cursor: "pointer",
                    }}
                >
                    ×
                </button>
                <h5 className="modal-title text-center fw-bolder">
                    ข้อมูลผู้จำหน่าย (อู่ซ่อม) 
                </h5>
            </div>
<div className="p-3">
{vendorDetails && (
                <table className="table ">
                    <tbody>
                        <tr>
                            <th className="col-lg-3">ชื่อ</th>
                            <td>{vendorDetails.vendor_name}</td>
                        </tr>
                        <tr>
                            <th>เลขผู้เสียภาษี</th>
                            <td>{vendorDetails.tax_id}</td>
                        </tr>
                        <tr>
                            <th>ผู้ติดต่อ</th>
                            <td>{vendorDetails.contact_person}</td>
                        </tr>
                        <tr>
                            <th>เบอร์โทรติดต่อ</th>
                            <td>{vendorDetails.phone}</td>
                        </tr>
                        <tr>
                            <th>อีเมล</th>
                            <td>{vendorDetails.email}</td>
                        </tr>
                        <tr>
                            <th>ที่อยู่</th>
                            <td>{vendorDetails.address}</td>
                        </tr>
                        <tr>
                            <th>ที่อยู่จัดส่งเอกสาร</th>
                            <td>{vendorDetails.delivery_address}</td>
                        </tr>
                        <tr>
                            <th>การรับประกัน</th>
                            <td>{vendorDetails.warranty_policy}</td>
                        </tr>
                        <tr>
                            <th>เครดิต</th>
                            <td>{vendorDetails.credit_terms} วัน</td>
                        </tr> 
                        <tr>
                            <th>ประเภทองค์กร</th>
                            <td>{vendorDetails.organization_type_name}</td>
                        </tr> 
                        <tr>
                            <th>ประเภทการบริการ</th>
                            <td>{vendorDetails.service_list}</td>
                        </tr> 
                        <tr>
                            <th>
                                หมวดหมู่
                            </th>
                            <td>{vendorDetails.vendor_type_name}</td>
                        </tr>           
                        <tr>
                            <th>หมายเหตุ</th>
                            <td>{vendorDetails.remarks}</td>
                        </tr>
                        <tr>
                            <th>เอกสารสำคัญ</th>
                            <td><a href={vendorDetails.file_vendor} className="" target="_blank" rel="noopener noreferrer" id="btn-animated" style={{ color: '#c0392b' }}> <i className="bi bi-file-earmark-pdf-fill"></i> ไฟล์เอกสาร</a></td>
                        </tr>
                    </tbody>
                </table>
            )}
</div>
           

        </ReactModal>
    );
};

export default Modal_vendor_details;
