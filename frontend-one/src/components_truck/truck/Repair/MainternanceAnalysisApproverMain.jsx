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
  }, [maintenanceJob, hasAnalysis]);

  // รอโหลด user และข้อมูล API
  if (loading || !user) return <div>Loading...</div>;

  const status = maintenanceJob?.status;

  // ✅ ผู้มีสิทธิ์ MA-COST-VEHICCLE → ต้องเห็นเสมอ (Add ถ้ายังไม่มีข้อมูล, Edit ถ้ามีแล้ว)
  if (hasPermission("MA-COST-VEHICCLE") ) {
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
  }


  
  // ถ้ามีข้อมูลแล้ว → ให้ดู ShowEdit ได้
  if (hasAnalysis) {
    return (
      <MainternanceAnalysisApproverShowEdit
        maintenanceJob={maintenanceJob}
        isApproverShowData={isApproverShowData}
        hasPermission={hasPermission}
      />
    );
  }

  // ✅ ไม่มีสิทธิ์ → ทำตามสถานะ
  if (status === "แจ้งซ่อม" || status === "จัดรถ" || status === "ตรวจเช็ครถ" && !hasPermission("MA-COST-VEHICCLE") ) {
    return <Status_Mainternance requestID={maintenanceJob} />;
  }

  if (status === "ตรวจเช็ครถ") {
    // ไม่มีสิทธิ์และยังอยู่ตรวจเช็ครถ → ดูได้แค่ Status
    return <Status_Mainternance requestID={maintenanceJob} />;
  }


  // ถ้าไม่มีสิทธิ์และไม่มีข้อมูลเลย → Status
  return <Status_Mainternance requestID={maintenanceJob} />;
};

export default MainternanceAnalysisApproverMain;
