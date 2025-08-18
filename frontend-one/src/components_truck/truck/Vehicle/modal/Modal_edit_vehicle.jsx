import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";
import Modal_vehicle_madel_show from "../setting_vehicle/vehicle_models/modal/Modal_vehicle_model_show";

const Modal_edit_vehicle = ({ isOpen, onClose, dataVehicle }) => {
    const [user, setUser] = useState(null);
    const [isUsageType, setUsageType] = useState([]);
    const [isVehicleType, setVehicleType] = useState([]);
    useEffect(() => {
        // ดึงข้อมูลผู้ใช้จาก localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData)); // แปลง JSON เป็น Object แล้วเก็บใน state
        }
    }, []);



    const [isOpenModalModels, setOpenModalModels] = useState(false);
    const handleOpenModalModels = () => {
        setOpenModalModels(true);
    };
    const handleCloseModleModels = () => {
        setOpenModalModels(false);
    };

    // สร้างฟังก์ชัน handleModelSelected เพื่อรับข้อมูล:
const handleModelSelected = (selectedModel) => {
    console.log("Model selected:", selectedModel);

    setFormdata({
        ...formData, // ✅ ใช้ค่าปัจจุบัน ไม่ใช่ค่าเริ่มต้น
        car_brand: selectedModel.brand,
        model_no: selectedModel.model,
        model_id: selectedModel.model_id,
    });

    handleCloseModleModels(); // ✅ ปิด Modal
};





    const VehicleFormData = {
        reg_date: "",
        reg_number: "",
        province: "",
        fuel: "",
        chassis_number: "",
        usage_type_id: "",
        car_brand: "",
        model_no: "",
        color: "",
        engine_brand: "",
        engine_no: "",
        cylinders: "",
        veh_weight: "",
        max_load: "",
        gross_weight: "",
        possession_date: "",
        operators: "",
        nation: "",
        addr: "",
        trans_type: "",
        license_no: "",
        license_expiry: "",
        rights_to_use: "",
        owner_name: "",
        address: "",
        passenger_count: "",
        vehicle_type_id: "",
        chassis_number_location: "",
        engine_on_location: "",
        engine_power: "",
        document_order: "",
        reg_doc_number: "",
        inspection_code: "",
        axle_count: "",
        wheel_count: "",
        tire_count: "",
        model_id:"",
    }

    const fuelOptions = [
        "ไม่ใช้เชื้อเพลิง",
        "ไฟฟ้า",
        "เบนซิน 95",
        "แก๊สโซฮอล์ 95 (E10)",
        "แก๊สโซฮอล์ 91 (E10)",
        "แก๊สโซฮอล์ E20",
        "แก๊สโซฮอล์ E85",
        "พรีเมี่ยมดีเซล",
        "ไบโอดีเซล B7",
        "ไบโอดีเซล B10",
        "ไบโอดีเซล B20",
    ];

    const [formData, setFormdata] = useState(VehicleFormData);

    useEffect(() => {
        if (dataVehicle) {
            setFormdata({
                ...formData,
                reg_date: dataVehicle.reg_date ? dataVehicle.reg_date.split("T")[0] : "",
                reg_number: dataVehicle.reg_number || "",
                province: dataVehicle.province || "",
                fuel: dataVehicle.fuel,
                car_type_id: dataVehicle.car_type_id || "",
                chassis_number: dataVehicle.chassis_number || "",
                usage_type_id: dataVehicle.usage_type_id || "",
                car_brand: dataVehicle.car_brand || "",
                model_no: dataVehicle.model_no || "",
                color: dataVehicle.color || "",
                engine_brand: dataVehicle.engine_brand || "",
                engine_no: dataVehicle.engine_no || "",
                cylinders: dataVehicle.cylinders || "",
                veh_weight: dataVehicle.veh_weight || "",
                max_load: dataVehicle.max_load || "",
                gross_weight: dataVehicle.gross_weight || "",
                possession_date: dataVehicle.possession_date ? dataVehicle.possession_date.split("T")[0] : "",
                operators: dataVehicle.operators || "",
                nation: dataVehicle.nation || "",
                addr: dataVehicle.addr || "",
                trans_type: dataVehicle.trans_type || "",
                license_no: dataVehicle.license_no || "",
                license_expiry: dataVehicle.license_expiry || "",
                rights_to_use: dataVehicle.rights_to_use || "",
                owner_name: dataVehicle.owner_name || "",
                address: dataVehicle.address || "",
                passenger_count: dataVehicle.passenger_count || "",
                vehicle_type_id: dataVehicle.vehicle_type_id || "",
                chassis_number_location: dataVehicle.chassis_number_location || "",
                engine_on_location: dataVehicle.engine_on_location,
                engine_power: dataVehicle.engine_power || "",
                document_order: dataVehicle.document_order || "",
                reg_doc_number: dataVehicle.reg_doc_number || "",
                inspection_code: dataVehicle.inspection_code || "",
                axle_count: dataVehicle.axle_count || "",
                wheel_count: dataVehicle.wheel_count || "",
                tire_count: dataVehicle.tire_count || "",
                model_id: dataVehicle.model_id || "",
            })
        } else {
            console.warn("User data not available or incomplete");
            setFormdata(VehicleFormData);
        }
    }, [dataVehicle]);

    const handleChangeInputUpDate = (e) => {
        const { name, value } = e.target;
        setFormdata((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const fetchVehicleUsageType = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No access token found");
                return;
            }

            const response = await axios.get(`${apiUrl}/api/detailsvehicleusagetype`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("API Response:", response.data); // ✅ ตรวจสอบ Response

            setUsageType(response.data);
        } catch (error) {
            console.error("Error fetching VehicleUsageType:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status); // ✅ ดูว่าเป็น 403 จริงไหม
                console.error("Response Data:", error.response.data); // ✅ ดูข้อความจากเซิร์ฟเวอร์
            }
        }
    };

    useEffect(() => {
        fetchVehicleUsageType();
    }, []);

    const fetchVehicleType = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No access token found");
                return;
            }

            const response = await axios.get(`${apiUrl}/api/detailsvehicletype`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("API Response:", response.data); // ✅ ตรวจสอบ Response

            setVehicleType(response.data);
        } catch (error) {
            console.error("Error fetching VehicleUsageType:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status); // ✅ ดูว่าเป็น 403 จริงไหม
                console.error("Response Data:", error.response.data); // ✅ ดูข้อความจากเซิร์ฟเวอร์
            }
        }
    };

    useEffect(() => {
        fetchVehicleType();
    }, []);


    const handleSubmitVehicleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${apiUrl}/api/vehicle_update_doc/${dataVehicle.reg_id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            alert("บันทึกข้อมูลสำเร็จ!");

            console.log("Data updated successfully!");
            // setReload(prev => !prev);  // Trigger reload เพื่ออัปเดตข้อมูล

            onClose(); // ✅ ปิด Modal หรือ Form
        } catch (error) {
            console.error("❌ Error saving data:", error);
            alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };


    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <ReactModal
                isOpen={isOpen}
                onRequestClose={onClose}
                ariaHideApp={false}
                contentLabel="Employee Details"
                style={{
                    content: {
                        width: "100%",
                        maxWidth: "950px",
                        maxHeight: "80vh",
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


                <div className="container">


                    <div className="p-3">
                        <div className="">
                            <form action="" onSubmit={handleSubmitVehicleUpdate}>
                                <div className="text-center mb-3">
                                    <p className="fw-bolder">แก้ไข <i class="bi bi-pencil-square"></i> รายการจดทะเบียน</p>
                                </div>

                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="input_reg_date" className="form-label fw-medium">วันที่จดทะเบียน</label>
                                        <input
                                            type="date"
                                            id="input_reg_date"
                                            name="reg_date"
                                            className="form-control"
                                            value={formData.reg_date}
                                            onChange={handleChangeInputUpDate}
                                        // {(e) => setFormdata({ ...formData, reg_date: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="input_reg_number" className="form-label fw-medium">เลขทะเบียน</label>
                                        <input
                                            type="text"
                                            name="reg_number"
                                            id="input_reg_number"
                                            className="form-control"
                                            value={formData.reg_number}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, reg_number: e.target.value })}
                                            placeholder="กรอกเลขทะเบียน" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="input_province" className="form-label fw-medium">จังหวัด</label>
                                        <input
                                            type="text"
                                            name="province"
                                            id="input_province"
                                            className="form-control"
                                            value={formData.province}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, province: e.target.value })}
                                            placeholder="กรอกจังหวัด" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-3">
                                        <label htmlFor="input_fuel" className="form-label fw-medium">เชื้อเพลิง</label>
                                        <select
                                            id="input_fuel"
                                            className="form-select"
                                            name="fuel"
                                            value={formData.fuel}
                                            onChange={handleChangeInputUpDate}

                                        >
                                            <option value="">กรุณาเลือกเชื้อเพลิง</option>
                                            {fuelOptions.map((fuel, index) => (
                                                <option key={index} value={fuel}>{fuel}</option>
                                            ))}
                                        </select>

                                    </div>
                                    <div className="col-lg-3">
                                        <label htmlFor="inputinspection_code" className="form-label fw-medium">รหัสตรวจสภาพ</label>
                                        <input
                                            type="text"
                                            name="inspection_code"
                                            id="inputinspection_code"
                                            className="form-control"
                                            value={formData.inspection_code}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, inspection_code: e.target.value })}
                                            placeholder="รหัสตรวจสภาพ" />
                                    </div>
                                    <div className="col-lg-3">
                                        <label htmlFor="input_vehicle_type_id" className="form-label fw-medium">ประเภท</label>
                                        <select
                                            id="input_vehicle_type_id"
                                            className="form-select"
                                            name="vehicle_type_id"
                                            value={formData.vehicle_type_id}
                                            onChange={handleChangeInputUpDate}
                                        >
                                            <option value="">เลือกประเภทรถ</option>
                                            {isVehicleType.length > 0 ? (
                                                isVehicleType.map((rowVehicleType) => (
                                                    <option key={rowVehicleType.vehicle_type_id} value={rowVehicleType.vehicle_type_id}>
                                                        {rowVehicleType.vehicle_type_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>กำลังโหลด...</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="col-lg-3">
                                        <label htmlFor="input_usage_type_id" className="form-label fw-medium">ลักษณะ / มาตรฐาน</label>
                                        <select
                                            className="form-select"
                                            id="input_usage_type_id"
                                            name="usage_type_id"
                                            value={formData.usage_type_id}
                                            onChange={handleChangeInputUpDate}
                                        >
                                            <option value="">เลือกลักษณะรถ</option>
                                            {isUsageType.length > 0 ? (
                                                isUsageType.map((rowUsageType) => (
                                                    <option key={rowUsageType.usage_type_id} value={rowUsageType.usage_type_id}>
                                                        {rowUsageType.usage_type}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>กำลังโหลด...</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    {/* <div className="col-lg-4">
                                        <label htmlFor="input_car_brand" className="form-label fw-medium">ยี่ห้อรถ</label>
                                        <input
                                            type="text"
                                            name="car_brand"
                                            id="input_car_brand"
                                            className="form-control"
                                            value={formData.car_brand}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, car_brand: e.target.value })}
                                            placeholder="ยี่ห้อรถ" />
                                    </div> */}
                                    <div className="col-lg-4">
                                        <label htmlFor="input_car_brand" className="form-label fw-medium">
                                            ยี่ห้อรถ
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="car_brand"
                                                id="input_car_brand"
                                                className="form-control"
                                                value={formData.car_brand}
                                                onChange={handleChangeInputUpDate}
                                                // onChange={(e) => setFormdata({ ...formData, car_brand: e.target.value })}
                                                placeholder="ยี่ห้อรถ"
                                                disabled
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={handleOpenModalModels}
                                            >
                                                ค้นหา
                                            </button>
                                        </div>
                                        {/* {errors.car_brand && (
                                            <div className="form-text text-danger">{errors.car_brand}</div>
                                        )} */}
                                    </div>

                                    <div className="col-lg-4">
                                        <label htmlFor="input_model_no" className="form-label fw-medium">แบบ / รุ่น</label>
                                        <input
                                            type="text"
                                            name="model_no"
                                            id="input_model_no"
                                            className="form-control"
                                            value={formData.model_no}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, model_no: e.target.value })}
                                            placeholder="" />
                                    </div>
                                    <div className="col-lg-4">
                                        <label htmlFor="input_color" className="form-label fw-medium">สี</label>
                                        <input
                                            type="text"
                                            name="color"
                                            id="input_color"
                                            className="form-control"
                                            value={formData.color}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, color: e.target.value })}
                                            placeholder="สี" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <label htmlFor="input_chassis_number" className="form-label fw-medium">เลขตัวถัง</label>
                                        <input
                                            type="text"
                                            name="chassis_number"
                                            id="input_chassis_number"
                                            className="form-control"
                                            value={formData.chassis_number}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, chassis_number: e.target.value })}
                                            placeholder="ยี่ห้อรถ" />
                                    </div>
                                    <div className="col-lg-4">
                                        <label htmlFor="input_chassis_number_location" className="form-label fw-medium">อยู่ที่</label>
                                        <input
                                            type="text"
                                            name="chassis_number_location"
                                            id="input_chassis_number_location"
                                            className="form-control"
                                            value={formData.chassis_number_location}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, chassis_number_location: e.target.value })}
                                            placeholder="" />
                                    </div>
                                </div>

                                <div className="row mb-3">

                                    <div className="col-lg-4">
                                        <label htmlFor="input_engine_brand" className="form-label fw-medium">ยี่ห้อเครื่องยนต์</label>
                                        <input
                                            type="text"
                                            name="engine_brand"
                                            id="input_engine_brand"
                                            className="form-control"
                                            value={formData.engine_brand}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, engine_brand: e.target.value })}
                                            placeholder="ยี่ห้อรถ" />
                                    </div>

                                    <div className="col-lg-4">
                                        <label htmlFor="input_engine_no" className="form-label fw-medium">เลขเครื่องยนต์</label>
                                        <input
                                            type="text"
                                            name="engine_no"
                                            id="input_engine_no"
                                            className="form-control"
                                            value={formData.engine_no}
                                            onChange={handleChangeInputUpDate}
                                            placeholder=""
                                        />
                                    </div>

                                    <div className="col-lg-4">
                                        <label htmlFor="input_engine_on_location" className="form-label fw-medium">อยู่ที่</label>
                                        <input
                                            type="text"
                                            name="engine_on_location"
                                            id="input_engine_on_location"
                                            className="form-control"
                                            value={formData.engine_on_location}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, engine_on_location: e.target.value })}
                                            placeholder=""

                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-2">
                                        <label htmlFor="input_cylinders" className="form-label fw-medium">จำนวนสูบ</label>
                                        <input
                                            type="text"
                                            name="cylinders"
                                            id="input_cylinders"
                                            className="form-control"
                                            value={formData.cylinders}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, cylinders: e.target.value })}
                                            placeholder="ยี่ห้อรถ"
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <label htmlFor="input_engine_power" className="form-label fw-medium">แรงม้า</label>
                                        <input
                                            type="text"
                                            name="engine_power"
                                            id="input_engine_power"
                                            className="form-control"
                                            value={formData.engine_power}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, engine_power: e.target.value })}
                                            placeholder="" />
                                    </div>


                                    <div className="col-lg-2">
                                        <label htmlFor="input_axle_count" className="form-label fw-medium">เพลา</label>
                                        <input
                                            type="number"
                                            name="axle_count"
                                            id="input_axle_count"
                                            className="form-control"
                                            value={formData.axle_count}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, axle_count: e.target.value })}
                                            placeholder="" />
                                    </div>
                                    <div className="col-lg-2">
                                        <label htmlFor="input_wheel_count" className="form-label fw-medium">ล้อ</label>
                                        <input
                                            type="number"
                                            name="wheel_count"
                                            id="input_wheel_count"
                                            className="form-control"
                                            value={formData.wheel_count}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, wheel_count: e.target.value })}
                                            placeholder="" />
                                    </div>
                                    <div className="col-lg-2">
                                        <label htmlFor="input_tire_count" className="form-label fw-medium">ยาง</label>
                                        <input
                                            type="number"
                                            name="tire_count"
                                            id="input_tire_count"
                                            className="form-control"
                                            value={formData.tire_count}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, tire_count: e.target.value })}
                                            placeholder="" />
                                    </div>


                                    <div className="col-lg-2">
                                        <label htmlFor="input_veh_weight" className="form-label fw-medium">น้ำหนักรถ</label>
                                        <input
                                            type="text"
                                            name="veh_weight"
                                            id="input_veh_weight"
                                            className="form-control"
                                            value={formData.veh_weight}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, veh_weight: e.target.value })}
                                            placeholder="" />
                                    </div>
                                    <div className="col-lg-2">
                                        <label htmlFor="input_passenger_count" className="form-label fw-medium">จำนวนผู้โดยสาร</label>
                                        <input
                                            type="text"
                                            name="passenger_count"
                                            id="input_passenger_count"
                                            className="form-control"
                                            value={formData.passenger_count}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, passenger_count: e.target.value })}
                                            placeholder="" />
                                    </div>
                                    <div className="col-lg-2">
                                        <label htmlFor="input_max_load" className="form-label fw-medium">น้ำหนักบรรทุก(ลงเพลา)</label>
                                        <input
                                            type="text"
                                            name="max_load"
                                            id="input_max_load"
                                            className="form-control"
                                            value={formData.max_load}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, max_load: e.target.value })}
                                            placeholder="" />
                                    </div>
                                    <div className="col-lg-2">
                                        <label htmlFor="input_gross_weight" className="form-label fw-medium">น้ำหนักรวม</label>
                                        <input
                                            type="text"
                                            name="gross_weight"
                                            id="input_gross_weight"
                                            className="form-control"
                                            value={formData.gross_weight}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, gross_weight: e.target.value })}
                                            placeholder="" />
                                    </div>
                                </div>


                                <hr className="mb-3" />
                                <div className="text-center mb-3">
                                    <p className="fw-bolder">เจ้าของรถ</p>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <label htmlFor="input_document_order" className="form-label fw-medium">ลำดับที่ </label>
                                        <input
                                            type="text"
                                            name="document_order"
                                            id="input_document_order"
                                            className="form-control"
                                            value={formData.document_order}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, document_order: e.target.value })}
                                            placeholder="xxx" />
                                    </div>
                                    <div className="col-lg-4">
                                        <label htmlFor="input_possession_date" className="form-label fw-medium">วัน เดือน ปี ที่ครอบครอง</label>
                                        <input
                                            type="text"
                                            name="possession_date"
                                            id="input_possession_date"
                                            className="form-control"
                                            value={formData.possession_date}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, possession_date: e.target.value })}
                                            placeholder="" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <label htmlFor="input_operators" className="form-label fw-medium">ผู้ประกอบการขนส่ง </label>
                                        <input
                                            type="text"
                                            name="operators"
                                            id="input_operators"
                                            className="form-control"
                                            value={formData.operators}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, operators: e.target.value })}
                                            placeholder="xxx" />
                                    </div>
                                    <div className="col-lg-4">
                                        <label htmlFor="input_reg_doc_number" className="form-label fw-medium">หนังสือสำคัณแสดงการจดทะเบียน</label>
                                        <input
                                            type="text"
                                            name="reg_doc_number"
                                            id="input_reg_doc_number"
                                            className="form-control"
                                            value={formData.reg_doc_number}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, reg_doc_number: e.target.value })}
                                            placeholder="" />
                                    </div>
                                    <div className="col-lg-4">
                                        <label htmlFor="input_nation" className="form-label fw-medium">สัญชาติ</label>
                                        <input
                                            type="text"
                                            name="nation"
                                            id="input_nation"
                                            className="form-control"
                                            value={formData.nation}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, nation: e.target.value })}
                                            placeholder="" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <label htmlFor="input_addr" className="form-label fw-medium">ที่อยู่ </label>
                                        <input
                                            type="text"
                                            name="addr"
                                            id="input_addr"
                                            className="form-control"
                                            value={formData.addr}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, addr: e.target.value })}
                                            placeholder="xxx" />
                                    </div>
                                    <div className="col-lg-4">
                                        <label htmlFor="input_trans_type" className="form-label fw-medium">ประกอบการขนส่งประเภท</label>
                                        <input
                                            type="text"
                                            name="trans_type"
                                            id="input_trans_type"
                                            className="form-control"
                                            value={formData.trans_type}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, trans_type: e.target.value })}
                                            placeholder="" />
                                    </div>
                                    <div className="col-lg-4">
                                        <label htmlFor="input_license_no" className="form-label fw-medium">ใบอนุญาตเลขที่</label>
                                        <input
                                            type="text"
                                            name="license_no"
                                            id="input_license_no"
                                            className="form-control"
                                            value={formData.license_no}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, license_no: e.target.value })}
                                            placeholder="" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <label htmlFor="input_license_expiry" className="form-label fw-medium">วันสิ้นอายุใบอนุญาต </label>
                                        <input
                                            type="date"
                                            name="license_expiry"
                                            id="input_license_expiry"
                                            className="form-control"
                                            value={formData.license_expiry}
                                            onChange={handleChangeInputUpDate}
                                        // {(e) => setFormdata({ ...formData, license_expiry: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-lg-4">
                                        <label htmlFor="input_rights_to_use" className="form-label fw-medium">มีสิทธิครอบครองและใช้รถโดย</label>
                                        <input
                                            type="text"
                                            name="rights_to_use"
                                            id="input_rights_to_use"
                                            className="form-control"
                                            value={formData.rights_to_use}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, rights_to_use: e.target.value })}
                                            placeholder=""

                                        />
                                    </div>

                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <label htmlFor="input_owner_name" className="form-label fw-medium">ผู้ถือกรรมสิทธิ์ </label>
                                        <input
                                            type="text"
                                            name="owner_name"
                                            id="input_owner_name"
                                            className="form-control"
                                            value={formData.owner_name}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, owner_name: e.target.value })}
                                            placeholder="xxx" />
                                    </div>
                                    <div className="col-lg-8">
                                        <label htmlFor="input_address" className="form-label fw-medium">ที่อยู่</label>
                                        <input
                                            type="text"
                                            name="address"
                                            id="input_address"
                                            className="form-control"
                                            value={formData.address}
                                            onChange={handleChangeInputUpDate}
                                            // {(e) => setFormdata({ ...formData, address: e.target.value })}
                                            placeholder=""
                                        />
                                    </div>
                                </div>


                                <div className="text-center mb-4">
                                    <div className="">
                                        <button className="btn Teal-button" type="submit">บันทึก</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </ReactModal >

            {isOpenModalModels && (
                <Modal_vehicle_madel_show
                    isOpen={isOpenModalModels}
                    onClose={handleCloseModleModels}
                    onSelectModel={handleModelSelected}  // ✅ callback ที่จะรับข้อมูลกลับ
                />
            )}
        </>
    )
}

export default Modal_edit_vehicle;