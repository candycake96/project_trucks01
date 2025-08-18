import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_Edit_MIleage = ({ dataMileage, isOpen, onClose, onSuccess }) => {
   const [user, setUser] = useState(null);
const initialFormData = {
    reg_id: "", // Default to empty string if no reg_id is available
    emp_id: "",
    recorded_date: "",
    odometer: "",
    notes: "",
    status: "",
};

const [isDataInputMileage, setDataInputMileage] = useState(initialFormData);

useEffect(() => {
    if (isOpen && dataMileage) {  // Only trigger when `isOpen` is true and data is available
        const userData = JSON.parse(localStorage.getItem("user")) || {};

        // Check if userData is valid and contains the expected properties
        if (userData && userData.id_emp) {
            setUser(userData);
            
            // Check for reg_id and provide fallback or log an error if it's missing
            const regId = dataMileage.reg_id || "ไม่มีข้อมูล";  // Use a placeholder or fallback value

            setDataInputMileage({
                ...initialFormData,
                emp_id: userData.id_emp || "",
                reg_id: regId,  // Set reg_id, or fallback value if it's not available
                recorded_date: dataMileage.created_at ? dataMileage.created_at.split("T")[0] : "",
                odometer: dataMileage.odometer || "",
                status: dataMileage.status || "ปกติ",
                notes: dataMileage.notes || "",
            });
        } else {
            // Handle case where user data is missing or invalid
            console.warn("User data not available or incomplete");
            setUser(null);
            setDataInputMileage(initialFormData);
        }
    }
}, [isOpen, dataMileage]);  // Dependencies are now specific to when the modal opens or the data changes


    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataInputMileage((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmitMileageData = async (e) => {
        e.preventDefault();

        if (!isDataInputMileage.odometer || !isDataInputMileage.recorded_date) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        const formData = {
            reg_id:isDataInputMileage.reg_id,
            emp_id:isDataInputMileage.emp_id,
            recorded_date:isDataInputMileage.recorded_date,
            notes:isDataInputMileage.notes,
            odometer:isDataInputMileage.odometer,
            status:isDataInputMileage.status
        }
        console.log(formData);

        try {
            const response = await axios.put(
                `${apiUrl}/api/car_mileage_update/${dataMileage.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            alert("บันทึกข้อมูลสำเร็จ!");
            if (typeof onSuccess === "function") {
                onSuccess();
            }
            onClose();
        } catch (error) {
            console.error("❌ Error saving data:", error);
            alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    const radioOptions = [
        { id: "flexRadioDefault1", value: "ปกติ", label: "ปกติ" },
        { id: "flexRadioDefault4", value: "รีเซ็ต", label: "เลขไมล์รีเซ็ต" },
        { id: "flexRadioDefault5", value: "ย้อนกลับ", label: "เลขไมล์ย้อนกลับ" }
    ];


    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="Employee Details"
            style={{
                content: {
                    width: "90%",
                    maxWidth: "600px",
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
             <div className="p-3">
                <div className="fw-bolder text-center mb-3">
                    <p className="fs-6">เพิ่มข้อมูลเลขไมล์รถ</p>
                </div>
                <form onSubmit={handleSubmitMileageData}>
                    <div className="col-lg-12 mb-3">
                        <label htmlFor="input_odometer" className="form-label fw-medium">เลขไมล์รถ</label>
                        <input
                            type="number"
                            name="odometer"
                            id="input_odometer"
                            className="form-control"
                            placeholder="000000"
                            value={isDataInputMileage.odometer} 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-lg-12 mb-3">
                        <label htmlFor="input_recorded_date" className="form-label fw-medium">วันที่</label>
                        <input
                            type="date"
                            name="recorded_date"
                            id="input_recorded_date"
                            className="form-control"
                            value={isDataInputMileage.recorded_date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-lg-12 mb-3">
                        <label htmlFor="input_note" className="form-label fw-medium">ข้อมูลเพิ่มเติม</label>
                        <textarea
                            name="notes"
                            id="input_note"
                            className="form-control"
                            rows="4"
                            placeholder="ข้อมูลเพิ่มเติม"
                            value={isDataInputMileage.notes}
                            onChange={handleChange}
                        />
                    </div>

                    {radioOptions.map((option) => (
                        <div className="form-check form-check-inline" key={option.id}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="status"
                                id={option.id}
                                value={option.value}
                                checked={isDataInputMileage.status === option.value}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor={option.id}>
                                {option.label}
                            </label>
                        </div>
                    ))}

                    <div className="text-center mb-3">
                        <button className="btn btn-primary" type="submit">บันทึก</button>
                    </div>

                    <div>
                        <p className="fw-bolder"><strong style={{ color: "red" }}>*</strong> หมายเหตุ</p>
                        <p><strong>ปกติ:</strong> คำนวณระยะทางต่อเนื่องตามค่าก่อนหน้า</p>
                        <p><strong>เลขไมล์รีเซ็ต:</strong> เริ่มต้นที่ 0 ใหม่ โดยยังไม่ถึงเกณฑ์รีเซ็ต</p>
                        <p><strong>เลขไมล์ย้อนกลับ:</strong> ลดลงเล็กน้อยแต่ไม่กลับไปค่าเริ่มต้น</p>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
};

export default Modal_Edit_MIleage;
