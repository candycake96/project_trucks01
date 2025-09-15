import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../../config/apiConfig";
import Modal_Insurance_Edit from "../modal/Modal_Insurance_Edit";
import Modal_nisurance_add from "../modal/Modal_nisurance_add";

const Insurance_table_truck_id = ({ dataTruck }) => {
  const [isInsuranceData, setInsuraceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal
  const [isOpenModalInsuranceEdit, setOpenModalInsuranceEdit] = useState(false);
  const [isDataModalInsuranceEdit, setDataModalInsuranceEdit] = useState(null);
  const [isOpenModalInsuranceAdd, setOpenModalInsuranceAdd] = useState(false);
  const [isDataModalInsuranceAdd, setDataModalInsuranceAdd] = useState(null);

  const fetchInsuranceData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/car_insurance_details/${dataTruck?.reg_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setInsuraceData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  useEffect(() => {
    fetchInsuranceData();
  }, [dataTruck]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
  };

  // Modal handlers
  const handleOpenModalInsuranceEdit = (data) => {
    setOpenModalInsuranceEdit(true);
    setDataModalInsuranceEdit(data);
  };
  const handleCloseModalInsuranceEdit = () => {
    setOpenModalInsuranceEdit(false);
    setDataModalInsuranceEdit(null);
  };
  const handleOpenModalInsuranceAdd = (data) => {
    setOpenModalInsuranceAdd(true);
    setDataModalInsuranceAdd(data);
  };
  const handleCloseModalInsuranceAdd = () => {
    setOpenModalInsuranceAdd(false);
    setDataModalInsuranceAdd(null);
  };

  // Delete
  const handleDeleteinsurance = async (id) => {
    if (!window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) return;
    try {
      await axios.delete(`${apiUrl}/api/car_insurance_delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      fetchInsuranceData();
      alert("ลบข้อมูลสำเร็จ!");
    } catch (error) {
      console.error("Error deleting insurance:", error);
      alert("ลบข้อมูลไม่สำเร็จ");
    }
  };

  // Sort
  const sortedData = [...isInsuranceData].sort((a, b) => {
    const dateA = new Date(a.insurance_end_date);
    const dateB = new Date(b.insurance_end_date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
  const handleSortByDate = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>วันที่เริ่มต้น</th>
            <th>
              วันที่สิ้นสุด
              <button onClick={handleSortByDate} className="btn-sm btn-outline-secondary ms-1">
                {sortOrder === "asc" ? <i className="bi bi-sort-down"></i> : <i className="bi bi-sort-up"></i>}
              </button>
            </th>
            <th>ทุนประกัน</th>
            <th>เบี้ยประกัน</th>
            <th>ชั้นประกัน</th>
            <th>คุ้มครอง</th>
            <th>สถานะ</th>
            <th className="text-center">เอกสาร</th>
            <th className="text-center">
              <button className="btn btn-primary btn-sm" onClick={() => handleOpenModalInsuranceAdd(dataTruck)}>
                เพิ่มข้อมูล
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? currentRows.map((row, idx) => (
            <tr key={row.insurance_id}>
              <td>{indexOfFirstRow + idx + 1}</td>
              <td>{formatDate(row.insurance_start_date)}</td>
              <td>{formatDate(row.insurance_end_date)}</td>
              <td>{row.insurance_converage_amount?.toLocaleString("th-TH", { style: "currency", currency: "THB" }) || "-"}</td>
              <td>{row.insurance_premium?.toLocaleString("th-TH", { style: "currency", currency: "THB" }) || "-"}</td>
              <td>{row.insurance_class}</td>
              <td>{row.coverage_type}</td>
              <td>
                {(() => {
                  const today = new Date();
                  const expire = new Date(row.insurance_end_date);
                  const diffDays = (expire - today) / (1000 * 60 * 60 * 24);
                  if (expire < today) return <span className="badge bg-danger">หมดอายุแล้ว</span>;
                  if (diffDays <= 90) return <span className="badge bg-warning text-dark">ใกล้หมดอายุ</span>;
                  return <span className="badge bg-success">ยังไม่หมดอายุ</span>;
                })()}
              </td>
              <td className="text-center">
                {row.insurance_file ? <a href={row.insurance_file}><i className="bi bi-file-pdf-fill"></i> ไฟล์</a> : <p>NO!</p>}
              </td>
              <td className="text-center">
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleOpenModalInsuranceEdit(row)}>
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteinsurance(row.insurance_id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="10" className="text-center text-muted">ไม่มีข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <button disabled={currentPage === 1} className="btn btn-sm me-1" onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={`btn btn-sm me-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} className="btn btn-sm" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      )}

      {isOpenModalInsuranceEdit && <Modal_Insurance_Edit isOpen={isOpenModalInsuranceEdit} onClose={handleCloseModalInsuranceEdit} onData={isDataModalInsuranceEdit} onSuccess={fetchInsuranceData} />}
      {isOpenModalInsuranceAdd && <Modal_nisurance_add isOpen={isOpenModalInsuranceAdd} onClose={handleCloseModalInsuranceAdd} dataCar={isDataModalInsuranceAdd} onSuccess={fetchInsuranceData} />}
    </>
  );
};

export default Insurance_table_truck_id;
