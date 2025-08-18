import React from "react";
import { Link } from "react-router-dom";
import TableRoom from "./TableRoom";


const BookingRoomDetails = () => {
    return (
<>
<div className="p-3">
    <div className="container">
        <div className="">
            <div className="">
                <div className="">
                    <p className="fs-3 fw-bolder">รายการห้องประชุม</p>
                    <p className="fs-5">ทั้งหมด X ห้อง </p>
                </div>
                <div className="card">
                    <div className="card-header ">
                        <p className="fw-bolder fs-6">รายระเอียด</p>
                    </div>
                    <div className="card-body">
  <TableRoom/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
</div>
</>
    )};

    export default BookingRoomDetails;

