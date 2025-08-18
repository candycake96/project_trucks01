import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";

const Modal_Branch_Add = ({ isOpen, onClose, fetchBranches, user }) => {
  const [branchName, setBranchName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [isCompany, setCompany] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const branchInsert = async (e) => {
    e.preventDefault();

    if (!branchName || !branchAddress) {
      setMessage("Branch name and address are required.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/branches_add_data`,
        {
          branch_name: branchName,
          branch_address: branchAddress,
          company_id: isCompany, // ✅ แก้จาก `Company_id` เป็น `company_id`
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setMessage(response.data.message);
      setMessageType("success");

      // รีเซ็ตค่า input
      setBranchName("");
      setBranchAddress("");

      // เรียกฟังก์ชันเพื่ออัปเดตรายการ
      if (fetchBranches) {
        fetchBranches();
      }

      // ปิดโมดัลหลังจากเพิ่มข้อมูลสำเร็จ
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.message || "Something went wrong");
      setMessageType("error");
    }
  };

  useEffect(() => {
    if (user) {
      setCompany(user.company_id); // ✅ แก้ไขการอัปเดตค่าให้ถูกต้อง
    }
  }, [user]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="เพิ่มสาขาใหม่"
      style={{
        content: {
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          margin: "auto",
          padding: "20px",
          border: "none",
          borderRadius: "0.5rem",
          overflowY: "auto",
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
      <h4 className="text-center mb-3">เพิ่มข้อมูลองค์กร</h4>

      {message && (
        <div className={`alert alert-${messageType === "error" ? "danger" : "success"}`}>
          {message}
        </div>
      )}

      <form onSubmit={branchInsert}>
        <div className="mb-3">
          <label htmlFor="branchName" className="form-label">
            ชื่อสาขา
          </label>
          <input
            type="text"
            className="form-control"
            id="branchName"
            placeholder="ตัวอย่าง สำนักงานใหญ่ กทม."
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="branchAddress" className="form-label">
            ที่อยู่
          </label>
          <input
            type="text"
            className="form-control"
            id="branchAddress"
            placeholder="ถนน เขต จังหวัด.."
            value={branchAddress}
            onChange={(e) => setBranchAddress(e.target.value)}
            required
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-success">
            เพิ่มข้อมูล
          </button>
          <button type="button" className="btn btn-danger ms-2" onClick={onClose}>
            ยกเลิก
          </button>
        </div>
      </form>
    </ReactModal>
  );
};

export default Modal_Branch_Add;
