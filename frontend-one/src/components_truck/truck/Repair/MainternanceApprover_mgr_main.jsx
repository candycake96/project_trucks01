import React, { useEffect, useState } from "react";
import Status_Mainternance from "./Status_Mainternance/Status_Mainternance";
import MainternanceApprover_mgr_add from "./MainternanceApprover_mgr_add";

import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";

const MainternanceApprover_mgr_main = ({ maintenanceJob }) => {
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [dataAnanlysis, setDataAnanlysis] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const fetchDataRequestAll = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await axios.get(
        `${apiUrl}/api/approval_shows_id/${maintenanceJob?.request_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const isValid = Array.isArray(response.data)
        ? response.data.length > 0
        : Boolean(
            response.data?.approver_id ||
              (Array.isArray(response.data?.quotations) &&
                response.data.quotations.length > 0)
          );

      setHasAnalysis(isValid);
    } catch (error) {
      console.error("Error fetching detailscartype:", error);
    }
  };

  useEffect(() => {
    fetchDataRequestAll();
  }, [maintenanceJob]);

  // ✅ ตรวจ permission
  const hasPermission = (code) =>
    Array.isArray(user?.permission_codes) &&
    user.permission_codes.includes(code);

  // ✅ Helper: Render Approver / Status
  const renderApproverOrStatus = () =>
    hasPermission("MANAGER_APPROVE_REPAIR") ? (
      <MainternanceApprover_mgr_add
        maintenanceJob={maintenanceJob}
        data={dataAnanlysis}
        hasPermission={hasPermission}
        onSaved={(newData) => {
          setDataAnanlysis(newData);
          setHasAnalysis(true);
        }}
      />
    ) : (
      <Status_Mainternance requestID={maintenanceJob} />
    );

  // ✅ ใช้ switch จัดการตาม status
  switch (maintenanceJob?.status) {
    // --- กลุ่มแรก ---
    case "แจ้งซ่อม":
    case "จัดรถ":
    case "ตรวจเช็ครถ":
      return <Status_Mainternance requestID={maintenanceJob} />;

    // --- ระหว่างรออนุมัติ ---
    case "อนุมัติตรวจเช็ครถ":
      return renderApproverOrStatus();

    // --- หลังอนุมัติแล้ว ---
    case "ผู้จัดการอนุมัติ":
    case "ซ่อมสำเร็จ":
    case "ยกเลิกงาน":
      return (
      <MainternanceApprover_mgr_add
        maintenanceJob={maintenanceJob}
        data={dataAnanlysis}
        hasPermission={hasPermission}
        onSaved={(newData) => {
          setDataAnanlysis(newData);
          setHasAnalysis(true);
        }}
      />
    ) ;
    
    // --- fallback ---
    default:
      return (
      <MainternanceApprover_mgr_add
        maintenanceJob={maintenanceJob}
        data={dataAnanlysis}
        hasPermission={hasPermission}
        onSaved={(newData) => {
          setDataAnanlysis(newData);
          setHasAnalysis(true);
        }}
      />
    ) ;
  }
};

export default MainternanceApprover_mgr_main;
