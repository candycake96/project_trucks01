import React, { useState } from "react";
import './ShowVhicleDetailsExpanded.css'
import CardDetailsVehicle from "./CardDetailsVehicle";
import CardDriverRelation from "./CardDriverRelation";
import CardVehiclePairing from "./CardVehiclePairing";
import { Link } from "react-router-dom";
import Modal_RepairRequestForm from "./modal/Modal_RepairRequestForm";
import Modal_CarMileageForm from "./modal/Modal_CarMileageForm";
import Modal_status_update from "../modal/Modal_status_update";


const ShowVhicleDetailsExpanded = ({ dataVehicle }) => {
    if (!dataVehicle) return null;

    const [isOpenModalRepairRequest, setOpenModalRepairRequest] = useState(false);
    const handleOpenModalRepairRequest = () => {
        setOpenModalRepairRequest(true);
    }

    const handleCloseModalRepairRequest = () => {
        setOpenModalRepairRequest(false);
    }

    const [isOpenModalCarMileageForm, setOpenModalCarMileageForm] = useState(false);
    const handleOpenModalCarMileageForm = () => {
        setOpenModalCarMileageForm(true);
    }
    
    const handleCloseModalCarMileageForm = () => {
        setOpenModalCarMileageForm(false);
    }

    const [isOpenModalStatusUpdate, setOpenModalStatuseUpdate] = useState(false);
    const [dataStatuse, setDataStatus] = useState(null);
    const handleOpenModalStatusUpdate = (data) => {
        setOpenModalStatuseUpdate(true);   
        setDataStatus(data);
    };
    const handleCloseModalStatusUpdate = () => {
        setOpenModalStatuseUpdate(false);
    }


    const rowMi = dataVehicle;


    return (
        <>
            <div className="p-2">
                <div className="">
                    <div className="mb-2">
                    <button
                    onClick={()=>handleOpenModalStatusUpdate(rowMi)}
                            className="btn me-1 "
                            style={{ background: "Teal", color: '#ffffff' }}
                            // onClick={() => handleOpenModalRepairRequest()}
                        ><i class="bi bi-clipboard"></i> ม.89 / ม.79 
                        </button>
                        <Link to="/truck/CarMileageDetails" state={rowMi} className="btn me-1" style={{ background: "Teal", color: '#ffffff' }}>
                        <i class="bi bi-speedometer2"></i> เลขไมล์รถ
                        </Link>
                        <Link
                        to="/truck/RepairRequestForm"
                        state={rowMi}
                            className="btn me-1"
                            style={{ background: "Teal", color: '#ffffff' }}
                        ><i class="bi bi-tools"></i> แจ้งซ่อม
                        </Link>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-lg-7 d-flex flex-column">
                        <CardDetailsVehicle dataVehicle={dataVehicle} />
                    </div>

                    <div className="col-lg-5 d-flex flex-column">
                        
                        {/* <div className="mb-3">
                            <div className="">
                                <Link to="/truck/RepairRequestForm" className="btn " style={{ background: "Teal", color: '#ffffff' }}><i class="bi bi-tools"></i>เลขไมล์รถ</Link>
                            </div>
                            <div className="">
                                <button
                                    className="btn "
                                    style={{ background: "Teal", color: '#ffffff' }}
                                    onClick={() => handleOpenModalRepairRequest()}
                                ><i class="bi bi-tools"></i> แจ้งซ่อม
                                </button>
                            </div>
                        </div> */}

                        {(dataVehicle.car_type_id === 1 || dataVehicle.car_type_id === 2) && (
                            <CardVehiclePairing dataVehicle={dataVehicle} />
                        )}

                        <CardDriverRelation dataVehicle={dataVehicle} />
                    </div>
                </div>



            </div>

            {isOpenModalRepairRequest && (
                <Modal_RepairRequestForm isOpen={isOpenModalRepairRequest} onClose={handleCloseModalRepairRequest} />
            )}

            {isOpenModalCarMileageForm && (
                <Modal_CarMileageForm isOpen={isOpenModalCarMileageForm} onClose={handleCloseModalCarMileageForm} />
            )}

            {isOpenModalStatusUpdate && (
                <Modal_status_update isOpen={isOpenModalStatusUpdate} onClose={handleCloseModalStatusUpdate} onData={dataStatuse}  />
            )}

        </>
    )
}

export default ShowVhicleDetailsExpanded;