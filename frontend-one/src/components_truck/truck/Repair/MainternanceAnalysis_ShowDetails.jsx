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
const isValid = Boolean(
  response.data?.analysis?.analysis_id || response.data?.quotations?.length
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
  }, [maintenanceJob]); // ✅ ไม่ต้องใช้ hasAnalysis

  if (loading) return <div>Loading...</div>;

  const permissions = user?.permission_codes || [];
  const hasPermission = (code) => permissions.includes(code);

  // -------- Logic --------
  switch (maintenanceJob?.status) {
    case "แจ้งซ่อม":
      return <Status_Mainternance requestID={maintenanceJob} />;

    case "จัดรถ":
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
      } else {
        return <Status_Mainternance requestID={maintenanceJob} />;
      }

    case "ตรวจเช็ครถ":
       return (
        <MainternanceAnalysis_showEdit
          maintenanceJob={maintenanceJob}
          data={dataAnanlysis}
          hasPermission={hasPermission}
        />
      );

    default:
      // 🚩 สถานะอื่น ๆ ทั้งหมด → แสดงข้อมูล analysis (ถ้ามี)
      return (
        <MainternanceAnalysis_showEdit
          maintenanceJob={maintenanceJob}
          data={dataAnanlysis}
          hasPermission={hasPermission}
        />
      );
  }
};

export default MainternanceAnanlysis_ShowDetails;
