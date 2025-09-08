import React, { useEffect, useState } from "react";
import MainternanceAnanlysis_Add from "./MainternanceAnalysis_Add";
import MainternanceAnalysis_showEdit from "./MainternanceAnalysis_showsEdit";
import axios from "axios";
import Status_Mainternance from "./Status_Mainternance/Status_Mainternance";
import { apiUrl } from "../../../config/apiConfig";

const MainternanceAnanlysis_ShowDetails = ({ maintenanceJob }) => {
  const [dataAnanlysis, setDataAnanlysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const fetchAnanlysisDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/ananlysis_show_details/${maintenanceJob?.request_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setDataAnanlysis(response.data);

      const isValid = Array.isArray(response.data)
        ? response.data.length > 0
        : Boolean(
            response.data?.analysis_id || response.data?.quotations?.length
          );

      setHasAnalysis(isValid);
    } catch (error) {
      console.error("Error fetching Analysis data:", error);
      setDataAnanlysis(null);
      setHasAnalysis(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (maintenanceJob?.request_id) {
      fetchAnanlysisDetails();
    }
  }, [maintenanceJob, hasAnalysis]); // 🔥 ตัด hasAnalysis ออก

  if (loading) return <div>Loading...</div>;

  const permissions = user?.permission_codes || [];
  const hasPermission = (code) => permissions.includes(code);

  // console.log("permissions from API:", permissions);


  // -------- Logic แสดงผล --------
 // 1️⃣ ถ้ามีสิทธิ์ ADD_CAR_CHECK → แสดง Add/Edit เสมอ
if (hasPermission("ADD_CAR_CHECK")) {
  return hasAnalysis ? (
    <MainternanceAnalysis_showEdit
      maintenanceJob={maintenanceJob}
      data={dataAnanlysis}
      hasPermission={hasPermission}
    />
  ) : (
    <MainternanceAnanlysis_Add
      maintenanceJob={maintenanceJob}
      onSaved={(newData) => {
        setDataAnanlysis(newData);
        setHasAnalysis(true);
      }}
    />
  );
}

// 2️⃣ ถ้าไม่มีสิทธิ์ → แสดง Status สำหรับบาง status
if (
  (maintenanceJob?.status === "แจ้งซ่อม" || maintenanceJob?.status === "จัดรถ") &&
  !hasPermission("ADD_CAR_CHECK")
) {
  return <Status_Mainternance requestID={maintenanceJob} />;
}

// 3️⃣ ถ้ามีข้อมูล analysis → แสดง Edit
if (hasAnalysis) {
  return (
    <MainternanceAnalysis_showEdit
      maintenanceJob={maintenanceJob}
      data={dataAnanlysis}
      hasPermission={hasPermission}
    />
  );
}

// 4️⃣ fallback → Status
return <Status_Mainternance requestID={maintenanceJob} />;

};

export default MainternanceAnanlysis_ShowDetails;
