import React, { useState, useEffect } from "react";
import VehicleForm from "./VehicleForm";
import FinanceForm from "./FinanceForm";
import TaxForm from "./TaxForm";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";

const VehicleAddForm = () => {

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [activeForm, setActiveForm] = useState('vehicleForm');

    useEffect(() => {
        setActiveForm('vehicleForm');
    }, []);
    
    const [formTransportInsurance, setFormTransportInsurance] = useState({
        insurance_type: "vehicle", 
        insurance_coverage_amount: "", 
        insurance_premium: "", 
        insurance_company: "", 
        insurance_start_date: "", 
        insurance_end_date: "", 
        insurance_file: null
    });
    
    const [formGoodsInsurance, setFormGoodsInsurance] = useState({
        insurance_type: "goods", 
        insurance_coverage_amount: "", 
        insurance_premium: "", 
        insurance_company: "", 
        insurance_start_date: "", 
        insurance_end_date: "", 
        insurance_goods_file: null
    });
    
    

    const [isFinance, setFinance] = useState({
        loan_amount: "",
        interest_rate: "",
        monthly_payment: "",
        start_date: "",
        end_date: "",
        insurance_company: "",
        file_finance: null
    });

    const [formData, setFormdata] = useState({
        reg_date: "",
        reg_number: "",
        province: "",
        fuel: "",
        car_type_id: "",
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
        file_download: null,
        vehicle_type_id: "",
        chassis_number_location: "",
        engine_on_location: "",
        engine_power: "",
        document_order: "",
        reg_doc_number: "",
        inspection_code: "",
        id_branch: "",
        tax_end: "",
        cmi_start: "",
        cmi_end: "",
        axle_count: "",
        wheel_count: "",
        tire_count: "",
        model_id: "",
        // insurance_start: "",
        // insurance_end: "",
        // insurance_name: "",
        status: "active"
    })

    const [errors, setErrors] = useState({});

    // ใช้ฟังก์ชันตรวจสอบแบบไดนามิก
    const validateForm = () => {
      const requiredFields = {
        reg_date: "กรุณากรอกวันที่จดทะเบียน",
        reg_number: "กรุณากรอกเลขทะเบียน",
        province: "กรุณากรอกจังหวัด",
        fuel: "กรุณาเลือกประเภทเชื้อเพลิง",
        car_type_id: "กรุณากรอกข้อมูล",
        chassis_number: "กรุณากรอกข้อมูล",
        usage_type_id: "กรุณากรอกข้อมูล",
        car_brand: "กรุณากรอกข้อมูล",
        model_no: "กรุณากรอกข้อมูล",
        color: "กรุณากรอกข้อมูล",
        engine_brand: "กรุณากรอกข้อมูล",
        engine_no: "กรุณากรอกข้อมูล",
        cylinders: "กรุณากรอกข้อมูล",
        veh_weight: "กรุณากรอกข้อมูล",
        max_load: "กรุณากรอกข้อมูล",
        gross_weight: "กรุณากรอกข้อมูล",
        possession_date: "กรุณากรอกข้อมูล",
        operators: "กรุณากรอกข้อมูล",
        nation: "กรุณากรอกข้อมูล",
        addr: "กรุณากรอกข้อมูล",
        trans_type: "กรุณากรอกข้อมูล",
        license_no: "กรุณากรอกข้อมูล",
        license_expiry: "กรุณากรอกข้อมูล",
        rights_to_use: "กรุณากรอกข้อมูล",
        owner_name: "กรุณากรอกข้อมูล",
        address: "กรุณากรอกข้อมูล",
        // passenger_count: "กรุณากรอกข้อมูลจำนวนผู้โดยสาร", 
        vehicle_type_id: "กรุณากรอกข้อมูล",
        chassis_number_location: "กรุณากรอกข้อมูล",
        engine_on_location: "กรุณากรอกข้อมูล",
        engine_power: "กรุณากรอกข้อมูล",
        document_order: "กรุณากรอกข้อมูล",
        reg_doc_number: "กรุณากรอกข้อมูล",
        inspection_code: "กรุณากรอกข้อมูล",
        id_branch: "กรุณากรอกข้อมูล",
        tax_end: "กรุณากรอกข้อมูล",
        cmi_start: "กรุณากรอกข้อมูล",
        cmi_end: "กรุณากรอกข้อมูล",
        // insurance_start: "กรุณากรอกข้อมูล",
        // insurance_end: "กรุณากรอกข้อมูล",
        // insurance_name: "กรุณากรอกข้อมูล",
      };
    
      const newErrors = {};
    
      // ✅ ตรวจสอบค่าว่างเฉพาะฟิลด์ที่จำเป็น
      Object.keys(requiredFields).forEach((field) => {
        // ถ้า car_type_id === "2" ข้ามการตรวจสอบในบางฟิลด์
        if (
          !formData[field] &&
          !(formData.car_type_id === "2" && ["engine_brand", "engine_no", "engine_on_location", "cylinders", "engine_power"].includes(field))
        ) {
          newErrors[field] = requiredFields[field];
        }
      });
    
      // ✅ ถ้ามีข้อผิดพลาดให้บันทึกและส่งกลับ false
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }
    
      return true;
    };
    useEffect(() => {
        console.log("Updated formData:", formData);
    }, [formData]);
    
    useEffect(() => {
        console.log("Updated isFinance:", isFinance);
    }, [isFinance]);


    const checkDuplicate = async (formData) => {
        try {

            const token = localStorage.getItem("accessToken");
        if (!token) {
            setMessage("Access token is missing. Please log in.");
            setMessageType("error");
            return; // Stop form submission
        }

            const response = await axios.post(`${apiUrl}/api/checkDuplicate_VehicleAdd`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.duplicate) {
                setMessage(response.data.message);  // ตั้งค่าข้อความแจ้งเตือนจาก Backend
                setErrors(response.data.errors_row)
                setMessageType("error");
            }
            return response.data.duplicate;
        } catch (error) {
            console.error("Error checking duplicate:", error);
            setMessage("❌ ไม่สามารถตรวจสอบข้อมูลซ้ำได้");
            setMessageType("error");
            return false;
        }
    };
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;  // ถ้าฟอร์มไม่ผ่าน validation ให้หยุดทำงาน

        console.log('FormData before submission:', formData);
        console.log('IsFinance before submission:', isFinance);
        console.log('formTransportInsurance brfore submision:', formTransportInsurance);
        console.log('formGoodsInsurance brfore submision:', formGoodsInsurance);
    
        const formDataToSend = new FormData(); 

            // ตรวจสอบว่ามีเลขตัวถังซ้ำหรือไม่
        // ตรวจสอบข้อมูลซ้ำก่อนส่ง
        const isDuplicate = await checkDuplicate(formData);
        if (isDuplicate) return; // ถ้าซ้ำ หยุดการส่งข้อมูล

    
        // Append fields from formData
        Object.keys(formData).forEach((key) => {
            if (key === "file_download" && formData[key]) {
                formDataToSend.append(key, formData[key]);
            } else if (key !== "file_download") {
                formDataToSend.append(key, formData[key]);
            }
        });
    
        // Append fields from isFinance
        Object.keys(isFinance).forEach((key) => {
            if (key === "file_finance" && isFinance[key]) {
                formDataToSend.append(key, isFinance[key]);
            } else if (key !== "file_finance") {
                formDataToSend.append(key, isFinance[key]);
            }
        });


                // Append fields from formTransportInsurance
                Object.keys(formTransportInsurance).forEach((key) => {
                    if (key === "file_finance" && formTransportInsurance[key]) {
                        formDataToSend.append(key, formTransportInsurance[key]);
                    } else if (key !== "file_finance") {
                        formDataToSend.append(key, formTransportInsurance[key]);
                    }
                });

                        // Append fields from isFinance
        Object.keys(formGoodsInsurance).forEach((key) => {
            if (key === "file_finance" && formGoodsInsurance[key]) {
                formDataToSend.append(key, formGoodsInsurance[key]);
            } else if (key !== "file_finance") {
                formDataToSend.append(key, formGoodsInsurance[key]);
            }
        });

    
        // Log the FormData manually
        for (let pair of formDataToSend.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
    
        
        console.log("FormData to be sent:", formDataToSend);
    
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setMessage("Access token is missing. Please log in.");
            setMessageType("error");
            return; // Stop form submission
        }
    // Filter driver licenses that have a license number
    // const filteredisFinance = isFinance.filter(
    //     (license) => license.insurance_company && license.insurance_company.trim() !== ""
    //   );
      
        
formDataToSend.append('formData', JSON.stringify(formData)); // ใช้ JSON.stringify()
formDataToSend.append('isFinance', JSON.stringify(isFinance)); // ใช้ JSON.stringify()
formDataToSend.append('formTransportInsurance', JSON.stringify(formTransportInsurance)); // ใช้ JSON.stringify()
formDataToSend.append('formGoodsInsurance', JSON.stringify(formGoodsInsurance)); // ใช้ JSON.stringify()
    
        try {
            const response = await axios.post(
                `${apiUrl}/api/vehicleAdd`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log("Response from the server:", response.data);
    
  
                setMessage(response.data.message || "Data submitted successfully.");
                setMessageType("success");
                setFormdata({
                    reg_date: "",
                    reg_number: "",
                    province: "",
                    fuel: "",
                    car_type_id: "",
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
                    file_download: null,
                    vehicle_type_id: "",
                    chassis_number_location: "",
                    engine_on_location: "",
                    engine_power: "",
                    document_order: "",
                    reg_doc_number: "",
                    inspection_code: "",
                    id_branch: "",
                    tax_end: "",
                    cmi_start: "",
                    cmi_end: "",
                    // insurance_start: "",
                    // insurance_end: "",
                    // insurance_name: "",
                    status: "active"}
                );
                
                setFormTransportInsurance({
                    insurance_type: "vehicle", 
                    insurance_coverage_amount: "", 
                    insurance_premium: "", 
                    insurance_company: "", 
                    insurance_start_date: "", 
                    insurance_end_date: "", 
                    insurance_file: null
                });
                
                setFormGoodsInsurance({
                    insurance_type: "goods", 
                    insurance_coverage_amount: "", 
                    insurance_premium: "", 
                    insurance_company: "", 
                    insurance_start_date: "", 
                    insurance_end_date: "", 
                    insurance_goods_file: null
                });

                setFinance({
                    loan_amount: "",
                    interest_rate: "",
                    monthly_payment: "",
                    start_date: "",
                    end_date: "",
                    insurance_company: "",
                    file_finance: null
                });


        } catch (error) {
            console.error("Upload Error:", error.response ? error.response.data : error.message);
            setMessage(error.response ? error.response.data.message : "Failed to add vehicle or submit data.");
            setMessageType("error");
        }
    };
    
    
    
    
    
    return (
        <>
            <div className="container p-3">
                <div className="text-center">
                    <p className="fs-4">เพิ่มข้อมูลรถใหม่</p>
                </div>

                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link ${activeForm === 'vehicleForm' ? 'active' : ''}`}
                            style={activeForm === 'vehicleForm' ? { backgroundColor: 'blue', color: 'white' } : { color: 'gray' }}
                            onClick={() => setActiveForm('vehicleForm')}
                        >
                            ข้อมูลทะเบียนรถ
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link ${activeForm === 'taxForm' ? 'active' : ''}`}
                            style={activeForm === 'taxForm' ? { backgroundColor: 'blue', color: 'white' } : { color: 'gray' }}
                            onClick={() => setActiveForm('taxForm')}
                        >
                            ภาษี / ประกัน
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link ${activeForm === 'financeForm' ? 'active' : ''}`}
                            style={activeForm === 'financeForm' ? { backgroundColor: 'blue', color: 'white' } : { color: 'gray' }}
                            onClick={() => setActiveForm('financeForm')}
                        >
                            สินเชื่อรถ
                        </button>
                    </li>
                </ul>
                <div className="card rounded-0 mb-3">
                    <div className="card-body">
                        {message && (
                            <div className="p-1">
                                <div
                                    className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                                    style={{
                                        backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                                        color: messageType === "success" ? "#155724" : "#721c24",
                                        border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                                    }}
                                >
                                    {message}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {activeForm === 'vehicleForm' && (
                                <VehicleForm formData={formData} setFormdata={setFormdata} errors={errors} />
                            )}

                            {activeForm === 'financeForm' && (
                                <FinanceForm isFinance={isFinance} setFinance={setFinance} />
                            )}

                            {activeForm === 'taxForm' && (
                                <TaxForm 
                                formData={formData} 
                                setFormdata={setFormdata} 
                                errors={errors} 
                                formTransportInsurance={formTransportInsurance} 
                                setFormTransportInsurance={setFormTransportInsurance}
                                formGoodsInsurance={formGoodsInsurance} 
                                setFormGoodsInsurance={setFormGoodsInsurance}
                            />
                            
                            )}

                            <div className="text-center mb-3">
                                <button type="submit" className="btn" style={{ background: "#4cbec5", color: "#ffffff" }}>บันทึก</button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </>
    );
};

export default VehicleAddForm;
