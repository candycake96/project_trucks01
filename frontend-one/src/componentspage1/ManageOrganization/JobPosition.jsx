import React, { useState } from "react";
import axios from "axios";
import JobPositionShows from "./jobpositionshows";
import Modal_Jobposition_Add from "./modal/Modal_Jobposition_Add";
const token = 'accessToken';

const JobPosition = ({CompanyID, user}) => {
 
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [message, setMessage] = useState("");
  const [positionAdded, setPositionAdded] = useState(false); // state to track if a new position is added

  const [modalOpenJobpositionAdd, setModalJobposition] = useState(false);
  const handleModalOpenJobposiotion = () => {
    setModalJobposition(true);
  }
  const handleModalCloseAJobposition = () => {
    setModalJobposition(false);
  }


  return (
    <>
      <div className="">
        <div className="card mb-3 rounded-0 shadow-sm">
          <div className="">
          <div className="d-flex justify-content-between align-items-center">
                        <p className="fw-bolder mx-auto">ตำแหน่ง</p>
                        <button className="btn-animated " onClick={handleModalOpenJobposiotion}><i class="bi bi-pencil-fill fs-3"></i></button>
                    </div>
            <div className="">
              {message && (
                <div
                  className={`alert ${
                    messageType === "success" ? "alert-success" : "alert-danger"
                  }`}
                >
                  {message}
                </div>
              )}
             
            </div>
          </div> 
          <br />
        <div className="">
          <JobPositionShows onPositionAdded={positionAdded} CompanyID={CompanyID} /> {/* Pass the state to trigger refresh */}
        </div>          
        </div> 

      </div>
      {modalOpenJobpositionAdd && (
        <Modal_Jobposition_Add isOpen={handleModalOpenJobposiotion} onClose={handleModalCloseAJobposition} user={user}/>
      )}
    </>
  );
};

export default JobPosition;
