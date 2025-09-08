import React, { useEffect, useState } from "react";
import axios from "axios"; // อย่าลืม import axios
import { apiUrl } from "../../../../config/apiConfig";


const Status_Mainternance = ({ requestID }) => {
    const [statusData, setStatusData] = useState(null);

    const fetchStatusMainternence = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/repair_requests_detail_id/${requestID?.request_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // ใช้แค่แถวแรก
            setStatusData(response.data[0] || null);
        } catch (error) {
            console.error("Error fetching Analysis data:", error);
            setStatusData(null);
        }
    };

    useEffect(() => {
        if (requestID) {
            fetchStatusMainternence();
        }
    }, [requestID]);

    const steps = ["แจ้งซ่อม", "จัดรถ", "ตรวจเช็ครถ", "อนุมัติตรวจเช็ครถ", "ผู้จัดการอนุมัติ"];
    const statusIndexMap = {
        "แจ้งซ่อม": 1,
        "จัดรถ": 2,
        "ตรวจเช็ครถ": 3,
        "อนุมัติตรวจเช็ครถ": 4,
        "ผู้จัดการอนุมัติ": 5
    };

    const currentStep = statusData ? statusIndexMap[statusData.status] : 1;


    return (
      <div
  className="d-flex justify-content-center align-items-center bg-light py-5"
  style={{ minHeight: "60vh" }}
>
  <div
    className="p-5 bg-white shadow-lg rounded-4 w-100"
    style={{ maxWidth: "720px" }}
  >
    <h5 className="text-center fw-bold mb-5" style={{ fontSize: "1.8rem", letterSpacing: "1px" }}>
      สถานะการแจ้งซ่อม
    </h5>

    <div className="d-flex justify-content-between flex-wrap position-relative">
      {steps.map((step, index) => (
        <div key={index} className="text-center flex-fill position-relative mb-4">
          {/* Circle */}
          <div
            className={`rounded-circle mb-2 d-flex justify-content-center align-items-center ${
              index < currentStep
                ? "bg-success"
                : index === currentStep
                ? "bg-warning"
                : "bg-secondary"
            }`}
            style={{
              width: "50px",
              height: "50px",
              color: "white",
              fontWeight: "600",
              fontSize: "1.1rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              transition: "all 0.3s",
              margin: "0 auto",
            }}
          >
            {index + 1}
          </div>

          {/* Label */}
          <small
            className={`d-block mt-1 ${
              index <= currentStep ? "text-dark fw-semibold" : "text-muted"
            }`}
            style={{ fontSize: "0.9rem", minHeight: "1.5rem" }}
          >
            {step}
          </small>

          {/* Line connecting steps */}
          {index < steps.length - 1 && (
            <div
              className="position-absolute top-50 start-100 translate-middle"
              style={{
                width: "100%",
                height: "4px",
                background: index < currentStep ? "linear-gradient(to right, #198754, #0dcaf0)" : "#ccc",
                borderRadius: "2px",
                zIndex: -1,
                transition: "background 0.3s",
              }}
            ></div>
          )}
        </div>
      ))}
    </div>

    <div className="d-flex mt-4">
      <p className="text-sm text-secondary ms-auto" style={{ fontStyle: "italic", fontSize: "0.85rem" }}>
        {statusData?.updated_at
          ? `อัปเดทล่าสุด ${new Date(statusData.updated_at).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}`
          : "ยังไม่มีข้อมูลอัปเดท"}
      </p>
    </div>
  </div>
</div>

    );
};

export default Status_Mainternance;
