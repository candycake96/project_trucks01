import React, { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import Modal_vehicle_madels_add from "./modal/Modal_vehicle_models_add";
import { apiUrl } from "../../../../../config/apiConfig";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import Modal_vehicle_madels_edit from "./modal/Modal_vehicle_models_edit";
import { Link } from "react-router-dom";

const Vehicle_models = () => {
    const [dataModels, setDataModel] = useState([]);


    const fetchDataModel = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/setting_models_show`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setDataModel(response.data);
        } catch (error) {
            console.error("Error fetching vehicle models:", error);
        }
    };

    useEffect(() => {
        fetchDataModel();
    }, []);

    const [isOpenModalModelAdd, setOpenModalModelAdd] = useState(false);
    const handleOpenModalModelAdd = () => {
        setOpenModalModelAdd(true);
    };
    const handleClosModalModelAdd = () => {
        setOpenModalModelAdd(false);
    };

    const [isOpenModalModelEdit, setOpenModalModelEdit] = useState(false);
    const [dataModalModelEdit, setDataModalModelEdit] = useState(null);
    const handleOpenModalModelEdit = (data) => {
        setOpenModalModelEdit(true);
        setDataModalModelEdit(data);
    };
    const handleClosModalModelEdit = () => {
        setOpenModalModelEdit(false);
    };

    const handleDeleteModel = async (id) => {
        const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลยี่ห้อ/รุ่นรถนี้?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(
                `${apiUrl}/api/setting_models_delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            // แจ้งลบสำเร็จ
            alert("ลบข้อมูลสำเร็จ");
            fetchDataModel(); // รีเฟรชรายการ
        } catch (error) {
            console.error("Error:", error);
            alert("เกิดข้อผิดพลาด ไม่สามารถลบข้อมูลได้");
        }
    };

    return (
        <>
            <div className="container py-4">
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h4 className="fw-bold text-primary">ตั้งค่าข้อมูลรถ</h4>
                            <small className="text-muted">
                                จัดการยี่ห้อและรุ่นรถเพื่อนำไปใช้ในระบบลงทะเบียนรถ
                            </small>
                        </div>
                        <div className="">
                            <Button as={Link} to="/Truck/Vehicle_pm_start" className="me-1">ลงทะเบียนรถเพื่อเริ่มต้น PM</Button>
                        <Button variant="primary" onClick={handleOpenModalModelAdd} className="me-1">
                            <i className="bi bi-plus-circle me-2"></i> ตั้งค่าแจ้งเตือน PM
                        </Button>
                        <Button variant="primary" onClick={handleOpenModalModelAdd}>
                            <i className="bi bi-plus-circle me-2"></i>เพิ่มข้อมูล
                        </Button>                            
                        </div>

                    </div>
                </div>

                <Card className="shadow-sm">
                    <Card.Body>
                        <h6 className="mb-3 fw-bold text-secondary">ข้อมูลยี่ห้อ/รุ่นรถ</h6>
                        <div className="table-responsive">
                            <Table hover bordered>
                                <thead className="table-light">
                                    <tr className="text-center">
                                        <th style={{ width: "5%" }}>#</th>
                                        <th>ยี่ห้อ</th>
                                        <th>รุ่น</th>
                                        <th style={{ width: "15%" }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataModels.length > 0 ? (
                                        dataModels.map((data, ndx) => (
                                            <tr key={ndx}>
                                                <td className="text-center">{ndx + 1}</td>
                                                <td>{data.brand}</td>
                                                <td>{data.model}</td>
                                                <td className="text-center">
                                                    <Button variant="outline-primary me-1" size="sm" onClick={() => handleOpenModalModelEdit(data)}>
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Button>
                                                    <Button variant="outline-danger me-1" size="sm" onClick={() => handleDeleteModel(data.model_id)}>
                                                        <i class="bi bi-trash"></i>
                                                    </Button>
                                                    <Link to="/truck/PM_setting" state={data} className="btn btn-outline-secondary btn-sm"   >
                                                        <i class="bi bi-gear"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted">
                                                ไม่มีข้อมูล
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {isOpenModalModelAdd && (
                <Modal_vehicle_madels_add
                    isOpen={isOpenModalModelAdd}
                    onClose={handleClosModalModelAdd}
                    onSave={(updatedModel) => {
                        // ทำการอัปเดตใน frontend หรือเรียก fetch ใหม่
                        fetchDataModel(); // หรืออัปเดต state
                    }}
                />
            )}

            {isOpenModalModelEdit && (
                <Modal_vehicle_madels_edit
                    isOpen={isOpenModalModelEdit}
                    onClose={handleClosModalModelEdit}
                    dataModels={dataModalModelEdit}
                    onSave={(updatedModel) => {
                        // ทำการอัปเดตใน frontend หรือเรียก fetch ใหม่
                        fetchDataModel(); // หรืออัปเดต state
                    }}
                />
            )}


        </>
    );
};

export default Vehicle_models;
