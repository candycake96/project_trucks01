import React, { useEffect, useState } from "react";
import MainternanceAnalysisApprover from "./MainternanceAnalysisApprover";
import MainternanceAnalysisApproverShowEdit from "./MainternanceAnalysisApproverShowEdit";
import Status_Mainternance from "./Status_Mainternance/Status_Mainternance";

import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";

const MainternanceAnalysisApproverMain = ({ maintenanceJob }) => {
  const [isApproverShowData, setApprovershowData] = useState({ approvers: [] });
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // โหลด user จาก localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // ตรวจ permission
  const hasPermission = (code) =>
    Array.isArray(user?.permission_codes) && user.permission_codes.includes(code);

  // โหลดข้อมูล approver
  const fetchApproverShowData = async () => {
    if (!maintenanceJob?.request_id) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/ananlysis_approver_show_data/${maintenanceJob?.request_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setApprovershowData(response.data);
      setHasAnalysis(response.data?.approvers?.length > 0);
    } catch (error) {
      console.error("Error fetching approver data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (maintenanceJob?.request_id) {
      fetchApproverShowData();
    }
  }, [maintenanceJob]); // ✅ เอา hasAnalysis ออกเพื่อไม่ loop

  // รอโหลด user และข้อมูล API
  if (loading || !user) return <div>Loading...</div>;

  const status = maintenanceJob?.status;

  // -------- Logic --------
  switch (status) {
    case "แจ้งซ่อม":
    case "จัดรถ":  
      return <Status_Mainternance requestID={maintenanceJob} />;

    case "ตรวจเช็ครถ":
      if (hasPermission("MA-COST-VEHICCLE")) {
        return hasAnalysis ? (
          <MainternanceAnalysisApproverShowEdit
            maintenanceJob={maintenanceJob}
            isApproverShowData={isApproverShowData}
            hasPermission={hasPermission}
          />
        ) : (
          <MainternanceAnalysisApprover
            maintenanceJob={maintenanceJob}
            onSaved={(newData) => {
              setHasAnalysis(true);
              setApprovershowData({ approvers: newData });
            }}
          />
        );
      } else {
        return <Status_Mainternance requestID={maintenanceJob} />;
      }

    case "อนุมัติผลตรวจ":
      return (
        <MainternanceAnalysisApproverShowEdit
          maintenanceJob={maintenanceJob}
          isApproverShowData={isApproverShowData}
          hasPermission={hasPermission}
        />
      );

    default:
      // 🚩 สถานะอื่น ๆ → แสดง ShowEdit ถ้ามีข้อมูล
      return (
        <MainternanceAnalysisApproverShowEdit
          maintenanceJob={maintenanceJob}
          isApproverShowData={isApproverShowData}
          hasPermission={hasPermission}
        />
      );
  }
};

export default MainternanceAnalysisApproverMain;
