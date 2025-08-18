import axios from "axios";
import React, { useEffect, useState } from "react";
import EmployeeShoweModal from "./modal/EmployeeShowModal";
import { apiUrl } from "../../config/apiConfig";

const EmployeesResing = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDepartment, setSearchDepartment] = useState(""); // State to store the search term for department

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  // Pagination variables
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = employees.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(employees.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getemployeesresing`, {
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

  useEffect(() => {
    fetchEmployees();
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

  const handleResignation = async (id) => {
    const payload = {
      status: "Active", // Example: Send status change data
    };
    console.log("Resignation ID received:", id);

    try {
      await axios.put(`${apiUrl}/api/putemployeeresign/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchEmployees(); // Refresh employee list
      alert("Resignation processed successfully.");
    } catch (error) {
      console.error("Error handling resignation:", error);
      alert("Failed to process resignation.");
    }
  };
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const handleOpenModal = (modalEmployee) => {
    setIsModalOpen(true);
    setSelectedEmployee(modalEmployee);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <>
      <div className="text-center p-3"> 
        <h3 className="fs-3 fw-bold">ข้อมูลพนักงาน (ลาออก)</h3>
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
              <p>Loading...</p>
            ) : filteredEmployees.length > 0 ? (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>รหัสพนักงาน</th>
                      <th>ชื่อ-นามสกุล</th>
                      <th>อีเมล์</th>
                      <th>แผนก</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.slice(indexOfFirstRow, indexOfLastRow).map((employee) => (
                      <tr key={employee.id}>
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
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn mx-1"
                            style={{ background: "#e74c3c" }}
                            onClick={() => {
                              const confirmResignation = window.confirm(
                                "คุณแน่ใจหรือไม่ว่าต้องการดำเนินการยกเลิกลาออกสำหรับพนักงานคนนี้?"
                              );
                              if (confirmResignation) {
                                handleResignation(employee.id_emp);
                              }
                            }}
                          >
                            ยกเลิก
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
              <p>No employee data available.</p>
            )}
          </div>
        </div>
      </div>

      <EmployeeShoweModal isOpen={isModalOpen} onClose={handleCloseModal} emp={selectedEmployee} />
    </>
  );
};


export default EmployeesResing;