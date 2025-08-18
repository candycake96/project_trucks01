import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";

Modal.setAppElement('#root');

const Vehicle_pairing = ({ isOpen, onClose, dataVehicle, onSuccess }) => {
  if (!dataVehicle) return null;
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [pairing, setPairing] = useState({
    reg_id_1: "",
    car_type_id: "",
    reg_number: ""
  });

  const handleSubmitAddRelationCar = async (e) => {
    e.preventDefault();
    const dataToSend = {
      reg_id_1: pairing.reg_id_1,
      car_type_id: pairing.car_type_id,
      reg_number: pairing.reg_number,
    };
    
    try {
      const response = await axios.post(
        `${apiUrl}/api/vehicle_relation_add`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
  
      setMessage(response.data.message);
      setMessageType("success");
      alert("บันทึกข้อมูลสำเร็จ!");
      onSuccess();
      onClose(); // ปิดโมดอล
      console.log(response.data);
    } catch (error) {
      console.error("Error updating vehicle relation:", error);
      setMessage(error.response.data.message);
      setMessageType("error");
    }
  };
  
  

  useEffect(() => {
    if (dataVehicle?.reg_id) {
      setPairing(prevState => ({
        ...prevState,
        reg_id_1: dataVehicle.car_type_id === 1 ? dataVehicle.reg_id : "",
      }));
    }
    if (dataVehicle?.car_type_id) {
      setPairing(prevState => ({
        ...prevState,
        car_type_id: dataVehicle.car_type_id
      }));
    }
  }, [dataVehicle]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Vehicle Pairing Modal"
      ariaHideApp={false}
      style={{
        content: {
          width: "90vw", // ใช้เปอร์เซ็นต์ของ viewport width เพื่อความยืดหยุ่น
          maxWidth: "600px", // จำกัดขนาดสูงสุด
          height: "auto", // ใช้ auto เพื่อให้สูงตามเนื้อหา
          maxHeight: "60vh", // จำกัดความสูงไม่ให้เกิน 60% ของหน้าจอ
          margin: "auto",
          padding: "20px",
          border: "none",
          borderRadius: "0.5rem",
          overflow: "auto", // ใช้ auto เพื่อให้ scroll เมื่อเนื้อหาเยอะ
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
      <div>
        <div className="text-center mb-4">
          <p className="fw-bolder">การจับคู่ระหว่างรถหัวลากและรถหางลากในระบบขนส่ง </p>
        </div>
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
        <div>
          <div className="mb-3">
            <label htmlFor="input_reg_number" className="form-label fw-medium">
              {dataVehicle.car_type_id === 2 ? ('หางลากทะเบียนรถ') : ('หัวลากทะเบียนรถ')}
            </label>
            <input
              type="text"
              name="reg_number"
              id="input_reg_number"
              className="form-control"
              value={dataVehicle.reg_number}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label htmlFor="input_code" className="form-label fw-medium">
              {dataVehicle.car_type_id === 1 ? ('หางลากทะเบียนรถ') : ('หัวลากทะเบียนรถ')}
            </label>
            <div className="input-group">
              <input
                type="text"
                name="code"
                id="input_code"
                className="form-control"
                placeholder="ทะเบียนรถ"
                value={pairing.reg_number}
                onChange={(e) => setPairing({ ...pairing, reg_number: e.target.value })}
              />
            </div>
          </div>

          <div className="text-center">
            <button className="btn save-btn" onClick={handleSubmitAddRelationCar}>บันทึก</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Vehicle_pairing;
