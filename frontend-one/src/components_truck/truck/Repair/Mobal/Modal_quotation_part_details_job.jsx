import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";

const Modal_quotation_part_details_job = ({ isOpen, onClose, requestId, onSubmit, selectedParts }) => {
    const [allParts, setAllParts] = useState([]);

    // fetch part ทั้งหมดจาก server
    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/invoice_un_part/${requestId}`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    }
                );
                setAllParts(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (isOpen) fetchParts();
    }, [isOpen, requestId]);

    // filter part ที่ยังไม่ได้ถูกเลือก
    const availableParts = allParts.filter(
        part => !selectedParts.some(sp => sp.quotation_parts_id === part.quotation_parts_id)
    );

    const handleSelectItem = (item) => {
        onSubmit(item); // ส่งข้อมูลกลับ parent
    };

    if (!isOpen) return null;

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="เลือกอะไหล่"
            style={{
                content: { width: "90%", maxWidth: "900px", margin: "auto", borderRadius: "0.5rem", padding: "1rem" },
                overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 },
            }}
        >
            <div>
                <h5 className="text-center mb-3">เลือกอะไหล่</h5>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ร้าน</th>
                            <th>ระบบ</th>
                            <th>อะไหล่</th>
                            <th>ประเภท</th>
                            <th>ราคา</th>
                            <th>หน่วย</th>
                            <th>จำนวน</th>
                            <th>VAT%</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableParts.map((p, idx) => (
                            <tr key={idx}>
                                <td>{p.vendor_name}</td>
                                <td>{p.system_name}</td>
                                <td>{p.part_name}</td>
                                <td>{p.maintenance_type}</td>
                                <td>{p.part_price}</td>
                                <td>{p.part_unit}</td>
                                <td>{p.part_qty}</td>
                                <td>{p.part_vat}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleSelectItem(p)}>
                                        เลือก
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {availableParts.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center">ไม่มีอะไหล่เหลือ</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </ReactModal>
    );
};

export default Modal_quotation_part_details_job;
