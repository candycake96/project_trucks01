import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../../../config/apiConfig";
import axios from "axios";

const Card_vehicle_mainternance = ({ reg }) => {
  const [isMainternance, setMainternance] = useState([]);

  const fetchMainrternance = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/cm_pm_mainternance_select_all/${reg?.reg_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      // API ส่ง { success: true, data: [...] }
      setMainternance(response.data.data || []);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  useEffect(() => {
    if (reg?.reg_id) {
      fetchMainrternance();
    }
  }, [reg]);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light fw-bold">
        ประวัติการซ่อม / บำรุงรักษา
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="ค้นหา..."
              />
              <button className="btn btn-outline-secondary btn-sm">ค้นหา</button>
            </div>
          </div>
        </div>

        <table className="table table-striped table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>No.</th>
              <th>วันที่</th>
              <th>ประเภท (PM/CM)</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {isMainternance.length > 0 ? (
              isMainternance.map((row, ndx) => (
                <tr key={ndx}>
                  <td>{row.request_no}</td>
                  <td>{row.quotation_date}</td>
                  <td>{row.maintenance_type}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.approval_status === "อนุมัติ"
                          ? "bg-success"
                          : "bg-warning"
                      }`}
                    >
                      {row.approval_status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Card_vehicle_mainternance;
