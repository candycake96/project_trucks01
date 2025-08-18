import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { Button, Table, Form } from "react-bootstrap";
import axios from "axios";
import { apiUrl } from "../../../../../../config/apiConfig";

const Modal_vehicle_madel_show = ({ isOpen, onClose, onSelectModel }) => {
    const [models, setModels] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchModels();
        }
    }, [isOpen]);

    const fetchModels = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/setting_models_show`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setModels(response.data);
            setFilteredModels(response.data);
        } catch (error) {
            console.error("Error fetching models:", error);
        }
    };
    
const [searchBrand, setSearchBrand] = useState("");
const [searchModel, setSearchModel] = useState("");

const handleSearch = () => {
    const filtered = models.filter(
        (m) =>
            m.brand.toLowerCase().includes(searchBrand.toLowerCase()) &&
            m.model.toLowerCase().includes(searchModel.toLowerCase())
    );
    setFilteredModels(filtered);
};

// เรียก handleSearch เมื่อใดก็ตามที่ searchBrand หรือ searchModel เปลี่ยน
useEffect(() => {
    handleSearch();
}, [searchBrand, searchModel]);



    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="แก้ไขยี่ห้อรุ่นรถ"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "700px",
                    maxHeight: "90vh",
                    margin: "auto",
                    padding: "0",
                    border: "none",
                    borderRadius: "0.5rem",
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
            <div className="modal-header bg-primary text-white">
                <h5 className="modal-title m-0">ข้อมูล ยี่ห้อ / รุ่นรถ</h5>
                <button onClick={onClose} className="btn-close btn-close-white"></button>
            </div>

            {/* Search */}
            <div className="px-3 pt-3 row g-2">
                <div className="col-md-6">
                    <Form.Control
                        type="text"
                        placeholder="ค้นหายี่ห้อ (เช่น Toyota)"
                        value={searchBrand}
                        onChange={(e) => setSearchBrand(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <Form.Control
                        type="text"
                        placeholder="ค้นหารุ่น (เช่น Revo)"
                        value={searchModel}
                        onChange={(e) => setSearchModel(e.target.value)}
                    />
                </div>
            </div>


            {/* Body */}
            <div className="modal-body p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {filteredModels.length === 0 ? (
                    <p className="text-muted">ไม่พบข้อมูลที่ค้นหา</p>
                ) : (
                    <Table bordered hover responsive size="sm">
                        <thead className="table-light sticky-top bg-light">
                            <tr>
                                <th>#</th>
                                <th>ยี่ห้อ</th>
                                <th>รุ่น</th>
                                <th>เลือก</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredModels.map((model, index) => (
                                <tr key={model.model_id}>
                                    <td>{index + 1}</td>
                                    <td>{model.brand}</td>
                                    <td>{model.model}</td>
                                    <td>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => {
                                                if (onSelectModel) onSelectModel(model);
                                                onClose();
                                            }}
                                        >
                                            เลือก
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* Footer */}
            <div className="modal-footer border-top p-2 d-flex justify-content-between">
                <span className="text-muted small">
                    จำนวนทั้งหมด: {filteredModels.length} รายการ
                </span>
                <Button variant="secondary" onClick={onClose}>
                    ปิด
                </Button>
            </div>
        </ReactModal>
    );
};

export default Modal_vehicle_madel_show;
