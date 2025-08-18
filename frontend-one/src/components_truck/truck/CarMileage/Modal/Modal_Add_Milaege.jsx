import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_Add_Mileage = ({ dataMileage, isOpen, onClose, onSuccess }) => {
    const [user, setUser] = useState(null);
    const [isDataInputMileage, setDataInputMileage] = useState({
        reg_id: "",
        emp_id: "",
        recorded_date: "",
        odometer: "",
        notes: "",
        status: "",
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setDataInputMileage((prevState) => ({
                ...prevState,
                emp_id: parsedUser.id_emp || "",
                recorded_date: new Date().toISOString().split("T")[0],
            })); 3
        }
    }, []);
    
    useEffect(() => {
        if (dataMileage?.reg_id && dataMileage.reg_id !== isDataInputMileage.reg_id) {
            setDataInputMileage((prevState) => ({
                ...prevState,
                reg_id: dataMileage.reg_id,
            }));
        }
    }, [dataMileage, isDataInputMileage.reg_id]);
    

    const handleSubmitAddEmpRelation = async (e) => {
        e.preventDefault();
        console.log("📌 Data before sending:", isDataInputMileage);

        if (!isDataInputMileage.odometer) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        try {
            const response = await axios.post(
                `${apiUrl}/api/car_mileage_add_data`,
                isDataInputMileage,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            console.log("✅ Response:", response.data);
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
                    maxWidth: "700px",
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
                <form onSubmit={handleSubmitAddEmpRelation}>
                    <div className="col-lg-12 mb-3">
                        <label htmlFor="input_odometer" className="form-label fw-medium">
                            เลขไมล์รถ
                        </label>
                        <input
                            type="number"
                            name="odometer"
                            id="input_odometer"
                            className="form-control"
                            placeholder="000000"
                            value={isDataInputMileage.odometer}
                            onChange={(e) =>
                                setDataInputMileage({ ...isDataInputMileage, odometer: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-lg-12 mb-3">
                        <label htmlFor="input_recorded_date" className="form-label fw-medium">
                            วันที่
                        </label>
                        <input
                            type="date"
                            name="recorded_date"
                            id="input_recorded_date"
                            className="form-control"
                            value={isDataInputMileage.recorded_date}
                            onChange={(e) =>
                                setDataInputMileage({ ...isDataInputMileage, recorded_date: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-lg-12 mb-3">
                        <label htmlFor="input_note" className="form-label fw-medium">
                            ข้อมูลเพิ่มเติม
                        </label>
                        <textarea
                            name="notes"
                            id="input_note"
                            className="form-control"
                            rows="4"
                            placeholder="ข้อมูลเพิ่มเติม"
                            value={isDataInputMileage.notes}
                            onChange={(e) =>
                                setDataInputMileage({ ...isDataInputMileage, notes: e.target.value })
                            }
                        />
                    </div>

                    {radioOptions.map((option) => (
            <div className="form-check form-check-inline" key={option.id}>
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id={option.id}
                    value={option.value}
                    onChange={(e) =>
                        setDataInputMileage({ ...isDataInputMileage, status: e.target.value })
                    }
                />
                <label className="form-check-label" htmlFor={option.id}>
                    {option.label}
                </label>
            </div>
        ))}



                    <div className="text-center mb-3">
                        <button className="btn btn-primary" type="submit">
                            บันทึก
                        </button>
                    </div>

                    <div className="">
                        <p className="fw-bolder"> <strong style={{ color: "red" }}>*</strong> หมายเหตุ</p>
                        <p><strong>ปกติ:</strong>คำนวณระยะทางต่อเนื่องตามค่าก่อนหน้า</p>
                        <p><strong>เลขไมล์รีเซ็ท:</strong>เริ่มต้นที่ 0 ใหม่ โดยยังไม่ถึงเกณฑ์รีเซ็ต</p>
                        <p><strong>เลขไมล์ย้อนกลับ:</strong>ลดลงเล็กน้อยแต่ไม่กลับไปค่าเริ่มต้น</p>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
};

export default Modal_Add_Mileage;
