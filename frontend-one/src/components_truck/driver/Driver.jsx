import React, { useEffect, useState } from "react";
import axios from "axios";
import DriverShow from "./DriverShow";

const Driver = () => {
    return (
        <div className="container p-3">
            <div className="text-center mb-3">
                <span>
                    <p className="fs-5">เกี่ยวกับพนักงานขับรถ</p>   
                </span>
            </div>

            <div className="mb-3">
                <DriverShow/>
            </div>


     
        </div>
    );
};

export default Driver;


// import React, { useEffect, useState } from "react";
// import AddDriver from "./DriverAdd";
// import axios from "axios";
// import DriverShowModal from "./DriverShowModal";
// import DriverUpDate from "./DriverUpDate";
// import DriverShow from "./DriverShow";

// const Driver = () => {
//     const [addDriver, setAddDriver] = useState(false);
//     const [driver, setDriver] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const rowsPerPage = 50;

//     // Modal state
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isModalOpenUpDate, setIsModalOpenUpDate] = useState(false); // สถานะสำหรับโมดัลอัพเดต
//     const [selectedDriver, setSelectedDriver] = useState(null);

//     // Pagination variables
//     const indexOfLastRow = currentPage * rowsPerPage;
//     const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//     const currentRows = driver.slice(indexOfFirstRow, indexOfLastRow);

//     const totalPages = Math.ceil(driver.length / rowsPerPage);
//     const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//     // Fetch driver data from the server
//     const fetchDriver = async () => {
//         try {
//             const token = localStorage.getItem("accessToken");
//             if (!token) {
//                 console.log("Token not found in localStorage");
//                 return;
//             }

//             const response = await axios.get(
//                 "http://localhost:3333/api/getdriverlicense",
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );
//             if (response.data) setDriver(response.data);
//         } catch (error) {
//             console.error("Error fetching driver data:", error);
//         }
//     };

//     // Handle modal open and close // ฟังก์ชันเปิดโมดัลอัพเดต
//     const handleOpenModal = (rowDriver) => {
//         setSelectedDriver(rowDriver);
//         setIsModalOpen(true);
//     };

//     // ฟังก์ชันปิดโมดัล
//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedDriver(null);
//     };

//     // ฟังก์ชันเปิดโมดัลอัพเดต
// const handleOpenModalUpDate = (rowDriver) => {
//     setSelectedDriver(rowDriver);
//     setIsModalOpenUpDate(true);
// };

//     // ฟังก์ชันปิดโมดัลอัพเดต
//     const handleCloseModalUpDate = () => {
//         setIsModalOpenUpDate(false);
//         setSelectedDriver(null);
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             await fetchDriver();
//             setLoading(false);
//         };
//         fetchData();
//     }, []);

//     return (
//         <div className="container p-3">
//             <div className="text-center mb-3">
//                 <span>
//                     <p className="fs-5">เกี่ยวกับพนักงานขับรถ</p>   
//                 </span>
//             </div>

//             <div className="mb-3">
//                 <DriverShow/>
//             </div>

//             <div className="text-center mb-3">
//             <button
//                         className="btn"
//                         style={{ background: "#dc7633" }}
//                         onClick={() => setAddDriver(!addDriver)}
//                     >
//                         {addDriver ? "ปิดฟอร์ม" : "เพิ่มข้อมูล"}
//                     </button>
//             </div>

//             {addDriver && (
//                 <div className="mb-3">
//                     <AddDriver onSubmit={() => setAddDriver(false)} />
//                 </div>
//             )}

//             {loading ? (
//                 <p>Loading...</p>
//             ) : driver.length > 0 ? (
//                 <div>
//                     <div className="card">
//                         <div className="card-body">
//                             <table className="table">
//                                 <thead>
//                                     <tr>
//                                         <th>เลขที่ใบอนุญาติการขับขี่</th>
//                                         <th>ชื่อ</th>
//                                         <th>วันที่ออกใบขับขี่</th>
//                                         <th>วันที่หมดอายุใบขับขี่</th>
//                                         <th>ประเภทใบขับขี่</th>
//                                         <th className="text-center">#</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {currentRows.map((rowDriver) => (
//                                         <tr key={rowDriver.id_driver}>
//                                             <td>{rowDriver.license_number}</td>
//                                             <td>{rowDriver.lname}</td>
//                                             <td>
//                                                 {new Date(
//                                                     rowDriver.issued_date
//                                                 ).toLocaleDateString("th-TH")}
//                                             </td>
//                                             <td>
//                                                 {new Date(
//                                                     rowDriver.expiry_date
//                                                 ).toLocaleDateString("th-TH")}
//                                             </td>
//                                             <td>{rowDriver.license_code}</td>
//                                             <td className="text-center">
//                                                 <div
//                                                     className="btn-group"
//                                                     role="group"
//                                                 >
//                                                                                                         {/* <button
//                                                         className="btn"
//                                                         style={{background: "#dc3545"}}
//                                                         title="Delete Driver"
//                                                         onClick={() => handleOpenModalUpDate(rowDriver)}
//                                                     >
//                                                         <i class="bi bi-trash-fill"></i>
//                                                     </button> */}
//                                                     <button
//                                                         className="btn btn-warning"
//                                                         title="Edit Driver"
//                                                         onClick={() => handleOpenModalUpDate(rowDriver)}
//                                                     >
//                                                         <i className="bi bi-tools"></i>
//                                                     </button>
//                                                     <button
//                                                         className="btn btn-success"
//                                                         title="View Driver Details"
//                                                         onClick={() =>
//                                                             handleOpenModal(
//                                                                 rowDriver
//                                                             )
//                                                         }
//                                                     >
//                                                         <i className="bi bi-eye-fill"></i>
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>

//                     {/* Pagination */}
//                     <div className="d-flex justify-content-center mt-3">
//                         {pageNumbers.map((number) => (
//                             <button
//                                 key={number}
//                                 className={`btn mx-1 ${
//                                     currentPage === number
//                                         ? "btn-primary"
//                                         : "btn-secondary"
//                                 }`}
//                                 onClick={() => setCurrentPage(number)}
//                             >
//                                 {number}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             ) : (
//                 <p>No driver data available.</p>
//             )}

//             {/* Driver Details Modal */}
//             <DriverShowModal
//                 isOpen={isModalOpen}
//                 onClose={handleCloseModal}
//                 driverData={selectedDriver}
//             />

//             <DriverUpDate
//             isOpenUpDate={isModalOpenUpDate}
//             onCloseUpDate={handleCloseModalUpDate}
//             driverDataUpDate={selectedDriver}
//             />
                        
//         </div>
//     );
// };

// export default Driver;
