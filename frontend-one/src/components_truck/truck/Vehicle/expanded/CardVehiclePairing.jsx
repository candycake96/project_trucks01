import React, { useEffect, useState } from "react";
import Vehicle_pairing from "../modal/Vehicle_pairing";
import axios from "axios";
import { apiUrl } from "../../../../config/apiConfig";

const CardVehiclePairing = ({ dataVehicle }) => {
  const [isPairingOpenModal, setPairingOpenModal] = useState(false);
  const [reload, setReload] = useState(false); // โหลดใหม่เมื่อ `reload` เปลี่ยน

  const handlePairingOpenModal = () => {
    if (!isPairingOpenModal) {
      setPairingOpenModal(true);
    }
  };

  const handlePairingCloseAllModal = () => {
    setPairingOpenModal(false);
  };

  const [carRelation, setCarRelation] = useState(null);
  const fetchCarRelation = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/vehicle_relation_shows/${dataVehicle.reg_id}/${dataVehicle.car_type_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.data.length > 0) {
        setCarRelation(response.data);
      } else {
        setCarRelation(0);
      }
    } catch (error) {
      console.error("Error fetching:", error);
      setCarRelation(0)
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?")) return; // 🔴 ยืนยันก่อนลบ
    try {
      console.log(`กำลังลบข้อมูล pair_id: ${id}`); // เพิ่มข้อความเพื่อดูในคอนโซล
      await axios.delete(`${apiUrl}/api/vehicle_relation_delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      // ✅ อัปเดตรายการโดยไม่ต้องรีเฟรช
      setReload((prev) => !prev);
      console.log(`ข้อมูล pair_id: ${id} ถูกลบเรียบร้อยแล้ว`); // เพิ่มข้อความเพื่อดูในคอนโซล
  
    } catch (error) {
      console.error("❌ Error deleting driver relation:", error);
    }
  };

  useEffect(() => {
    fetchCarRelation();
  }, [dataVehicle, reload]);

  return (
    <>
      <div className="card mb-3 flex-grow-1">
        <div className="card-header d-flex justify-content-between align-items-center">
          <p className="fw-medium">ข้อมูลการจับคู่รถหัวลากและรถหางลาก</p>
          <button className="btn-animated" onClick={handlePairingOpenModal}>
            <i className="bi bi-pencil-fill"></i>
          </button>
        </div>
        <div className="card-body">
          {carRelation ? (
            <>
              {carRelation.map((rowCar, index) => (
                <div className="card" key={index}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-2 d-flex align-items-center justify-content-center">
                        <p>
                          <i className="bi bi-car-front-fill fs-3"></i>
                        </p>
                      </div>
                      <div className="col-lg-7">
                        <p>
                          ทะเบียนรถหัวลาก: <strong>{rowCar.reg_number_1}</strong>
                        </p>
                        <p>
                          ทะเบียนรถหางลาก: <strong>{rowCar.reg_number_2}</strong>
                        </p>
                      </div>
                      <div className="col-lg-3 text-end">
                        <button
                          className="btn btn-sm mx-1 action-btn delete-btn"
                          onClick={() => handleDelete(rowCar.pair_id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="">
              <p >❌ ไม่พบข้อมูลการจับคู่รถ</p>
            </div>
          )}
        </div>
      </div>
      {isPairingOpenModal && (
        <Vehicle_pairing
          isOpen={isPairingOpenModal}
          onClose={handlePairingCloseAllModal}
          dataVehicle={dataVehicle}
          onSuccess={() => setReload((prev) => !prev)}
        />
      )}
    </>
  );
};

export default CardVehiclePairing;
