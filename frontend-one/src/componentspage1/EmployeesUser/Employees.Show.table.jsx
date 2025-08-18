import axios from "axios";
import React, { useEffect, useState } from "react";
import EmployeeShowModal from "./modal/EmployeeShowModal"; // ตรวจสอบชื่อคอมโพเนนต์
import Modal from "react-modal";
import { apiUrl } from "../../config/apiConfig";

const EmployeesShowtable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  // Pagination variables
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getemployees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Open the modal and set selected employee data
  const handleOpenModal = (modalEmployee) => {
    if (!isModalOpen) {
      setIsModalOpen(true);
      setSelectedEmployee(modalEmployee);
    }
  };

  // Close the modal and reset the selected employee
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  useEffect(() => {
    fetchEmployees();
    Modal.setAppElement('#root'); // หรือใช้ ID ของ root element ของแอปคุณ
  }, []);

  // Filter employees based on search terms
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.fname} ${employee.lname}`.toLowerCase();
    const departmentName = employee.name_department.toLowerCase();

    return (
      fullName.includes(searchTerm.toLowerCase()) &&
      departmentName.includes(searchDepartment.toLowerCase())
    );
  });

  // Pagination for filtered data
  const currentRows = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Handle Resignation
  const handleResignation = async (id) => {
    const payload = {
      status: "Inactive", // ตัวอย่าง: ส่งข้อมูลการเปลี่ยนแปลงสถานะ
    };
    console.log("Resignation ID received:", id);

    try {
      await axios.put(`${apiUrl}/api/putemployeeresign/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchEmployees(); // รีเฟรชรายการพนักงาน
      alert("Resignation processed successfully.");
    } catch (error) {
      console.error("Error handling resignation:", error);
      alert("Failed to process resignation.");
    }
  };

  // Handle Delete (แยกฟังก์ชันสำหรับลบ)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานคนนี้?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiUrl}/api/deleteemployee/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchEmployees(); // รีเฟรชรายการพนักงาน
      alert("Employee deleted successfully.");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee.");
    }
  };

  return (
    <>
      <div className="text-center p-3">
        <h3 className="fs-3 fw-bold">ข้อมูลพนักงาน</h3>
      </div>
      <div className="p-3 container">
        <div className="card">
          <div className="card-body">
            <div className="d-flex mb-3">
              {/* Search by employee name */}
              <input
                type="text"
                className="form-control me-2"
                placeholder="ค้นหาชื่อ"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Search by department */}
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาแผนก"
                value={searchDepartment}
                onChange={(e) => setSearchDepartment(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredEmployees.length > 0 ? (
              <>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>รหัสพนักงาน</th>
                      <th>ชื่อ-นามสกุล</th>
                      <th>อีเมล์</th>
                      <th>แผนก</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((employee) => (
                      <tr key={employee.id_emp}>
                        <td>{employee.code}</td>
                        <td>
                          {employee.fname} {employee.lname}
                        </td>
                        <td>
                          {employee.email}
                        </td>
                        <td>{employee.name_department}</td>
                        <td>
                          <button
                            className="btn btn-warning mx-1"
                            onClick={() => handleOpenModal(employee)}
                          >
                            <i className="bi bi-pencil-square"></i> แก้ไข
                          </button>
                          {/* <button
                            className="btn mx-1"
                            style={{ background: "#b03a2e", color: "#fff" }}
                            onClick={() => handleDelete(employee.id_emp)}
                          >
                            <i className="bi bi-trash"></i> ลบ
                          </button> */}
                          <button
                            className="btn btn-danger mx-1"
                            onClick={() => {
                              const confirmResignation = window.confirm(
                                "คุณแน่ใจหรือไม่ว่าต้องการดำเนินการลาออกสำหรับพนักงานคนนี้?"
                              );
                              if (confirmResignation) {
                                handleResignation(employee.id_emp);
                              }
                            }}
                          >
                            ลาออก
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="d-flex justify-content-center mt-3">
                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      className={`btn mx-1 ${
                        currentPage === number ? "btn-primary" : "btn-secondary"
                      }`}
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center">ไม่มีข้อมูลพนักงานที่ตรงกับการค้นหา</p>
            )}
          </div>
        </div>
      </div>

      {/* Render Modal only when it's open */}
      {isModalOpen && (
        <EmployeeShowModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          emp={selectedEmployee}
        />
      )}
    </>
  );
};

export default EmployeesShowtable;
