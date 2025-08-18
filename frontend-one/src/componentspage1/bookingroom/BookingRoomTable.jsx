import axios from "axios";
import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config/apiConfig"

const BookingRoomTable = ({ bookingRoomID, refresh }) => {
  const [bookingRoomTable, setBookingRoomTable] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalBookingRoomTable, setModalBookingRoomTable] = useState(null);
  const [modalBookingRoomTableEdit, setModalBookingRoomTableEdit] =
    useState(null);
  const [searchDate, setSearchDate] = useState("");

  // ดึง room_id จาก bookingRoomID ที่ส่งเข้ามา
  const ID = bookingRoomID; // หรือใช้ `bookingRoomID[0]` หากมันเป็นอาร์เรย์

  const formatDate = (date) => {
    if (!date) return ""; // กรณีไม่มีค่าให้ส่งคืนเป็นค่าว่าง
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const openModal = (roomlist) => {
    setModalBookingRoomTable(roomlist);
    const dialog = document.getElementById("my_modal_4_1");
    if (dialog) dialog.showModal();
  };

  const openModalEdit = (roomlist) => {
    setModalBookingRoomTableEdit(roomlist);
    const dialog = document.getElementById("my_modal_4");
    if (dialog) dialog.showModal();
  };


  const fetchBookingRoomTable = async (searchDate = null) => {
    if (!ID) {
      console.error("No valid room ID found");
      return;
    }
  
    // กำหนด URL สำหรับการค้นหา และถ้ามี searchDate จะเพิ่มเป็น query string
    const endpoint = searchDate
      ? `${API_BASE_URL}/api/searchbookingroomtable/${ID}?searchDate=${searchDate}`
      : `${API_BASE_URL}/api/bookingroomtable/${ID}`;
  
    console.log(searchDate);
    
    try {
      setLoading(true);  // ตั้งค่า loading เป็น true ก่อนที่จะเริ่มเรียก API
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setBookingRoomTable(response.data); // ตั้งค่าผลลัพธ์ที่ได้จาก API
      setError(""); // รีเซ็ตข้อความ error เมื่อข้อมูลถูกโหลดสำเร็จ
    } catch (error) {
      console.error("Error fetching booking room data:", error);
      setError("ไม่มีข้อมูลการจอง"); // ตั้งค่าข้อความ error
      setLoading(false); 
    } finally {
      setLoading(false);  // ตั้งค่า loading เป็น false หลังจากเสร็จสิ้นการโหลดข้อมูล
    }
  }
  
  // โหลดข้อมูลเมื่อ `ID` หรือ `refresh` เปลี่ยน
//   useEffect(() => {
//     setLoading(true);
//     fetchBookingRoomTable();
//   }, [ID, refresh]);
useEffect(() => {
    setLoading(true);
    fetchBookingRoomTable(searchDate);  // เรียกให้โหลดข้อมูลใหม่ทุกครั้งที่ `searchDate` เปลี่ยน
  }, [ID, refresh, searchDate]);
  
  // ฟังก์ชันสำหรับค้นหาโดยไม่ต้องรีเฟรชหน้า
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);
    await fetchBookingRoomTable(searchDate);
  };
  
  
  
  

  const handleDelete = async (id) => {
    // ใช้ window.confirm() เพื่อแสดงการยืนยันการลบ
    const confirmDelete = window.confirm("คุณแน่ใจหรือว่าต้องการลบ?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/api/deletebookingroomtable/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        fetchBookingRoomTable();
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      // ถ้าผู้ใช้ยกเลิก
      console.log("ยกเลิกการลบ");
    }
  };

  const [user, setUser] = useState(null);
  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData)); // แปลง JSON เป็น Object แล้วเก็บใน state
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleSaveEditBookingRoomTable = async () => {
    if (modalBookingRoomTableEdit) {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/updatebookingroom/${modalBookingRoomTableEdit.book_id}`,
          modalBookingRoomTableEdit,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        // setMessage(response.data.message);
        // setMessageType("success");
        fetchBookingRoomTable();
        setModalBookingRoomTableEdit(null);

        // Close the modal
        const dialog = document.getElementById("my_modal_4");
        if (dialog) dialog.close(); // Close the modal after saving changes
      } catch (error) {
        console.error("Error updating department:", error);
        // setMessage("Failed to update the department.");
        // setMessageType("error");
      }
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">ข้อมูลรายละเอียดการจอง</div>
        <div className="card-body">
          <div className="">
            <form action="" className="row">
              <div className="col-auto">
                <label htmlFor="staticEmail2" className="visually-hidden">
                  วัน/เดือน/ปี ค.ศ.
                </label>
                <input
                  type="text"
                  readonly
                  className="form-control-plaintext"
                  id="staticEmail2"
                  value="วัน/เดือน/ปี ค.ศ."
                />
              </div>
              <div className="col-auto">
                <label htmlFor="inputPassword2" className="visually-hidden">
                  วัน/เดือน/ปี ค.ศ.
                </label>
                <input
                  readonly
                  className="form-control"
                  id="staticEmail2"
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)} // อัปเดตสถานะ searchDate
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-primary mb-3" type="submit" onClick={handleSearch}>
                  ค้นหา
                </button>
              </div>
            </form>
          </div>
          {/* Loading/Error State */}
          {loading ? (
  <p>กำลังโหลดข้อมูล...</p> // แสดงข้อความเมื่อกำลังโหลด
) : error ? (
  <p className="text-danger">{error}</p> // แสดงข้อความเมื่อเกิดข้อผิดพลาด
) : bookingRoomTable.length === 0 ? (
  <p>ไม่มีข้อมูล</p> // แสดงข้อความเมื่อไม่มีข้อมูล
) : (
            <table>
              <thead>
                <tr>
                  <th>หัวข้อ</th>
                  <th>ชื่อผู้จอง</th>
                  <th>จองเมื่อ</th>
                  <th>วันที่เริ่มต้น</th>
                  <th>วันที่สิ้นสุด</th>
                  <th>แผนก</th>
                </tr>
              </thead>
              <tbody>
                {bookingRoomTable.map((roomlist, index) => (
                  <tr key={roomlist.book_id}>
                    <td className="col-lg-4">{roomlist.book_section}</td>
                    <td>
                      {roomlist.emp_name} {roomlist.emp_lname}
                    </td>
                    <td>
                      {new Date(roomlist.book_datecreate).toLocaleDateString(
                        "th-TH",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td>
                      {new Date(roomlist.book_datestart).toLocaleDateString(
                        "th-TH",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                      {` `}
                      {roomlist.book_timestart.split(":").slice(0, 2).join(":")}
                    </td>
                    <td>
                      {new Date(roomlist.book_dateend).toLocaleDateString(
                        "th-TH",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                      {` `}
                      {roomlist.book_timeend.split(":").slice(0, 2).join(":")}
                    </td>
                    <td>{roomlist.dep_name}</td>
                    {roomlist.emp_id === user.id ? (
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-warning"
                            onClick={() => openModalEdit(roomlist)}
                          >
                            <i class="bi bi-wrench-adjustable"></i>
                          </button>
                          <button
                            className="btn "
                            style={{ background: "#ec7063" }}
                            onClick={() => handleDelete(roomlist.book_id)}
                          >
                            <i class="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    ) : (
                      <td>
                        <button className=" "></button>
                      </td>
                    )}

                    <td>
                      <button
                        className="btn btn"
                        onClick={() => openModal(roomlist)}
                        style={{ background: "#28b463" }}
                      >
                        <i class="bi bi-eye-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          )}
        </div>
      </div>

      {/* Modal */}
      <dialog id="my_modal_4_1" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <div className="card-header bg-blue-500 text-white px-4 py-2 rounded-t-lg flex items-center">
            <i className="bi bi-calendar3 mr-2 text-lg"></i>
            <p className="font-bold text-lg">รายละเอียดของการจอง</p>
          </div>
          <div className="card-body bg-gray-50 ">
            {modalBookingRoomTable && (
              <div className="overflow-auto">
                <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                  <tbody>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        หัวข้อ
                      </th>
                      <td className="border border-gray-300 px-4 py-2">
                        {modalBookingRoomTable.book_section}
                      </td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        ผู้จอง
                      </th>
                      <td className="border border-gray-300 px-4 py-2">
                        {modalBookingRoomTable.emp_name}{" "}
                        {modalBookingRoomTable.emp_lname}
                      </td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        เบอร์โทรศัพท์ติดต่อ
                      </th>
                      <td className="border border-gray-300 px-4 py-2">
                        {modalBookingRoomTable.book_phon}
                      </td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        วันที่จองเริ่มต้น
                      </th>
                      <td className="border border-gray-300 px-4 py-2">
                        {modalBookingRoomTable.book_datestart &&
                          new Date(
                            modalBookingRoomTable.book_datestart
                          ).toLocaleDateString("th-TH", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                        {modalBookingRoomTable.book_timestart &&
                          modalBookingRoomTable.book_timestart
                            .split(":")
                            .slice(0, 2)
                            .join(":")}
                      </td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        วันที่จองสิ้นสุด
                      </th>
                      <td className="border border-gray-300 px-4 py-2">
                        {modalBookingRoomTable.book_dateend &&
                          new Date(
                            modalBookingRoomTable.book_dateend
                          ).toLocaleDateString("th-TH", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                        {modalBookingRoomTable.book_timeend &&
                          modalBookingRoomTable.book_timeend
                            .split(":")
                            .slice(0, 2)
                            .join(":")}
                      </td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        แผนกที่ขอใช้
                      </th>
                      <td className="border border-gray-300 px-4 py-2">
                        {modalBookingRoomTable.dep_name}
                      </td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        อุปกรณ์
                      </th>
                      <td className="border border-gray-300 px-4 py-2">
                        {modalBookingRoomTable.book_equipment}
                      </td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        อื่นๆ
                      </th>
                      <td className="border border-gray-300 px-4 py-2">
                        {modalBookingRoomTable.book_other}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <div className="modal-action flex justify-end mt-4">
              <button
                className="btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => document.getElementById("my_modal_4_1").close()}
                style={{ background: "#616a6b " }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </dialog>

      {/* Modal */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h1 className="font-bold text-lg">แก้ไขข้อมูล</h1>
          <p style={{ color: "#e74c3c" }}>
            **ก่อนการจองห้องกรุณาตรวจสอบข้อมูลวันเวลาการจองว่างหรือไม่เพื่อลดความผิดพลาดการจองซ้ำในวันเวลาเดียวกัน
          </p>
          {modalBookingRoomTableEdit && (
            <>
              <div className="mb-3">
                <label htmlFor="editDepartmentName" className="form-label">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDepartmentName"
                  value={modalBookingRoomTableEdit.book_phon}
                  onChange={(e) =>
                    setModalBookingRoomTableEdit((prev) => ({
                      ...prev,
                      book_phon: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editDepartmentName" className="form-label">
                  หัวข้อ
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDepartmentName"
                  value={modalBookingRoomTableEdit.book_section}
                  onChange={(e) =>
                    setModalBookingRoomTableEdit((prev) => ({
                      ...prev,
                      book_section: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="row">
                <div className="col-lg-8">
                  <div className="mb-3">
                    <label htmlFor="editDepartmentName" className="form-label">
                      วันที่เริ่มต้น
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="editDepartmentName"
                      value={formatDate(
                        modalBookingRoomTableEdit.book_datestart
                      )}
                      onChange={(e) =>
                        setModalBookingRoomTableEdit((prev) => ({
                          ...prev,
                          book_datestart: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-3">
                    <label htmlFor="editDepartmentName" className="form-label">
                      เวลาเริ่มต้น
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="editDepartmentName"
                      value={modalBookingRoomTableEdit.book_timestart}
                      onChange={(e) =>
                        setModalBookingRoomTableEdit((prev) => ({
                          ...prev,
                          book_timestart: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8">
                  <div className="mb-3">
                    <label htmlFor="editDepartmentName" className="form-label">
                      วันที่จองสิ้นสุด
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="editDepartmentName"
                      value={formatDate(modalBookingRoomTableEdit.book_dateend)}
                      onChange={(e) =>
                        setModalBookingRoomTableEdit((prev) => ({
                          ...prev,
                          book_dateend: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-3">
                    <label htmlFor="editDepartmentName" className="form-label">
                      เวลาสิ้นสุด
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="editDepartmentName"
                      value={modalBookingRoomTableEdit.book_timeend}
                      onChange={(e) =>
                        setModalBookingRoomTableEdit((prev) => ({
                          ...prev,
                          book_timeend: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="editDepartmentName" className="form-label">
                  อื่นๆ
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDepartmentName"
                  value={modalBookingRoomTableEdit.book_other}
                  onChange={(e) =>
                    setModalBookingRoomTableEdit((prev) => ({
                      ...prev,
                      book_other: e.target.value,
                    }))
                  }
                />
              </div>
              {/* <div className="mb-3">
                <label htmlFor="editDepartmentName" className="form-label">
                  อุปกรณ์
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDepartmentName"
                  value={modalBookingRoomTableEdit.book_equipment}
                  onChange={(e) =>
                    setModalBookingRoomTableEdit((prev) => ({
                      ...prev,
                      book_equipment: e.target.value,
                    }))
                  }
                />
              </div> */}
            </>
          )}
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={handleSaveEditBookingRoomTable}
            >
              บันทึก
            </button>
            <button
              className="btn"
              onClick={() => document.getElementById("my_modal_4").close()}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default BookingRoomTable;
