import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import Modal_vehicle_madel_show from "./setting_vehicle/vehicle_models/modal/Modal_vehicle_model_show";
import { Button } from "react-bootstrap";

const VehicleForm = ({ formData, setFormdata, errors }) => {


    const [isCarType, setCarType] = useState([]);
    const [isVehicleType, setVehicleType] = useState([]);
    const [isUsageType, setUsageType] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedCarType, setSelectedCarType] = useState(""); // เก็บค่าที่เลือก

    const handleCarTypeChange = (e) => {
        const value = e.target.value;
        setSelectedCarType(value); // อัปเดตค่าที่เลือก
        setFormdata({ ...formData, car_type_id: value });
    };

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
            ...formData,
            car_brand: selectedModel.brand,
            model_no: selectedModel.model,
            model_id: selectedModel.model_id,
        });

        handleCloseModleModels(); // ← ปิด Modal
    };


    const fetchCarType = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            console.log("Stored Token:", token); // ✅ ตรวจสอบ Token
            if (!token) {
                console.error("No access token found");
                return;
            }

            const response = await axios.get(`${apiUrl}/api/detailscartype`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("API Response:", response.data); // ✅ ตรวจสอบ Response

            setCarType(response.data);
        } catch (error) {
            console.error("Error fetching detailscartype:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status); // ✅ ดูว่าเป็น 403 จริงไหม
                console.error("Response Data:", error.response.data); // ✅ ดูข้อความจากเซิร์ฟเวอร์
            }
        }
    };

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

    const fetchBranches = async (user) => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getbranches/${user.company_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // console.log("Fetched positions:", response.data); // Check fetched data
            setBranches(response.data);
        } catch (error) {
            console.error("Error fetching job positions:", error);
        }
    };


    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            // ✅ Fetch branches only after setting user
            fetchCarType();
            fetchVehicleType();
            fetchVehicleUsageType();
            fetchBranches(parsedUser);
        }
    }, []);


    const [user, setUser] = useState(null);
    useEffect(() => {
        // ดึงข้อมูลผู้ใช้จาก localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData)); // แปลง JSON เป็น Object แล้วเก็บใน state
        }
    }, []);

    if (!user) {
        return <p>Loading...</p>;
    }


    const handleFileChange = (e) => {
        setFormdata({ ...formData, file_download: e.target.files[0] });
    };





    return (
        <>
            <div className="container">
                {/* <div className="text-center p-3">
                    <p className="fs-4"> เพิ่มข้อมูลรถใหม่ {user.company_id}</p>
                    <hr />
                </div> */}

                <div className="">
                    <div className="">

                        <div className="fw-bolder text-center mb-2">
                            <p>บันทึกข้อมูลรายการรถ</p>
                        </div>
                        <div className="row mb-3">
                            <div className="col-lg-4">
                                <label htmlFor="input_car_type_id" className="form-label fw-medium">ประเภทรถ  <span style={{ color: "red" }}> *</span></label>
                                <select
                                    className="form-select"
                                    id="input_car_type_id"
                                    name="car_type_id"
                                    value={formData.car_type_id}
                                    onChange={handleCarTypeChange}
                                >
                                    <option value="">เลือกประเภทรถ</option>
                                    {isCarType.length > 0 ? (
                                        isCarType.map((rowCarType) => (
                                            <option key={rowCarType.car_type_id} value={rowCarType.car_type_id}>
                                                {rowCarType.car_type_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>กำลังโหลด...</option>
                                    )}
                                </select>
                                {errors.car_type_id && <p className="text-danger">{errors.car_type_id}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_id_branch" className="form-label fw-medium">สาขา  <span style={{ color: "red" }}> *</span></label>
                                <select
                                    className="form-select"
                                    id="input_id_branch"
                                    name="id_branch"
                                    value={formData.id_branch}
                                    onChange={(e) => setFormdata({ ...formData, id_branch: e.target.value })}
                                >
                                    <option value="">สาขา</option>
                                    {branches.length > 0 ? (
                                        branches.map((rowBranches) => (
                                            <option key={rowBranches.id_branch} value={rowBranches.id_branch}>
                                                {rowBranches.branch_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>กำลังโหลด...</option>
                                    )}
                                </select>
                                {errors.id_branch && <p className="text-danger">{errors.id_branch}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_file_download" className="form-label fw-medium">ไฟล์สแกนเอกสารรถ (ถ้ามี) </label>
                                <input
                                    type="file"
                                    id="input_file_download"
                                    className="form-control"
                                    name="file_download"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <hr className="mb-3" />


                        <div className="text-center mb-3">
                            <p className="fw-bolder">รายการจดทะเบียน</p>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="input_reg_date" className="form-label fw-medium">วันที่จดทะเบียน  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="date"
                                    id="input_reg_date"
                                    name="reg_date"
                                    className="form-control"
                                    value={formData.reg_date}
                                    onChange={(e) => setFormdata({ ...formData, reg_date: e.target.value })}
                                />
                                {errors.reg_date && <p className="text-danger">{errors.reg_date}</p>}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label htmlFor="input_reg_number" className="form-label fw-medium">เลขทะเบียน  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="reg_number"
                                    id="input_reg_number"
                                    className="form-control"
                                    value={formData.reg_number}
                                    onChange={(e) => setFormdata({ ...formData, reg_number: e.target.value })}
                                    placeholder="กรอกเลขทะเบียน" />
                                {errors.reg_number && <p className="text-danger">{errors.reg_number}</p>}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label htmlFor="input_province" className="form-label fw-medium">จังหวัด  <span style={{ color: "red" }}> *</span></label>
                                <select
                                    // type="text"
                                    name="province"
                                    id="input_province"
                                    className="form-control"
                                    value={formData.province}
                                    onChange={(e) => setFormdata({ ...formData, province: e.target.value })}
                                // placeholder="กรอกจังหวัด"
                                >
                                    <option value="">กรุณาเลือกจังหวัด</option>
                                    <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                                    <option value="กระบี่">กระบี่</option>
                                    <option value="กาญจนบุรี">กาญจนบุรี</option>
                                    <option value="กาฬสินธุ์">กาฬสินธุ์</option>
                                    <option value="กำแพงเพชร">กำแพงเพชร</option>
                                    <option value="ขอนแก่น">ขอนแก่น</option>
                                    <option value="จันทบุรี">จันทบุรี</option>
                                    <option value="ฉะเชิงเทรา">ฉะเชิงเทรา</option>
                                    <option value="ชัยนาท">ชัยนาท</option>
                                    <option value="ชัยภูมิ">ชัยภูมิ</option>
                                    <option value="ชุมพร">ชุมพร</option>
                                    <option value="ชลบุรี">ชลบุรี</option>
                                    <option value="เชียงใหม่">เชียงใหม่</option>
                                    <option value="เชียงราย">เชียงราย</option>
                                    <option value="ตรัง">ตรัง</option>
                                    <option value="ตราด">ตราด</option>
                                    <option value="ตาก">ตาก</option>
                                    <option value="นครนายก">นครนายก</option>
                                    <option value="นครปฐม">นครปฐม</option>
                                    <option value="นครพนม">นครพนม</option>
                                    <option value="นครราชสีมา">นครราชสีมา</option>
                                    <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
                                    <option value="นครสวรรค์">นครสวรรค์</option>
                                    <option value="นราธิวาส">นราธิวาส</option>
                                    <option value="น่าน">น่าน</option>
                                    <option value="นนทบุรี">นนทบุรี</option>
                                    <option value="บึงกาฬ">บึงกาฬ</option>
                                    <option value="บุรีรัมย์">บุรีรัมย์</option>
                                    <option value="ประจวบคีรีขันธ์">ประจวบคีรีขันธ์</option>
                                    <option value="ปทุมธานี">ปทุมธานี</option>
                                    <option value="ปราจีนบุรี">ปราจีนบุรี</option>
                                    <option value="ปัตตานี">ปัตตานี</option>
                                    <option value="พะเยา">พะเยา</option>
                                    <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
                                    <option value="พังงา">พังงา</option>
                                    <option value="พิจิตร">พิจิตร</option>
                                    <option value="พิษณุโลก">พิษณุโลก</option>
                                    <option value="เพชรบุรี">เพชรบุรี</option>
                                    <option value="เพชรบูรณ์">เพชรบูรณ์</option>
                                    <option value="แพร่">แพร่</option>
                                    <option value="พัทลุง">พัทลุง</option>
                                    <option value="ภูเก็ต">ภูเก็ต</option>
                                    <option value="มหาสารคาม">มหาสารคาม</option>
                                    <option value="มุกดาหาร">มุกดาหาร</option>
                                    <option value="แม่ฮ่องสอน">แม่ฮ่องสอน</option>
                                    <option value="ยโสธร">ยโสธร</option>
                                    <option value="ยะลา">ยะลา</option>
                                    <option value="ร้อยเอ็ด">ร้อยเอ็ด</option>
                                    <option value="ระนอง">ระนอง</option>
                                    <option value="ระยอง">ระยอง</option>
                                    <option value="ราชบุรี">ราชบุรี</option>
                                    <option value="ลพบุรี">ลพบุรี</option>
                                    <option value="ลำปาง">ลำปาง</option>
                                    <option value="ลำพูน">ลำพูน</option>
                                    <option value="เลย">เลย</option>
                                    <option value="ศรีสะเกษ">ศรีสะเกษ</option>
                                    <option value="สกลนคร">สกลนคร</option>
                                    <option value="สงขลา">สงขลา</option>
                                    <option value="สมุทรสาคร">สมุทรสาคร</option>
                                    <option value="สมุทรปราการ">สมุทรปราการ</option>
                                    <option value="สมุทรสงคราม">สมุทรสงคราม</option>
                                    <option value="สระแก้ว">สระแก้ว</option>
                                    <option value="สระบุรี">สระบุรี</option>
                                    <option value="สิงห์บุรี">สิงห์บุรี</option>
                                    <option value="สุโขทัย">สุโขทัย</option>
                                    <option value="สุพรรณบุรี">สุพรรณบุรี</option>
                                    <option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
                                    <option value="สุรินทร์">สุรินทร์</option>
                                    <option value="หนองคาย">หนองคาย</option>
                                    <option value="หนองบัวลำภู">หนองบัวลำภู</option>
                                    <option value="อ่างทอง">อ่างทอง</option>
                                    <option value="อุดรธานี">อุดรธานี</option>
                                    <option value="อุทัยธานี">อุทัยธานี</option>
                                    <option value="อุตรดิตถ์">อุตรดิตถ์</option>
                                    <option value="อุบลราชธานี">อุบลราชธานี</option>
                                    <option value="อำนาจเจริญ">อำนาจเจริญ</option>
                                </select>
                                {errors.province && <p className="text-danger">{errors.province}</p>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-3">
                                <label htmlFor="input_fuel" className="form-label fw-medium">เชื้อเพลิง  <span style={{ color: "red" }}> *</span></label>
                                <select
                                    id="input_fuel"
                                    className="form-select"
                                    name="fuel"
                                    value={formData.fuel}
                                    onChange={(e) => setFormdata({ ...formData, fuel: e.target.value })}
                                >
                                    <option value="">กรุณาเลือกเชื้อเพลิง</option>
                                    <option value="ไม่ใช้เชื้อเพลิง">ไม่ใช้เชื้อเพลิง</option>
                                    <option value="ไฟฟ้า">ไฟฟ้า</option>
                                    <option value="เบนซิน 95">น้ำมันเบนซิน 95</option>
                                    <option value="แก๊สโซฮอล์ 95 (E10)">น้ำมันแก๊สโซฮอล์ 95 (E10)</option>
                                    <option value="แก๊สโซฮอล์ 91 (E10)">แก๊สโซฮอล์ 91 (E10)</option>
                                    <option value="แก๊สโซฮอล์ E20">แก๊สโซฮอล์ E20</option>
                                    <option value="แก๊สโซฮอล์ E85">แก๊สโซฮอล์ E85 </option>
                                    <option value="พรีเมี่ยมดีเซล">พรีเมี่ยมดีเซล</option>
                                    <option value="ไบโอดีเซล B7">ไบโอดีเซล B7</option>
                                    <option value="ไบโอดีเซล B10">ไบโอดีเซล B10</option>
                                    <option value="ไบโอดีเซล B20">ไบโอดีเซล B20</option>
                                    <option value="ก๊าซ CNG">ก๊าซ CNG</option>
                                    <option value="ก๊าซ CNG">ก๊าซ NGV</option>
                                </select>
                                {errors.fuel && <p className="text-danger">{errors.fuel}</p>}
                            </div>
                            <div className="col-lg-3">
                                <label htmlFor="inputinspection_code" className="form-label fw-medium">รหัสตรวจสภาพ</label>
                                <input
                                    type="text"
                                    name="inspection_code"
                                    id="inputinspection_code"
                                    className="form-control"
                                    value={formData.inspection_code}
                                    onChange={(e) => setFormdata({ ...formData, inspection_code: e.target.value })}
                                    placeholder="รหัสตรวจสภาพ" />
                                {errors.inspection_code && <p className="text-danger">{errors.inspection_code}</p>}
                            </div>
                            <div className="col-lg-3">
                                <label htmlFor="input_vehicle_type_id" className="form-label fw-medium">ประเภท  <span style={{ color: "red" }}> *</span></label>
                                <select
                                    id="input_vehicle_type_id"
                                    className="form-select"
                                    name="vehicle_type_id"
                                    value={formData.vehicle_type_id}
                                    onChange={(e) => setFormdata({ ...formData, vehicle_type_id: e.target.value })}
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
                                {errors.vehicle_type_id && <p className="text-danger">{errors.vehicle_type_id}</p>}
                            </div>
                            <div className="col-lg-3">
                                <label htmlFor="input_usage_type_id" className="form-label fw-medium">ลักษณะ / มาตรฐาน  <span style={{ color: "red" }}> *</span></label>
                                <select
                                    className="form-select"
                                    id="input_usage_type_id"
                                    name="usage_type_id"
                                    value={formData.usage_type_id}
                                    onChange={(e) => setFormdata({ ...formData, usage_type_id: e.target.value })}
                                >
                                    <option value="">เลือกประเภทรถ</option>
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
                                {errors.usage_type_id && <p className="text-danger">{errors.usage_type_id}</p>}
                            </div>
                        </div>

                        <div className="row mb-3">
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
                                        onChange={(e) => setFormdata({ ...formData, car_brand: e.target.value })}
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
                                {errors.car_brand && (
                                    <div className="form-text text-danger">{errors.car_brand}</div>
                                )}
                            </div>

                            <div className="col-lg-4">
                                <label htmlFor="input_model_no" className="form-label fw-medium">แบบ / รุ่น  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="model_no"
                                    id="input_model_no"
                                    className="form-control"
                                    value={formData.model_no}
                                    onChange={(e) => setFormdata({ ...formData, model_no: e.target.value })}
                                    placeholder=""
                                    disabled
                                     />
                                {errors.model_no && <p className="text-danger">{errors.model_no}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_color" className="form-label fw-medium">สี  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="color"
                                    id="input_color"
                                    className="form-control"
                                    value={formData.color}
                                    onChange={(e) => setFormdata({ ...formData, color: e.target.value })}
                                    placeholder="สี" />
                                {errors.color && <p className="text-danger">{errors.color}</p>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-4">
                                <label htmlFor="input_chassis_number" className="form-label fw-medium">เลขตัวถัง  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="chassis_number"
                                    id="input_chassis_number"
                                    className="form-control"
                                    value={formData.chassis_number}
                                    onChange={(e) => setFormdata({ ...formData, chassis_number: e.target.value })}
                                    placeholder="ยี่ห้อรถ" />
                                {errors.chassis_number && <p className="text-danger">{errors.chassis_number}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_chassis_number_location" className="form-label fw-medium">อยู่ที่  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="chassis_number_location"
                                    id="input_chassis_number_location"
                                    className="form-control"
                                    value={formData.chassis_number_location}
                                    onChange={(e) => setFormdata({ ...formData, chassis_number_location: e.target.value })}
                                    placeholder="" />
                                {errors.chassis_number_location && <p className="text-danger">{errors.chassis_number_location}</p>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-4">
                                <label htmlFor="input_engine_brand" className="form-label fw-medium">ยี่ห้อเครื่องยนต์  {selectedCarType !== "2" && (<span style={{ color: "red" }}> *</span>)} </label>
                                <input
                                    type="text"
                                    name="engine_brand"
                                    id="input_engine_brand"
                                    className="form-control"
                                    value={formData.engine_brand}
                                    onChange={(e) => setFormdata({ ...formData, engine_brand: e.target.value })}
                                    placeholder="ยี่ห้อรถ" />
                                {errors.engine_brand && <p className="text-danger">{errors.engine_brand}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_engine_no " className="form-label fw-medium">เลขเครื่องยนต์  {selectedCarType !== "2" && (<span style={{ color: "red" }}> *</span>)}</label>
                                <input
                                    type="text"
                                    name="engine_no "
                                    id="input_engine_no "
                                    className="form-control"
                                    value={formData.engine_no}
                                    onChange={(e) => setFormdata({ ...formData, engine_no: e.target.value })}
                                    placeholder="" />
                                {errors.engine_no && <p className="text-danger">{errors.engine_no}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_engine_on_location" className="form-label fw-medium">อยู่ที่  {selectedCarType !== "2" && (<span style={{ color: "red" }}> *</span>)}</label>
                                <input
                                    type="text"
                                    name="engine_on_location"
                                    id="input_engine_on_location"
                                    className="form-control"
                                    value={formData.engine_on_location}
                                    onChange={(e) => setFormdata({ ...formData, engine_on_location: e.target.value })}
                                    placeholder=""
                                />
                                {errors.engine_on_location && <p className="text-danger">{errors.engine_on_location}</p>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-2">
                                <label htmlFor="input_cylinders" className="form-label fw-medium">จำนวนสูบ   {selectedCarType !== "2" && (<span style={{ color: "red" }}> *</span>)}</label>
                                <input
                                    type="text"
                                    name="cylinders"
                                    id="input_cylinders"
                                    className="form-control"
                                    value={formData.cylinders}
                                    onChange={(e) => setFormdata({ ...formData, cylinders: e.target.value })}
                                    placeholder="ยี่ห้อรถ"
                                />
                                {errors.cylinders && <p className="text-danger">{errors.cylinders}</p>}
                            </div>
                            <div className="col-lg-2">
                                <label htmlFor="input_engine_power" className="form-label fw-medium">แรงม้า   {selectedCarType !== "2" && (<span style={{ color: "red" }}> *</span>)}</label>
                                <input
                                    type="text"
                                    name="engine_power"
                                    id="input_engine_power"
                                    className="form-control"
                                    value={formData.engine_power}
                                    onChange={(e) => setFormdata({ ...formData, engine_power: e.target.value })}
                                    placeholder="" />
                                {errors.engine_power && <p className="text-danger">{errors.engine_power}</p>}
                            </div>
                            <div className="col-lg-2">
                                <label htmlFor="input_axle_count" className="form-label fw-medium">เพลา</label>
                                <input
                                    type="text"
                                    name="axle_count"
                                    id="input_axle_count"
                                    className="form-control"
                                    value={formData.axle_count}
                                    onChange={(e) => setFormdata({ ...formData, axle_count: e.target.value })}
                                    placeholder="" />
                                {errors.axle_count && <p className="text-danger">{errors.axle_count}</p>}
                            </div>
                            <div className="col-lg-2">
                                <label htmlFor="input_wheel_count" className="form-label fw-medium">ล้อ</label>
                                <input
                                    type="text"
                                    name="wheel_count"
                                    id="input_wheel_count"
                                    className="form-control"
                                    value={formData.wheel_count}
                                    onChange={(e) => setFormdata({ ...formData, wheel_count: e.target.value })}
                                    placeholder="" />
                                {errors.wheel_count && <p className="text-danger">{errors.wheel_count}</p>}
                            </div>
                            <div className="col-lg-2">
                                <label htmlFor="input_tire_count" className="form-label fw-medium">ยาง</label>
                                <input
                                    type="text"
                                    name="tire_count"
                                    id="input_tire_count"
                                    className="form-control"
                                    value={formData.tire_count}
                                    onChange={(e) => setFormdata({ ...formData, tire_count: e.target.value })}
                                    placeholder="" />
                                {errors.tire_count && <p className="text-danger">{errors.tire_count}</p>}
                            </div>


                            <div className="col-lg-2">
                                <label htmlFor="input_veh_weight" className="form-label fw-medium">น้ำหนักรถ  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="veh_weight"
                                    id="input_veh_weight"
                                    className="form-control"
                                    value={formData.veh_weight}
                                    onChange={(e) => setFormdata({ ...formData, veh_weight: e.target.value })}
                                    placeholder="" />
                                {errors.veh_weight && <p className="text-danger">{errors.veh_weight}</p>}
                            </div>
                            <div className="col-lg-2">
                                <label htmlFor="input_passenger_count" className="form-label fw-medium">จำนวนผู้โดยสาร</label>
                                <input
                                    type="text"
                                    name="passenger_count"
                                    id="input_passenger_count"
                                    className="form-control"
                                    value={formData.passenger_count}
                                    onChange={(e) => setFormdata({ ...formData, passenger_count: e.target.value })}
                                    placeholder="" />
                                {errors.passenger_count && <p className="text-danger">{errors.passenger_count}</p>}
                            </div>
                            <div className="col-lg-2">
                                <label htmlFor="input_max_load" className="form-label fw-medium">น้ำหนักบรรทุก(ลงเพลา)  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="max_load"
                                    id="input_max_load"
                                    className="form-control"
                                    value={formData.max_load}
                                    onChange={(e) => setFormdata({ ...formData, max_load: e.target.value })}
                                    placeholder="" />
                                {errors.max_load && <p className="text-danger">{errors.max_load}</p>}
                            </div>
                            <div className="col-lg-2">
                                <label htmlFor="input_gross_weight" className="form-label fw-medium">น้ำหนักรวม  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="gross_weight"
                                    id="input_gross_weight"
                                    className="form-control"
                                    value={formData.gross_weight}
                                    onChange={(e) => setFormdata({ ...formData, gross_weight: e.target.value })}
                                    placeholder="" />
                                {errors.gross_weight && <p className="text-danger">{errors.gross_weight}</p>}
                            </div>
                        </div>


                        <hr className="mb-3" />
                        <div className="text-center mb-3">
                            <p className="fw-bolder">เจ้าของรถ</p>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-4">
                                <label htmlFor="input_document_order" className="form-label fw-medium">ลำดับที่  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="document_order"
                                    id="input_document_order"
                                    className="form-control"
                                    value={formData.document_order}
                                    onChange={(e) => setFormdata({ ...formData, document_order: e.target.value })}
                                    placeholder="xxx" />
                                {errors.document_order && <p className="text-danger">{errors.document_order}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_possession_date" className="form-label fw-medium">วัน เดือน ปี ที่ครอบครอง  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="date"
                                    name="possession_date"
                                    id="input_possession_date"
                                    className="form-control"
                                    value={formData.possession_date}
                                    onChange={(e) => setFormdata({ ...formData, possession_date: e.target.value })}
                                    placeholder="" />
                                {errors.possession_date && <p className="text-danger">{errors.possession_date}</p>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-4">
                                <label htmlFor="input_operators" className="form-label fw-medium">ผู้ประกอบการขนส่ง  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="operators"
                                    id="input_operators"
                                    className="form-control"
                                    value={formData.operators}
                                    onChange={(e) => setFormdata({ ...formData, operators: e.target.value })}
                                    placeholder="xxx" />
                                {errors.operators && <p className="text-danger">{errors.operators}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_reg_doc_number" className="form-label fw-medium">หนังสือสำคัญแสดงการจดทะเบียน  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="reg_doc_number"
                                    id="input_reg_doc_number"
                                    className="form-control"
                                    value={formData.reg_doc_number}
                                    onChange={(e) => setFormdata({ ...formData, reg_doc_number: e.target.value })}
                                    placeholder="" />
                                {errors.reg_doc_number && <p className="text-danger">{errors.reg_doc_number}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_nation" className="form-label fw-medium">สัญชาติ  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="nation"
                                    id="input_nation"
                                    className="form-control"
                                    value={formData.nation}
                                    onChange={(e) => setFormdata({ ...formData, nation: e.target.value })}
                                    placeholder="" />
                                {errors.nation && <p className="text-danger">{errors.nation}</p>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-4">
                                <label htmlFor="input_addr" className="form-label fw-medium">ที่อยู่  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="addr"
                                    id="input_addr"
                                    className="form-control"
                                    value={formData.addr}
                                    onChange={(e) => setFormdata({ ...formData, addr: e.target.value })}
                                    placeholder="xxx" />
                                {errors.addr && <p className="text-danger">{errors.addr}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_trans_type" className="form-label fw-medium">ประกอบการขนส่งประเภท  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="trans_type"
                                    id="input_trans_type"
                                    className="form-control"
                                    value={formData.trans_type}
                                    onChange={(e) => setFormdata({ ...formData, trans_type: e.target.value })}
                                    placeholder="" />
                                {errors.trans_type && <p className="text-danger">{errors.trans_type}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_license_no" className="form-label fw-medium">ใบอนุญาตเลขที่  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="license_no"
                                    id="input_license_no"
                                    className="form-control"
                                    value={formData.license_no}
                                    onChange={(e) => setFormdata({ ...formData, license_no: e.target.value })}
                                    placeholder="" />
                                {errors.license_no && <p className="text-danger">{errors.license_no}</p>}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-4">
                                <label htmlFor="input_license_expiry" className="form-label fw-medium">วันสิ้นอายุใบอนุญาต  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="date"
                                    name="license_expiry"
                                    id="input_license_expiry"
                                    className="form-control"
                                    value={formData.license_expiry}
                                    onChange={(e) => setFormdata({ ...formData, license_expiry: e.target.value })}
                                />
                                {errors.license_expiry && <p className="text-danger">{errors.license_expiry}</p>}
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="input_rights_to_use" className="form-label fw-medium">มีสิทธิครอบครองและใช้รถโดย  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="rights_to_use"
                                    id="input_rights_to_use"
                                    className="form-control"
                                    value={formData.rights_to_use}
                                    onChange={(e) => setFormdata({ ...formData, rights_to_use: e.target.value })}
                                    placeholder=""
                                />
                                {errors.rights_to_use && <p className="text-danger">{errors.rights_to_use}</p>}
                            </div>

                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-4">
                                <label htmlFor="input_owner_name" className="form-label fw-medium">ผู้ถือกรรมสิทธิ์  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="owner_name"
                                    id="input_owner_name"
                                    className="form-control"
                                    value={formData.owner_name}
                                    onChange={(e) => setFormdata({ ...formData, owner_name: e.target.value })}
                                    placeholder="xxx" />
                                {errors.owner_name && <p className="text-danger">{errors.owner_name}</p>}
                            </div>
                            <div className="col-lg-8">
                                <label htmlFor="input_address" className="form-label fw-medium">ที่อยู่  <span style={{ color: "red" }}> *</span></label>
                                <input
                                    type="text"
                                    name="address"
                                    id="input_address"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={(e) => setFormdata({ ...formData, address: e.target.value })}
                                    placeholder=""
                                />
                                {errors.address && <p className="text-danger">{errors.address}</p>}
                            </div>
                        </div>




                    </div>
                </div>
            </div>

            {isOpenModalModels && (
                <Modal_vehicle_madel_show
                    isOpen={isOpenModalModels}
                    onClose={handleCloseModleModels}
                    onSelectModel={handleModelSelected}  // ✅ callback ที่จะรับข้อมูลกลับ
                />
            )}
        </>
    );
}

export default VehicleForm;
