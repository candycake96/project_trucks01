import axios from "axios";
import React, { useState, useEffect } from "react";
import "flatpickr/dist/flatpickr.min.css"; // นำเข้าไฟล์ CSS ของ Flatpickr
import API_BASE_URL from '../config/apiConfig'
// import {fetchBookingRoomTable} from './BookingRoomTable';

const BookingRoomAdd = ({ bookingRoomID, onBookingSuccess }) => {
  // ดึง room_id จาก bookingRoomID ที่ส่งเข้ามา
  const roomID = bookingRoomID;
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [phone, setPhone] = useState("");
  const [participants, setParticipants] = useState("");
  const [section, setSection] = useState("");
  const [datestart, setDatestart] = useState("");
  const [dateend, setDateend] = useState("");
  const [timestart, setTimestart] = useState("");
  const [timeend, setTimeend] = useState("");
  const [auther, setAuther] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

    // สร้างตัวเลือกเวลา (12:00 ถึง 23:00)
    const generateTimeOptions = () => {
      const options = [];
      for (let hour = 7; hour <= 20; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const time = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
          options.push(time);
        }
      }
      return options;
    };
  
  
    const timeOptions = generateTimeOptions();

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData); // แปลง JSON เป็น Object
      setUser(parsedUser); // เก็บใน state
      setUserId(parsedUser.id); // ดึง id เก็บใน state ใหม่
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "datestart") {
      setDatestart(value);
    } else if (id === "dateend") {
      setDateend(value);
    }
  };

  const handleBookingroomTable = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    // ตรวจสอบว่าเบอร์โทรศัพท์มีหรือไม่
    if (!phone) {
      setMessage("Telephone number is required.");
      setMessageType("error");
      return;
    }

    console.log("Data being sent to backend:", {
      meeting_id: roomID,
      emp_id: userId,
      book_phon: phone,
      book_participants: participants,
      book_section: section,
      book_datestart: datestart,
      book_dateend: dateend,
      book_timestart: timestart,
      book_timeend: timeend,
      book_auther: auther,
      book_equipment: selectedItems.join(", "),
    });
    

    try {
      // ส่งข้อมูลไปที่ API สำหรับการเพิ่มการจองห้องประชุม
      const response = await axios.post(
        `${API_BASE_URL}/api/insertbookingroom`,
        {
          meeting_id: roomID,
          emp_id: userId,
          book_phon: phone,
          book_participants: participants,
          book_section: section,
          book_datestart: datestart,
          book_dateend: dateend,
          book_timestart: timestart,
          book_timeend: timeend,
          book_auther: auther,
          book_equipment: selectedItems.join(", "), // รวมค่าที่เลือก
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // ส่ง token สำหรับการยืนยันตัวตน
          },
        }
      );

      // แสดงข้อความสำเร็จ
      setMessage(response.data.message);
      setMessageType("success");
      setPhone("");
      setParticipants("");
      setSection("");
      setDatestart("");
      setDateend("");
      setTimestart("");
      setTimeend("");
      setAuther("");
      onBookingSuccess(); // Call the function passed from parent
    } catch (error) {
      console.error("Error inserting handleBookingroomTable:", error);
      // แสดงข้อความผิดพลาด
      setMessage(
        "Unable to add a reservation. Something went wrong. Please check the information before saving."
      );
      setMessageType("error");
    }
  };

  const items = ["กล้องเว็บแคม : Webcam", "ลำโพงสำหรับสนทนา : Speakerphone", "เครื่องชี้ : pointe"];

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, value]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item !== value)
      );
    }
  };

  return (
    <>
      <div className="">
        <div className="">
          <div className="">
            <div className="p-3">
              <p className="" style={{ color: "#e74c3c" }}>
                **ก่อนการจองห้องกรุณาตรวจสอบข้อมูลวันเวลาการจองว่างหรือไม่เพื่อลดความผิดพลาดการจองซ้ำในวันเวลาเดียวกัน
              </p>
            </div>
            {message && (
              <div
                className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"
                  }`}
              >
                {messageType === "success"
                  ? "บันทึกข้อมูลสำเร็จ!"
                  : "เกิดข้อผิดพลาด: " + message}
              </div>
            )}

            <form action="" onSubmit={handleBookingroomTable}>
              <div className="row">
                <div className="mb-2 col-3 ">
                  <label htmlFor="Name" className="form-label">
                    ชื่อผู้จอง
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Name"
                    value={`${user.fname} ${user.lname}`}
                  />
                </div>
                <div className="mb-2 col-3 ">
                  <label htmlFor="phone" className="form-label">
                    เบอร์โทรศัพท์  <span style={{ color: "red" }}> *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    placeholder="เบอร์โทรศัพท์"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-2 col-3 ">
                  <label htmlFor="department" className="form-label">
                    แผนกที่ขอใช้
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="department"
                    value={user.dep_name}
                  />
                </div>
                <div className="mb-2 col-3 ">
                  <label htmlFor="participants" className="form-label">
                    จำนวนผู้เข้าร่วม  <span style={{ color: "red" }}> *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="participants"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="mb-2 col-lg-12 ">
                  <label htmlFor="section" className="form-label">
                    หัวข้อการประชุม  <span style={{ color: "red" }}> *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="row">
                    <div className="mb-2 col-lg-6 ">
                      <label htmlFor="dateStrat" className="form-label">
                        วันที่เริ่มต้น  <span style={{ color: "red" }}> *</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="dateStrat"
                        value={datestart}
                        onChange={(e) => setDatestart(e.target.value)}
                      />
                    </div>
                    <div className="mb-2 col-lg-6 ">
                      <label htmlFor="timeStrat" className="form-label">
                        เวลาเริ่มต้น  <span style={{ color: "red" }}> *</span>
                      </label>
                      <select
  className="form-select"
  id="timeStart"
  value={timestart}
  onChange={(e) => setTimestart(e.target.value)}
>
  <option value="" disabled>
    เลือกเวลา
  </option>
  {timeOptions.map((time) => (
    <option key={time} value={time}>
      {time}
    </option>
  ))}
</select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-2 col-lg-6 ">
                      <label htmlFor="dateEnd" className="form-label">
                        วันที่สิ้นสุด  <span style={{ color: "red" }}> *</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="dateend"
                        value={dateend}
                        onChange={handleDateChange}
                      />
                    </div>
                    <div className="mb-2 col-lg-6 ">
                      <label htmlFor="dateEnd" className="form-label">
                        เวลาสิ้นสุด  <span style={{ color: "red" }}> *</span>
                      </label>
                      <select
  className="form-select"
  id="timeEnd"
  value={timeend}
  onChange={(e) => setTimeend(e.target.value)}
>
  <option value="" disabled>
    เลือกเวลา
  </option>
  {timeOptions.map((time) => (
    <option key={time} value={time}>
      {time}
    </option>
  ))}
</select>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-2 col-lg-12 ">
                    <label htmlFor="otherDetails" className="form-label">
                      อื่นๆ
                    </label>
                    <textarea
                      type="text"
                      className="form-control h-100"
                      id="otherDetails"
                      rows="4" // ตั้งค่า
                      value={auther}
                      onChange={(e) => setAuther(e.target.value)}
                    />
                  </div>
                </div>

                {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {items.map((item) => (
                    <div
                      key={item}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        value={item}
                        checked={selectedItems.includes(item)} // ตรวจสอบสถานะการเลือก
                        onChange={handleCheckboxChange}
                        style={{ marginRight: "5px" }} // Add spacing between checkbox and label
                      />
                      <label>{item}</label>
                    </div>
                  ))}
                </div>
                <p>รายการที่เลือก: {selectedItems.join(", ")}</p> */}
              </div>
              <div className="p-3 text-center">
                <button
                  type="submit"
                  className="btn"
                  style={{ background: "#006600", color: "#ffffff" }}
                >
                  <i className="bi bi-floppy-fill"></i> บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingRoomAdd;
