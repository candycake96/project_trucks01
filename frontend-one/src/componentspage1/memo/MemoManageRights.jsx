import React, { useState, useEffect } from "react";
import axios from "axios";

const MemoManagerRights = () => {
  const [userrole, setUserrole] = useState([]);
  const [memoapprover, setMemoApprover] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [employee, setEmployee] = useState("");
  const [jobposition, setJobposition] = useState("");
  const [email, setEmail] = useState("");
  const [modolMemoApprover, setModolMemoApprover] = useState(null); //data to modol

  // Fetch user roles
  const fetchUserrole = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7071/api/emp_selectuserrole",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setUserrole(response.data);
    } catch (error) {
      console.error("Error fetching user roles: ", error);
    }
  };

  useEffect(() => {
    fetchUserrole();
    fetchMemoApprover(); // Fetch memo approvers on component mount
  }, []);

  // Fetch memo approvers
  const fetchMemoApprover = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7071/api/selectmemoapprever",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMemoApprover(response.data);
    } catch (error) {
      console.error("Error fetching memo approvers: ", error);
    }
  };

  // Insert memo approver
  const memoapproverInsert = async (e) => {
    e.preventDefault();

    if (!employee) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7071/api/insertmemoapprover",
        {
          emp_id: employee,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
      setEmail("");
      setEmployee("");
      setJobposition("");
      fetchMemoApprover(); // Refresh the memo approver list
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.message || "เกิดข้อผิดพลาด");
      setMessageType("error");
    }
  };

  const openModal = (details) => {
    setModolMemoApprover(details);
    const dialog = document.getElementById("my_modal_4_1");
    if (dialog) dialog.showModal();
  };

  const handleSaveEditMemoApprover = async () => {
    if (modolMemoApprover) {
      try {
        const response = await axios.put(
          `http://localhost:7071/api/memoapprover_update/${modolMemoApprover.memo_approver_id}`,
          modolMemoApprover,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setMessage(response.data.message);
        setMessageType("success");
        fetchMemoApprover(); // Refresh the department list
        setModolMemoApprover(null);

        // Close the modal
        const dialog = document.getElementById("my_modal_4_1");
        if (dialog) dialog.close(); // Close the modal after saving changes
      } catch (error) {
        console.error("Error updating department:", error);
        setMessage("Failed to update the department.");
        setMessageType("error");
      }
    }
  };

  return (
    <div className="">
      <div className="container">
        <div className="text-center mb-4 p-3">
          <p className="fs-3">จัดการผู้มีสิทธิ์อนุมัติ MEMO</p>
        </div>
        <hr />
        <div className="p-3">
          <div className="">
            {message && (
              <div
                className={`alert ${
                  messageType === "success" ? "alert-success" : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}
            <div className="">
              <form onSubmit={memoapproverInsert}>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-4 mb-3">
                      <label htmlFor="userroleSelect" className="form-label">
                        สร้างผู้อนุมัติ <span style={{ color: "red" }}> *</span>
                      </label>
                      <select
                        id="userroleSelect"
                        className="form-select"
                        value={employee}
                        onChange={(e) => setEmployee(e.target.value)}
                      >
                        <option value="">เลือกผู้อนุมัติ</option>
                        {userrole.map((role) => (
                          <option key={role.code} value={role.emp_id}>
                            คุณ {role.emp_name} {role.emp_lname} ({" "}
                            {role.emp_nickname} )
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="col-lg-4 mb-3">
                      <label htmlFor="sectionName" className="form-label">
                        ชื่อตำแหน่ง <span style={{ color: "red" }}> *</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="sectionName"
                        placeholder="ตำแหน่ง"
                        value={jobposition}
                        onChange={(e) => setJobposition(e.target.value)}
                      />
                    </div> */}
                    {/* <div className="col-lg-4 mb-3">
                      <label htmlFor="email" className="form-label">
                        Email <span style={{ color: "red" }}> *</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div> */}
                  </div>
                  <button type="submit" className="btn btn-primary">
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 mb-3">
        <hr />
      </div>
      <div className="p-3">
        <div className="col-lg">
          <div className="mb-3">
            <p className="fs-5">ผู้มีสิทธิ์อนุมัติ MEMO</p>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ชื่อ</th>
                  <th>ตำแหน่ง</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>แก้ไข</th>
                  <th>ลบ</th>
                </tr>
              </thead>
              <tbody>
                {memoapprover.map((details, index) => (
                  <tr key={details.memo_approver_id}>
                    <td>{index + 1}</td>
                    <td>
                      {details.name} {details.lname}
                    </td>
                    <td>{details.position}</td>
                    <td>{details.email}</td>
                    <td classNema="fw-bold">
                      <a href="" className="fw-bold">
                        <span
                          style={{
                            color: details.status === "active" ? "green" : "gray",
                          }}
                        >
                          {details.status}
                        </span>

                      </a>
                    </td>
                    <td className="col-lg-1">
                      <button
                        className="btn btn-warning col-12"
                        onClick={() => openModal(details)}
                      >
                        แก้ไข
                      </button>
                    </td>
                    <td className="col-lg-1">
                      <button className="btn btn-danger col-12">ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog id="my_modal_4_1" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h1 className="font-bold text-lg">แก้ไขข้อมูล</h1>
          {modolMemoApprover && (
            <>
              {/* <div className="mb-3">
                <label htmlFor="editDepartmentName" className="form-label">
                  ชื่อผู้อนุมัติ (ใช้ในแบบฟร์อม)               
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDepartmentName"
                  value={modolMemoApprover.full_name}
                  onChange={(e) =>
                    setModolMemoApprover((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editDepartmentName" className="form-label">
                  ตำแหน่งผู้อนุมัติ (ใช้ในแบบฟร์อม)               
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDepartmentName"
                  value={modolMemoApprover.jobposition}
                  onChange={(e) =>
                    setModolMemoApprover((prev) => ({
                      ...prev,
                      jobposition: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editDepartmentName" className="form-label">
                  Email               
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDepartmentName"
                  value={modolMemoApprover.email}
                  onChange={(e) =>
                    setModolMemoApprover((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div> */}
              <div className="row col">
                <div className="col">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      value="active"
                      checked={modolMemoApprover.status === "active"}
                      onChange={(e) =>
                        setModolMemoApprover((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    />
                    <ladel
                      className="foem-check-label"
                      htmlFor="flexRadioDefault1"
                    >
                      Active
                    </ladel>
                  </div>
                </div>
                <div className="col">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      value="unactive"
                      checked={modolMemoApprover.status === "unactive"}
                      onChange={(e) =>
                        setModolMemoApprover((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    />
                    <ladel
                      className="foem-check-label"
                      htmlFor="flexRadioDefault1"
                    >
                      Unactive
                    </ladel>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={handleSaveEditMemoApprover}
            >
              บันทึก
            </button>
            <button
              className="btn"
              onClick={() => document.getElementById("my_modal_4_1").close()}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MemoManagerRights;
