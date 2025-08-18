import React, { useState, useEffect } from "react";
import Calendar from "../../componentspage1/bookingroom/Calendar";
import Room from "./Room";
import { useParams } from "react-router-dom";
import BookingRoomAdd from "./BookingRoomAdd";
import BookingRoomTable from "./BookingRoomTable";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig"

const BookingRoom = () => {
  const { id } = useParams(); // Access the `id` from the URL
  const [isCalendarView, setIsCalendarView] = useState(true); // true: Calendar view, false: Table view
  const [bookingRoomID, setBookingRoomID] = useState([]); // State to store fetched room data
  const [error, setError] = useState(null); // State to handle any errors during fetch
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch

   // Function to trigger re-fetch of booking room data
   const handleDataRefresh = () => {
    setRefresh(!refresh); // Toggle the state to trigger re-fetch
  };

  // Toggle view mode between calendar and table
  const handleToggleView = (view) => {
    setIsCalendarView(view === "calendar");
  };

  // Function to fetch room details based on ID
  const BookingRoomDetailsID = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/bookingroom/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      // Check if the response has valid data
      setBookingRoomID(response.data.data ? [response.data.data] : []); // Wrap single result in array 
    } catch (error) {
      console.error("Error fetching room details:", error);
      setError("Unable to fetch booking room data.");
    }
  };

  useEffect(() => {
    BookingRoomDetailsID();
  }, [id]); // Re-fetch data when `id` changes

  return (
    <div>
      {bookingRoomID.length > 0 ? (
        <>
          <div className="p-3">
            <div className="container">
              <div className="text-center mb-3">
                <h1 className="fs-3 fw-bold">
                  <p>
                    <i className="bi bi-calendar3"></i> จองห้องประชุม{" "}
                    {bookingRoomID[0].meeting_name}{" "}
                    {bookingRoomID[0].meeting_id}
                  </p>
                </h1>
              </div>
              <BookingRoomAdd bookingRoomID={bookingRoomID[0].meeting_id}  onBookingSuccess={handleDataRefresh} />
              <hr />
            </div>
          </div>
          <div className="container">
            <div className="row p-3">
              <div className="col-lg-3 text-center">
                <p className="fs-5">ตรวจสอบการจอง</p>
              </div>
              <div className="col-lg-3">
                <button
                  className={`btn col-12 ${
                    isCalendarView ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => handleToggleView("calendar")}
                >
                  รูปแบบปฏิทิน
                </button>
              </div>
              <div className="col-lg-3">
                <button
                  className={`btn col-12 ${
                    isCalendarView ? "btn-outline-primary" : "btn-primary"
                  }`}
                  onClick={() => handleToggleView("table")}
                >
                   รูปแบบตาราง
                </button>
              </div>
            </div>
            <div className="p-3">
              {error && <p className="text-danger">{error}</p>}
              {/* Render Calendar or BookingRoomTable based on view mode */}
              {isCalendarView ? (
                <Calendar bookingRoomID={bookingRoomID[0].meeting_id} />                
              ) : ( 
                <BookingRoomTable bookingRoomID={bookingRoomID[0].meeting_id}  refresh={refresh} />
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center">No room data available.</p>
      )}
    </div>
  );
};

export default BookingRoom;
