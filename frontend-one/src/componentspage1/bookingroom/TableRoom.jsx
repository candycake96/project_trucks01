import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from '../config/apiConfig'

const TableRoom = ({ showButtonRoomEdit, refreshData }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [tableMeetingRoom, setTableMeetingRoom] = useState([]);
  const [modalShowButtonRoom, setModalShowButtonRoom] = useState(null);
  const [modalEditButtonRoom, setModalEditButtonRoom] = useState(null);

  const fetchTableMeetingRoom = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/meetingroom`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setTableMeetingRoom(response.data.data); // เข้าถึงข้อมูลห้องประชุมใน response.data.data
    } catch (error) {
      console.error("Error fetching TableMeetingRoom");
    }
  };

  useEffect(() => {
    fetchTableMeetingRoom();
  }, [refreshData]);

  // Function to save edited meeting room details
const handleSaveEditMeetingRoom = async () => {
  if (modalEditButtonRoom) {
    try {
      // Create FormData to handle file and text data
      const formData = new FormData();
      formData.append("meeting_name", modalEditButtonRoom.meeting_name);
      formData.append("meeting_details", modalEditButtonRoom.meeting_details);
      
      // Only append the file if it exists to avoid overwriting the existing image with an empty file
      if (modalEditButtonRoom.meeting_image) {
        formData.append("meeting_image", modalEditButtonRoom.meeting_image);
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/updatemeetingroom/${modalEditButtonRoom.meeting_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      fetchTableMeetingRoom();
      setModalEditButtonRoom(null);
      // ปิด modal เมื่อบันทึกสำเร็จ
      const editDialog = document.getElementById("my_modal_5");
      if (editDialog) {
        editDialog.close(); // ปิด modal edit
      }
    } catch (error) {
      console.error("Error updating meeting room:", error);
      setMessage("Failed to update the meeting room.");
      setMessageType("error");
    }
  }
};

const handleDeleteMeetingroom = async (id) => {
  try{
    const response = await axios.delete(`${API_BASE_URL}/api/deletemeetingroom/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
    );
    fetchTableMeetingRoom();
  } catch (error) {
    console.error('Error:', error);
    setMessage(error.response.data.message || 'Something went wrong');
  }
}

  const openModal = (tblMeeting) => {
    setModalShowButtonRoom(tblMeeting);
    const dialog = document.getElementById("my_modal_4");
    if (dialog) {
      dialog.showModal();
    }
    console.log(tblMeeting); // Check if the tblMeeting object is correctly passed
  };

  const openModalEditRoom = (tblMeeting) => {
    setModalEditButtonRoom(tblMeeting);
    const dialog = document.getElementById("my_modal_5");
    if (dialog) {
      dialog.showModal();
    }
    console.log(tblMeeting); // Check if the tblMeeting object is correctly passed
  };

  

  return (
    <>
      <table className="table">
        <tbody>
          {tableMeetingRoom.map((tblMeeting, index) => (
            <tr key={index} className="align-items-center">
              <td className="col-lg-2">
                {/* แสดงภาพจาก API */}
                {tblMeeting.meeting_image ? (
                  <img
                    src={tblMeeting.meeting_image}
                    alt={tblMeeting.meeting_name}
                    style={{ width: "5rem" }}
                  />
                ) : (
                  <p>ไม่มีภาพ</p>
                )}
              </td>
              <td className="col-lg-8">
                <div className="badge" style={{ background: "#e7e93f" }}>
                  <p>{tblMeeting.meeting_name}</p>
                </div>
                <p>{tblMeeting.meeting_details}</p>
              </td>
              <td className="col-lg-3">
                <div
                  className="btn-group col-lg-12"
                  role="group"
                  aria-label="Actions"
                >
                  <Link to={`/page1/bookingroom/${tblMeeting.meeting_id}`} className="btn btn-primary">
                    จองห้อง
                  </Link>
                  <button
                    onClick={() => openModal(tblMeeting)}
                    className="btn"
                    style={{ background: "#e87526", color: "#ffffff" }}
                  >
                    รายละเอียด
                  </button>
                </div>
              </td>
              {showButtonRoomEdit && (
                <td className="col-lg-3">
                  <div
                    className="btn-group col-lg-12"
                    role="group"
                    aria-label="Actions"
                  >
                    <Link
                      onClick={() => openModalEditRoom(tblMeeting)}
                      className="btn btn-primary"
                    >
                      <i class="bi bi-tools"></i>
                    </Link>
                    <Link                      
                      className="btn btn"
                      style={{ background: "#e94c3f", color: "#ffffff" }}
                      onClick={() => {
                        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบห้องประชุมนี้?")) {
                          handleDeleteMeetingroom(tblMeeting.meeting_id);
                        }
                      }}
                    >
                      <i class="bi bi-trash-fill"></i>
                    </Link>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Show*/}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h1 className="font-bold text-lg">รายละเอียด</h1>
          {modalShowButtonRoom && (
            <>
              <div className="mb-3">
                {/* Add modal content related to the selected meeting room */}
                <img
                  src={
                    modalShowButtonRoom.meeting_image ||
                    "/path/to/fallback-image.jpg"
                  }
                  alt=""
                  style={{ width: "100%", objectFit: "contain" }} // Adjust the width and objectFit to fit the modal
                />
                {console.log(modalShowButtonRoom?.meeting_image)}
                <p className="fs-4 fw-bolder">
                  ชื่อห้อง {modalShowButtonRoom.meeting_name}
                </p>
                <p className="fs-5">{modalShowButtonRoom.meeting_details}</p>
              </div>
            </>
          )}
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("my_modal_4").close()}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal Edit */}
      <dialog id="my_modal_5" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h1 className="font-bold text-lg">แก้ไขข้อมูลห้องประชุม</h1>
          {modalEditButtonRoom && (
            <>

              <div className="mb-3">
              {message && (
            <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
              {message}
            </div>
          )}
                <label htmlFor="editDepartmentName" className="form-label">
                  ชื่อชื่อห้อง
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDepartmentName"
                  value={modalEditButtonRoom.meeting_name}
                  onChange={(e) =>
                    setModalEditButtonRoom((prev) => ({
                      ...prev,
                      meeting_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editDepartmentImage" className="form-label">
                  รูปห้องประชุม
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="editDepartmentImage"
                  onChange={(e) =>
                    setModalEditButtonRoom((prev) => ({
                      ...prev,
                      meeting_image: e.target.files[0], // ใช้ files[0] เพื่อเก็บไฟล์ที่เลือก
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editDepartmentName" className="form-label">
                  รายละเอียดห้องประชุม
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="editDepartmentName"
                  value={modalEditButtonRoom.meeting_details}
                  onChange={(e) =>
                    setModalEditButtonRoom((prev) => ({
                      ...prev,
                      meeting_details: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}
          <div className="modal-action">
            <button 
            className="btn btn-primary"
            onClick={handleSaveEditMeetingRoom}
            >บันทึก</button>
            <button
              className="btn"
              onClick={() => document.getElementById("my_modal_5").close()}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default TableRoom;
