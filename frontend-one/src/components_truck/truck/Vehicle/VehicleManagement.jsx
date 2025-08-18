import React, { useEffect } from "react";
import VehicleTable from "./VehicleTable";
import { useNavigate } from "react-router-dom";


const VehicleManagement = () => {
  const navigate = useNavigate();

  // ตรวจสอบการเข้าสู่ระบบ
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      // ถ้าไม่มี token ให้รีไดเรกต์ไปหน้า Login
      navigate("/logintruck");
    }
  }, [navigate]);

  return (
    <div className="container">
      <div className="p-3">
        <div className="text-center">
          <p className="fs-4 fw-bolder">ระบบจัดการข้อมูลรถ</p>
        </div>
        <hr />
      </div>

      <div className="">
        <VehicleTable />
      </div>
    </div>
  );
};

export default VehicleManagement;
