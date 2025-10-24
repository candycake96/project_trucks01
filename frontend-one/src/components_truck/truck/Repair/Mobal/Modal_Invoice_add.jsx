import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../../../config/apiConfig";

const Modal_Invoice_add = ({ isOpen, onClose }) => {
  const [jobRepairMainternance, setJobRepairMainternance] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobRepairMainternance = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/un_invoice_maintenance`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setJobRepairMainternance(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => { fetchJobRepairMainternance(); }, []);

  const filteredData = jobRepairMainternance.filter(item =>
    item.request_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reg_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="เพิ่มใบแจ้งหนี้"
      style={{
        content: {
          width: "90%",
          maxWidth: "700px",
          margin: "auto",
          borderRadius: "0.75rem",
          padding: 0,
          inset: "auto",
          maxHeight: "80vh",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 relative rounded-t-lg">
        <h2 className="text-lg font-semibold">เพิ่มใบแจ้งหนี้</h2>
        <p className="text-blue-200 text-sm mt-1">เลือกรายการแจ้งซ่อมเพื่อสร้างใบแจ้งหนี้</p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-200 text-sm"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[65vh] overflow-y-auto">
        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="ค้นหาเลขเอกสาร, ทะเบียนรถ..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden text-sm">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">เลขเอกสารแจ้งซ่อม</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">วันที่แจ้งซ่อม</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">ทะเบียนรถ</th>
                {/* <th className="px-4 py-2 text-left font-medium text-gray-700">สถานะ</th> */}
                <th className="px-4 py-2 text-center font-medium text-gray-700">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-all cursor-pointer">
                    <td className="px-4 py-2">{item.request_no}</td>
                    <td className="px-4 py-2">{item.request_date}</td>
                    <td className="px-4 py-2">{item.reg_number}</td>
                    {/* <td className="px-4 py-2"><p className="text-warning">ข้อมูลไม่ตรง</p></td> */}
                    <td className="px-4 py-2 text-center">
                      <Link
                        to={`/truck/MainternanceInvoice_detail`}
                        state={{ requestId: item.request_id }}
                        className="inline-flex items-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        <i className="fas fa-plus mr-1"></i> เลือก
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 py-4 text-sm">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 p-1 rounded-full">
              <i className="fas fa-info text-white text-xs"></i>
            </div>
            <div>
              <span className="font-medium text-blue-900">รายการทั้งหมด</span>
              <span className="text-blue-700">พบรายการแจ้งซ่อมที่ยังไม่ได้ออกใบแจ้งหนี้</span>
            </div>
          </div>
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full font-bold text-sm">
            {filteredData.length} รายการ
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default Modal_Invoice_add;
