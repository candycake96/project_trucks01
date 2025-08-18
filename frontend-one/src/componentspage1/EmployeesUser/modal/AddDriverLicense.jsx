import axios from "axios";
import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import { apiUrl } from "../../../config/apiConfig";

const AddDriverLicense = ({ isOpen, onClose, emp, onSubmit }) => {
    if (!emp) return null;

    const [drivingLicenseTypes, setDrivingLicenseTypes] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [idemp, setIdemp] = useState("");
    const [licensenumber, setLicensenumber] = useState("");
    const [issueddate, setIssueddate] = useState("");
    const [expirydate, setExpirydate] = useState("");
    const [licensetype, setLicensetype] = useState("");
    const [issuingauthority, setIssuingauthority] = useState("");
    const status = "Active";

    useEffect(() => {
        if (emp) {
            setIdemp(emp.id);
        }
    }, [emp]);

    const fetchDrivingLicenseTypes = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getdrivinglicensetypes`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setDrivingLicenseTypes(response.data);
        } catch (error) {
            console.error("Error fetching license types:", error);
        }
    };

    useEffect(() => {
        fetchDrivingLicenseTypes();
    }, []);

    const handleAddDriverlicense = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${apiUrl}/api/adddriverlicense/${emp.id_emp}`,
                {
                    id_emp: idemp,
                    license_number: licensenumber,
                    issued_date: issueddate,
                    expiry_date: expirydate,
                    license_type: licensetype,
                    issuing_authority: issuingauthority,
                    status: status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            setMessage(response.data.message);
            setMessageType("success");

            setIdemp("");
            setLicensenumber("");
            setIssueddate("");
            setExpirydate("");
            setLicensetype("");
            setIssuingauthority("");

            if (onSubmit) onSubmit();
        } catch (error) {
            console.error("Error adding driver license:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Failed to add driver license.");
            setMessageType("error");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Edit Employee"
            style={{
                content: {
                    width: "90%",
                    maxWidth: "800px",
                    height: "80%",
                    margin: "auto",
                    padding: "0",
                    border: "none",
                    borderRadius: "0.5rem",
                    overflowY: "auto",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                },
            }}
        >
            <div className="p-3">
                {message && (
                    <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}

<form onSubmit={handleAddDriverlicense}>
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <label className="form-label">รหัสใบขับขี่</label>
                            <input
                                type="text"
                                className="form-control"
                                value={licensenumber}
                                onChange={(e) => setLicensenumber(e.target.value)}
                            />
                        </div>
                        <div className="col-lg-6 mb-3">
                            <label className="form-label">ชื่อ รหัสพนักงาน</label>
                            <input
                                id="name"
                                className="form-control"
                                value={`${emp.lname} ${emp.fname}`}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 mb-3">
                            <label className="form-label">วันที่ออกใบขับขี่</label>
                            <input
                                type="date"
                                className="form-control"
                                value={issueddate}
                                onChange={(e) => setIssueddate(e.target.value)}
                            />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label className="form-label">วันที่หมดอายุใบขับขี่</label>
                            <input
                                type="date"
                                className="form-control"
                                value={expirydate}
                                onChange={(e) => setExpirydate(e.target.value)}
                            />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label className="form-label">ประเภทใบขับขี่ *</label>
                            <select
                                className="form-select"
                                value={licensetype}
                                onChange={(e) => setLicensetype(e.target.value)}
                            >
                                <option value="">กรุณาเลือกประเภทใบขับขี่ *</option>
                                {drivingLicenseTypes.map((LType) => (
                                    <option key={LType.license_type_id} value={LType.license_type_id}>
                                        {LType.license_code} {LType.license_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">หน่วยงานที่ออกใบขับขี่</label>
                        <input
                            type="text"
                            className="form-control"
                            value={issuingauthority}
                            onChange={(e) => setIssuingauthority(e.target.value)}
                        />
                    </div>
                    <div className="text-center">
                        <button className="btn" type="submit" style={{ background: "#20c997", color: "#fff" }}>
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddDriverLicense;
