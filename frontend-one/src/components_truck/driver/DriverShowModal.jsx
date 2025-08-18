import React from "react";
import Modal from "react-modal"; // ใช้ไลบรารี เช่น react-modal

const DriverShowModal = ({ isOpen, onClose, driverData }) => {
    if (!driverData) return null; // ป้องกัน error กรณีไม่มีข้อมูล

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Driver Details"
            style={{
                content: {
                    width: "50%",
                    margin: "auto",
                    padding: "20px",
                },
            }}
        >
            <h3>รายละเอียดพนักงานขับรถ</h3>
            <p>เลขที่ใบอนุญาต: {driverData.license_number}</p>
            <p>ชื่อ: {driverData.lname}</p>
            <p>วันที่ออกใบอนุญาต: {new Date(driverData.issued_date).toLocaleDateString("th-TH")}</p>
            <p>วันที่หมดอายุ: {new Date(driverData.expiry_date).toLocaleDateString("th-TH")}</p>
            <p>ประเภทใบขับขี่: {driverData.license_type}</p>
            <button className="btn btn-danger" onClick={onClose}>
                ปิด
            </button>
        </Modal>
    );
};

export default DriverShowModal;
