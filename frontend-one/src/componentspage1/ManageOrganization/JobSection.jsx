import axios from "axios";
import React, { useEffect, useState } from "react";

const JobSection = () => {
  const [jobsection, setJobsection] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [modalJob, setModalJob] = useState("");
  const [code, setCode] = useState("");


  // Fetch job sections
  const fetchJobSection = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7071/api/selectjobsection",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setJobsection(response.data);
    } catch (error) {
      console.error("Error fetching job sections:", error);
    }
  };

  // Fetch departments for the dropdown
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7071/api/selectdepartment",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchJobSection();
    fetchDepartments();
  }, []);

  // Handle job section submission
  const handleJobSection = async (e) => {
    e.preventDefault();

    if (!sectionName || !departmentId || !code) {
      setMessage("Both section name and department are required.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7071/api/insertjobsection",
        { section_name: sectionName, department_id: departmentId, job_section_code: code},

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
      setSectionName("");
      setDepartmentId("");
      setCode("")
      fetchJobSection(); // Refresh the job section list after adding
    } catch (error) {
      console.error("Error inserting job section:", error);
      setMessage("Failed to add job section.");
      setMessageType("error");
    }
  };

  const openModal = (section) => {
    setModalJob(section);
    const dialog = document.getElementById("my_modal_4_1");
    if (dialog) dialog.showModal();
  };

  const handleUpdateJobSection = async () => {
    try {
      const response = await axios.put(
        `http://localhost:7071/api/updatejobsection/${modalJob.section_id}`,
        { section_name: modalJob.section_name, department_id: departmentId, job_section_code: modalJob.job_section_code},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
      fetchJobSection(); // รีเฟรชรายการ job section หลังจากแก้ไข
      document.getElementById("my_modal_4_1").close(); // ปิด Modal
    } catch (error) {
      console.error("Error updating job section:", error);
      setMessage("Failed to update job section.");
      setMessageType("error");
    }
  };
  
  const deletedepartment = async (section_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:7071/api/deletejobsection/${section_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
      fetchJobSection(); // รีเฟรชรายการหลังจากลบ
    } catch (error) {
      console.error("Error deleting job section:", error);
      setMessage("Failed to delete job section.");
      setMessageType("error");
    }
  };
  

  return (
    <>
      <div>
        <div className="text-center">
          <p className="fs-3 fw-bolder">แผนก</p>
        </div>
        <div className="p-3">
          {message && (
            <div
              className={`alert ${
                messageType === "success" ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleJobSection}>
           <div className="row">
            <div className="col-4">
            <div className="mb-3">
              <label htmlFor="sectionName" className="form-label">
                ชื่อย่อแผนก (code job)
              </label>
              <input
                type="text"
                className="form-control"
                id="code"
                placeholder="ตัวอย่าง IT"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            </div>
            <div className="col-8">
            <div className="mb-3">
              <label htmlFor="sectionName" className="form-label">
                ชื่อแผนก
              </label>
              <input
                type="text"
                className="form-control"
                id="sectionName"
                placeholder=""
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
              />
            </div>
            </div>
           </div>
            <div className="mb-3">
              <label htmlFor="departmentSelect" className="form-label">
                กรุณาเลือกฝ่ายงาน
              </label>
              <select
                id="departmentSelect"
                className="form-select"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">Open this select menu</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-success">
                บันทึก
              </button>
            </div>
          </form>
        </div>
        <div className="p-3">
          <div className="card">
            <div className="card-body">
              <div>
                <table className="table table-striped table-responsive">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>code</th>
                      <th>แผนก</th>
                      <th>ฝ่ายงาน</th>
                      <th>#</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobsection.map((section, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="">{section.job_section_code}</td>
                        <td>{section.section_name}</td>
                        <td>{section.department_name}</td>
                        <td className="col-1">
                          <button
                            className="btn btn-warning col-12"
                            onClick={() => openModal(section)}
                          >
                            แก้ไข
                          </button>
                        </td>
                        <td className="col-1">
                          <button className="btn btn-error col-12"  onClick={() => deletedepartment(section.section_id)}>ลบ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
{/* Modal */}
<dialog id="my_modal_4_1" className="modal">
  <div className="modal-box w-11/12 max-w-5xl">
    <h1 className="font-bold text-lg">แก้ไขข้อมูล</h1>
    {modalJob && (
      <>
              <div className="mb-3">
          <label htmlFor="editSectionName" className="form-label">
            ชื่อแผนก
          </label>
          <input
            type="text"
            className="form-control"
            id="editSectionName"
            value={modalJob.job_section_code}
            onChange={(e) =>
              setModalJob((prev) => ({
                ...prev,
                job_section_code: e.target.value, // แก้ไขชื่อแผนก
              }))
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="editSectionName" className="form-label">
            ชื่อแผนก
          </label>
          <input
            type="text"
            className="form-control"
            id="editSectionName"
            value={modalJob.section_name}
            onChange={(e) =>
              setModalJob((prev) => ({
                ...prev,
                section_name: e.target.value, // แก้ไขชื่อแผนก
              }))
            }
          />
        </div>
        <div className="mb-3">
  <label htmlFor="editDepartment" className="form-label">
    กรุณาเลือกฝ่ายงาน
  </label>
  <select
    id="editDepartment"
    className="form-select"
    value={departmentId || modalJob.department_id || ''} // Ensure value is not empty string
    onChange={(e) => {
      const selectedValue = e.target.value;
      setDepartmentId(selectedValue !== '' ? selectedValue : null); // Update only if valid
    }}
  >
    <option value="">-- กรุณาเลือก --</option> {/* Add a default option */}
    {departments.map((dept) => (
      <option key={dept.department_id} value={dept.department_id}>
        {dept.department_name}
      </option>
    ))}
  </select>
</div>

      </>
    )}
    <div className="modal-action">
      <button className="btn btn-primary" onClick={handleUpdateJobSection}>
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

    </>
  );
};

export default JobSection;
