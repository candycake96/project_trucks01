import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../bookingroom/Calendar.css'; // นำเข้าไฟล์ CSS
import API_BASE_URL from '../config/apiConfig'
import dayjs from 'dayjs'; // ติดตั้งด้วย `npm install dayjs`

const Calendar = ({bookingRoomID}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState(null); // State to handle any errors during fetch
  const [bookingRoomCalendar, setBookingRoomCalendar] = useState([]);

  const [dateNotes, setDateNotes] = useState([]); // เก็บข้อมูลโน้ตวันที่

  const ID = bookingRoomID;
  const today = new Date().toISOString().split("T")[0]; // แปลงวันที่เป็นรูปแบบ YYYY-MM-DD

  const fetchBookingRoomCalendar = async () => {
    if (!ID) {
        console.error('No valid room ID found');
        return; // ถ้าไม่มี room_id ก็ไม่ทำการดึงข้อมูล
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/api/bookingroomtablecalendar/${ID}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        // ตั้งค่าผลลัพธ์ที่ได้จาก API
        const fetchedData = response.data;
        setBookingRoomCalendar(fetchedData); // ข้อมูลการจองทั้งหมด

        // กรองข้อมูลเฉพาะที่เกี่ยวกับ dateNotes (ปรับตามโครงสร้าง API)   // ข้อมูลโน๊ตวันที่ โดยมีช่วงเวลา startDate และ endDate
        const notes = fetchedData
            .filter(item => item.book_datestart && item.book_dateend && item.book_section) // เงื่อนไขข้อมูลที่เป็นโน้ต
            .map(note => ({
              startDate: dayjs(note.book_datestart).format('YYYY-MM-DD'), // ใช้ dayjs แปลงเป็น YYYY-MM-DD
              endDate: dayjs(note.book_dateend).format('YYYY-MM-DD'),     // ใช้ dayjs แปลงเป็น YYYY-MM-DD                    startTime: note.book_timestart ? note.book_timestart : "00:00",  // หากมีค่าในฐานข้อมูลให้ใช้ ไม่งั้นใช้ "00:00"
                endTime: note.book_timeend ? note.book_timeend : "00:00",       // หากมีค่าในฐานข้อมูลให้ใช้ ไม่งั้นใช้ "00:00"          
                note: note.book_section, // ใช้ note.book_section ที่ถูกต้อง
            }));

        setDateNotes(notes); // อัปเดตข้อมูล dateNotes
        setError(null); // เคลียร์ข้อผิดพลาด
    } catch (error) {
        console.error("Error fetching booking room data:", error);
        // setError("Unable to fetch booking room data.");
    }
};


useEffect(() => {
    fetchBookingRoomCalendar();
}, [ID]); // เมื่อ ID เปลี่ยนแปลงให้รีเฟรชข้อมูลใหม่

  // ข้อมูลวันหยุดของบริษัท
  const companyHolidays = [
    { date: '2024-01-01', name: 'New Year Holiday' },
    { date: '2024-04-13', name: 'Songkran Festival' },
    { date: '2024-10-31', name: 'New Year\'s Eve' },
  ];




  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysArray = [];
  
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const changeMonth = (step) => {
    setCurrentDate(new Date(year, month + step, 1));
  };

  // ฟังก์ชันตรวจสอบว่าวันนี้เป็นวันหยุดหรือไม่
  const isHoliday = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return companyHolidays.find(holiday => holiday.date === dateStr);
  };

  // ฟังก์ชันตรวจสอบว่าวันนี้อยู่ในช่วงของโน๊ตหรือไม่
  const getNotesForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // ใช้ filter เพื่อคืนค่าทุก note ที่อยู่ในช่วง startDate และ endDate
    return dateNotes.filter(note => dateStr >= note.startDate && dateStr <= note.endDate);
  };

  const colors = ['#FFBF00', '#FF7F50', '#DE3163', '#9FE2BF', '#40E0D0', '#6495ED', '#CCCCFF']; // กำหนดสี 5 สี

const getRandomColor = () => {
  // สุ่มเลือกสีจาก array ของสี
  return colors[Math.floor(Math.random() * colors.length)];
};

  return (
    <div className="calendar">
      <div className="">
      {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="header">
        <button className="button" onClick={() => changeMonth(-1)}><i className="bi bi-caret-left-fill"></i> Prev</button>
        <h2>{monthNames[month]} {year}</h2>
        <button className="button" onClick={() => changeMonth(1)}>Next <i className="bi bi-caret-right-fill"></i></button>
      </div>
      <div className="days">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div>
        <div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      <div className="dates">
  {daysArray.map((day, index) => {
    const holiday = day && isHoliday(day);
    const notes = day && getNotesForDay(day);
    
    const isCurrentDay = day === today; // เช็คว่าเป็นวันที่ปัจจุบันหรือไม่

    return (
      <div 
        key={index} 
        className={`date ${holiday ? 'holiday' : ''} ${!day ? 'empty' : ''} ${isCurrentDay ? 'current-day' : ''}`} 
      >
        {day}
        {holiday && <div className="holiday-name">{holiday.name}</div>} 
        {notes && notes.map((noteItem, idx) => ( 
          <div key={idx} className="note" style={{ backgroundColor: noteItem.color }}>
            <a href="" className="link-underline-primary" style={{ color: getRandomColor() }}>
              {noteItem.note} {noteItem.startTime} - {noteItem.endTime} น.
            </a>
          </div>
        ))}
      </div>
    );
  })}
</div>
      <div className="p-3">
        <div className="">
        <p></p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;


