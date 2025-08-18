import axios from "axios";
import React, { useEffect, useState } from "react";
import EmployeeShoweModal from "../../componentspage1/EmployeesUser/modal/EmployeeShowModal";
import { apiUrl } from "../../config/apiConfig";

const DriverShow = () => {

    const [driverData, setDriverData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBranch, setSearchBranch] = useState("");
    const [showBranch, setShowBranch] = useState([]);
    
    const [user, setUser] = useState(null);
    useEffect(() => {
      // ดึงข้อมูลผู้ใช้จาก localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData)); // แปลง JSON เป็น Object แล้วเก็บใน state
      }
    }, []);
    const userCompanyID =  user?.company_id || null;
  

    const fetchDriverData = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getdriver`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // console.log("Fetched positions:", response.data); // Check fetched data
            setDriverData(response.data);
        } catch (error) {
            console.error("Error fetching job positions:", error);
        }
    };

    const fetchShowBranch = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/getbranches/${userCompanyID}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // console.log("Fetched positions:", response.data); // Check fetched data
            setShowBranch(response.data);
        } catch (error) {
            console.error("Error fetching job positions:", error);
        }
    }; 

    useEffect(() => {
        fetchDriverData();
        fetchShowBranch();
    }, [userCompanyID]);
 


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

    //   ค้นหา
    const filteredDriverData = driverData.filter((dataRow) => {
        const fullName = `${dataRow.lname} ${dataRow.fname}`.toLowerCase();
        const branchName = dataRow.branch_name.toLowerCase();

        return (
            fullName.includes(searchTerm.toLowerCase()) &&
            branchName.includes(searchBranch.toLowerCase())
        );
    });

    return (
        <>
            <div className="">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex mb-3">
                            {/* Search by Driver's Name */}
                            <input
                                type="text"
                                className="form-control me-2"
                                placeholder="ค้นหาชื่อ"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* Search by Branch */}
                            <select
                                name=""
                                id=""
                                className="form-select"
                                aria-label="Default select example"
                                value={searchBranch}
                                onChange={(e) => setSearchBranch(e.target.value)}
                            >
                                <option value="">ค้นหา (สาขาทั้งหมด) </option>
                                {showBranch.map((row, index) => (
                                <option value={row.branch_name} key={index}>{row.branch_name}</option> 
                                     ))}                          
                            </select>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    {/* <th>ทะเบียนรถ</th> */}
                                    <th>รหัสวพนักงาน</th>
                                    <th>ชื่อ</th>
                                    {/* <th>ชื่อเล่น</th> */}
                                    <th>สาขา</th>
                                    <th>ประเภทใบขับขี่</th>
                                    <th>สถานะทำงาน</th>
                                    <th className="text-center"><i class="bi bi-pencil-square"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDriverData.map((dataRow, index) => (
                                    <tr key={index}>
                                        {/* <td></td> */}
                                        <td>{dataRow.code}</td>
                                        <td>{dataRow.fname} {dataRow.lname}</td>
                                        {/* <td>{dataRow.nickname}</td> */}
                                        <td>
                                            {dataRow.branch_name}
                                        </td>
                                        <td>
                                            {dataRow.license_code}
                                        </td>
                                        <td>Active</td>
                                        <td className="text-center">
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => handleOpenModal(dataRow)}
                                                >
                                                    <i class="bi bi-journal-text"></i>
                                                </button>
                                                {/* <button className="btn btn-success"> <i className="bi bi-eye-fill"></i></button> */}
                                            </div>
                                        </td>
                                        <td></td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <EmployeeShoweModal isOpen={isModalOpen} onClose={handleCloseModal} emp={selectedEmployee} />
        </>
    )
}

export default DriverShow;