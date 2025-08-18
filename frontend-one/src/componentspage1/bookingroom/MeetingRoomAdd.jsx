import React, { useState } from "react";
import TableRoom from "./TableRoom"; // import TableRoom
import axios from "axios";
import API_BASE_URL from '../config/apiConfig';

const MeetingRoomAdd = () => {
  const [roomname, setRoomname] = useState("");
  const [roomdetails, setRoomdetails] = useState("");
  const [roomimage, setRoomimage] = useState(null); // ใช้ null สำหรับไฟล์ภาพ
  const [showButtonRoomEdit, setShowButtonRoomEdit] = useState(true);
  const [refreshData, setRefreshData] = useState(false); // ใช้เพื่อรีเฟรชข้อมูลใน TableRoom

  // ฟังก์ชันสำหรับ toggle การแสดงปุ่ม
  const toggleButton = () => {
    setShowButtonRoomEdit(!showButtonRoomEdit);
  };

  // เพิ่มข้อมูลห้องประชุม
  const hendleSubmitAddDataRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("meeting_name", roomname);
    formData.append("meeting_details", roomdetails);
    if (roomimage) {
      formData.append("meeting_image", roomimage);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/addmeetingroom`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status === 200) {
        alert("บันทึกข้อมูลห้องประชุมเรียบร้อย");
        setRoomname("");
        setRoomdetails("");
        setRoomimage(null);
        setRefreshData(!refreshData); // เปลี่ยนค่าเพื่อให้ TableRoom ดึงข้อมูลใหม่
      } else {
        alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("ข้อมูลไม่ถูกต้องกรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  return (
    <>
      <div className="p-3">
        <p className="fs-3">เพิ่มข้อมูลห้องประชุม</p>
        <form onSubmit={hendleSubmitAddDataRoom} className="mb-4">
          <div className="row p-2">
            <div className="col-lg-6">
              <label htmlFor="roomname" className="form-label">
                ชื่อ
              </label>
              <input
                type="text"
                className="form-control"
                id="roomname"
                placeholder="ชื่อห้องประชุม"
                value={roomname}
                onChange={(e) => setRoomname(e.target.value)}
              />
            </div>
            <div className="col-lg-6">
              <label htmlFor="roomimage" className="form-label">
                ภาพห้องประชุม
              </label>
              <input
                type="file"
                className="form-control"
                id="roomimage"
                onChange={(e) => setRoomimage(e.target.files[0])}
              />
            </div>
          </div>
          <div className="mb-3 p-2">
            <label htmlFor="roomdetails" className="form-label">
              รายละเอียดห้องประชุม
            </label>
            <textarea
              className="form-control"
              id="roomdetails"
              placeholder="รายละเอียดห้องประชุม"
              value={roomdetails}
              onChange={(e) => setRoomdetails(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              บันทึก
            </button>
          </div>
        </form>
        <hr />
        <div className="mb-3 p-3 container">
          <div className="card">
            <div className="card-body">
              <TableRoom showButtonRoomEdit={showButtonRoomEdit}  refreshData={refreshData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeetingRoomAdd;
