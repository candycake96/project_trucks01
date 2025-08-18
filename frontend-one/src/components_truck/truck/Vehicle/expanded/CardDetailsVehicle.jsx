import axios from "axios";
import React, { useState, useEffect } from "react";
import './ShowVhicleDetailsExpanded.css';
import Modal_edit_vehicle from "../modal/Modal_edit_vehicle";
import Modal_edit_vehicle_other from "../modal/Modal_edit_vehicle_other";
import Modal_UpdateTex from "./modal/Modal_UpdateTax";
import Modal_UpdateCMI from "./modal/Modal_UpdataCMI";
import Modal_UpdateInsurance from "./modal/Modal_UpdateInsurance";
import Modal_AddAutoCar from "./modal/Modal_AddAutoCar";
import Modal_UpdateAutoCar from "./modal/Modal_UpdateAutoCar";
import { apiUrl } from "../../../../config/apiConfig";

// ฟังก์ชันแปลงวันที่
const formatDate = (dateString) => {
    const date = new Date(dateString); // สร้างอ็อบเจกต์ Date จากวันที่ที่ได้รับ
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('th-TH', options); // แสดงผลในรูปแบบวัน เดือน ปี (ภาษาไทย)
};


const CardDetailsVehicle = ({ dataVehicle }) => {
    if (!dataVehicle) return null;
    // const [reload, setReload] = useState(false); // สร้าง state สำหรับการรีโหลด
    const [actionShow, setActiveShow] = useState("vehicleInfo");
    const [isDataVehicle, setDataVahicle] = useState(null);
    const [error, setError] = useState(null);


    const fetchDetailsVehicle = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/vehicledetailgetid/${dataVehicle.reg_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            const data = response.data;
            data.reg_date = formatDate(data.reg_date);  // แปลงวันที่ที่ได้รับ
            setDataVahicle(data);  // เก็บข้อมูลที่ได้

        } catch (error) {
            console.error("Error fetching license types:", error);
            setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
    };

    useEffect(() => {
        fetchDetailsVehicle();
    }, [dataVehicle.reg_id]);

    return (
        <div className="card h-100">
            <div className="card-header d-flex justify-content-center align-items-center bg-white border-bottom-0">
  <div className="btn-group btn-group-sm" role="group">
    <button
      className={`btn btn-outline-primary btn-sm ${actionShow === "vehicleInfo" ? "active-btn" : "inactive-btn"}`}
      onClick={() => setActiveShow("vehicleInfo")}
    >
      ข้อมูลรถ
    </button>
    <button
      className={`btn btn-outline-primary btn-sm ${actionShow === "insuranceInfo" ? "active-btn" : "inactive-btn"}`}
      onClick={() => setActiveShow("insuranceInfo")}
    >
      พรบ / ประกัน
    </button>
    <button
      className={`btn btn-outline-primary btn-sm ${actionShow === "FinanceInfo" ? "active-btn" : "inactive-btn"}`}
      onClick={() => setActiveShow("FinanceInfo")}
    >
      สินเชื่อรถ
    </button>
    <button
      className={`btn btn-outline-primary btn-sm ${actionShow === "MaintenanceInfo" ? "active-btn" : "inactive-btn"}`}
      onClick={() => setActiveShow("MaintenanceInfo")}
    >
      บำรุงรักษา
    </button>
  </div>
</div>


            <div className="card-body p-2">
                {/* ตรวจสอบว่า isDataVehicle เป็นอาเรย์ก่อน */}
                {Array.isArray(isDataVehicle) && isDataVehicle.length > 0 && (
                    <div>
                        {isDataVehicle.map((vehicle, index) => (
                            <div key={index}>
                                {actionShow === "insuranceInfo" && <InsuranceInfo dataVehicle={vehicle} />}
                                {actionShow === "vehicleInfo" && <VehicleDtails dataVehicle={vehicle}/>}
                                {actionShow === "FinanceInfo" && <FinanceInfo dataVehicle={vehicle} />}
                                {actionShow === "MaintenanceInfo" && <MaintenanceInfo dataVehicle={vehicle} />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const VehicleDtails = ({ dataVehicle }) => {
    if (!dataVehicle) return null;
    const [isOpenModalEditVehicle, setOpenModaleEditVehicle] = useState(false);
    const [isOpenModalEditOther, setOpenModalEditOther] = useState(false);
    const [isDataVehicle, setDataVahicle] = useState(null);
    const handleOpenModalEditOther = (eData) => {
        setOpenModalEditOther(true);
        setDataVahicle(eData);
    }
    const handleCloseModalEditOther = () => {
        setOpenModalEditOther(false);
    }
    const handleOpenModalEditVehicle = (data) => {
        setDataVahicle(data);
        setOpenModaleEditVehicle(true);
    }
    const handleCloseModalEditVehicle = () => {
        setOpenModaleEditVehicle(false);
    }


    return (
        <div className="p-2">
            <div className="d-flex justify-content-center position-relative">
                <strong>รายการจดทะเบียน</strong>
                <button className="p-0 position-absolute end-0 btn-animated" style={{ color: 'green' }} onClick={() => handleOpenModalEditVehicle(dataVehicle)}>
                    <i className="bi bi-pencil-square"></i>
                </button>
            </div>

            <div className="row">
                <div className="col-lg-4">
                    <p><strong>จดทะเบียน:</strong> {formatDate(dataVehicle.reg_date)}</p>
                </div>
                <div className="col-lg-4">
                    <p><strong>เลขทะเบียน:</strong> {(dataVehicle.reg_number)}</p>
                </div>
                <div className="col-lg-4">
                    <p><strong>จังหวัด:</strong> {(dataVehicle.province)}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-4">
                    <p><strong>เชื้อเพลิง:</strong> {dataVehicle.fuel} </p>
                </div>
                <div className="col-lg-4">
                    <p><strong>ตรวจสภาพ:</strong> {dataVehicle.inspection_code} </p>
                </div>
                <div className="col-lg-4">
                    <p><strong>ประเภท:</strong> {dataVehicle.vehicle_type_name} </p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-7">
                    <p><strong>ลักษณะ/มาตรฐาน:</strong> {dataVehicle.usage_type} {dataVehicle.usage_type_id}</p>
                </div>

                <div className="col-lg-5">
                    <p><strong>ยี่ห้อ:</strong> {dataVehicle.car_brand} </p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-7">
                    <p><strong>แบบ/รุ่น:</strong> {dataVehicle.model_no} </p>
                </div>

                <div className="col-lg-5">
                    <p><strong>สี:</strong> {dataVehicle.color} </p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-7">
                    <p><strong>เลขตัวรถ:</strong> {dataVehicle.chassis_number} </p>
                </div>

                <div className="col-lg-5">
                    <p><strong>อยู่ที่:</strong> {dataVehicle.chassis_number_location} </p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-4">
                    <p><strong>ยี่ห้อเครื่องยนต์:</strong> {dataVehicle.engine_brand} </p>
                </div>
                <div className="col-lg-5">
                    <p><strong>เลขเครื่องยนต์:</strong> {dataVehicle.engine_no} </p>
                </div>
                <div className="col-lg-3">
                    <p><strong>ที่อยู่:</strong> {dataVehicle.engine_on_location} </p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-2">
                    <p><strong>จำนวนสูบ:</strong> {dataVehicle.cylinders} </p>
                </div>
                <div className="col-lg-2">
                    <p><strong>แรงม้า:</strong> {dataVehicle.engine_power} </p>
                </div>
                <div className="col-lg-2">
                    <p><strong>กิโลวัตต์:</strong> {dataVehicle.power_kw } </p>
                </div>
                <div className="col-lg-2">
                    <p><strong>เพลา:</strong> {dataVehicle.axle_count } </p>
                </div>
                <div className="col-lg-2">
                    <p><strong>ล้อ:</strong> {dataVehicle.wheel_count } </p>
                </div>
                <div className="col-lg-2">
                    <p><strong>ยาง:</strong> {dataVehicle.tire_count } <strong>เส้น</strong> </p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-3">
                    <p><strong>น้ำหนักรถ:</strong> {dataVehicle.veh_weight} </p>
                </div>
                <div className="col-lg-4">
                    <p><strong>จำนวนที่นั่งผู้โดยสาร:</strong> {dataVehicle.passenger_count} </p>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <p><strong>น้ำหนักบรรทุกหรือน้ำหนักลงเพลา:</strong> {dataVehicle.max_load} </p>
                </div>
                <div className="col-lg-4">
                    <p><strong>น้ำหนักรวม:</strong> {dataVehicle.gross_weight} </p>
                </div>
            </div>



            <hr className="mb-2 " />

            <div className="text-center"><strong>เจ้าของรถ</strong></div>
            <div className="row">
                <div className="col-lg-6 text-center">
                    <p><strong>ลำดับ:</strong> {(dataVehicle.document_order)} </p>
                </div>
                <div className="col-lg-6">
                    <p><strong>วันเดือนปี ที่ครอบครอง:</strong> {formatDate(dataVehicle.possession_date)}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <p><strong>ผู้ประกอบการขนส่ง:</strong> {(dataVehicle.operators)}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-9 ">
                    <p><strong>หนังสือสำคัญแสดงการจดทะเบียน/บัตรประจำตัวเลขที่:</strong> {(dataVehicle.reg_doc_number)} </p>
                </div>
                <div className="col-lg-3">
                    <p><strong>สัญชาติ:</strong> {(dataVehicle.nation)}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <p><strong>ที่อยู่:</strong> {(dataVehicle.addr)}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-7 ">
                    <p><strong>ประกอบการขนส่งประเภท:</strong> {(dataVehicle.trans_type)} </p>
                </div>
                <div className="col-lg-5">
                    <p><strong>ใบอนุญาตเลขที่:</strong> {(dataVehicle.license_no)}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-7 ">
                    <p><strong>วันสิ้อายุใบอนุญาต:</strong> {formatDate(dataVehicle.license_expiry)} </p>
                </div>
                <div className="col-lg-5">
                    <p><strong>มีสิทธิครอบครองและใช้รถโดย:</strong> {(dataVehicle.rights_to_use)}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <p><strong>ผู้ถือกรรมสิทธิ์:</strong> {(dataVehicle.owner_name)}</p>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-lg-12">
                    <p><strong>ที่อยู่:</strong> {(dataVehicle.address)}</p>
                </div>
            </div>

            {/* ข้อมูลเพิ่มเติม */}
            <hr className="mb-2" />
            <div className="d-flex justify-content-center position-relative">
                <strong>ข้อมูลเพิ่มเติม</strong>
                <button className="p-0 position-absolute end-0 btn-animated" style={{ color: 'green' }} onClick={() => handleOpenModalEditOther(dataVehicle)}>
                    <i className="bi bi-pencil-square"></i>
                </button>
            </div>
            <div className="row">

                <div className="col-lg-3">
                    <p><strong>ประเภทรถ:</strong> {(dataVehicle.car_type_name)} </p>
                </div>
                <div className="col-lg-3">
                    <p><strong>สถานะ:</strong> {(dataVehicle.status)}</p>
                </div>
                <div className="col-lg-3">
                    <p><strong>สาขาที่ดูแล:</strong> {(dataVehicle.branch_name)}</p>
                </div>
                <div className="col-lg-2">
                {dataVehicle.file_download && dataVehicle.file_download.trim() !== "" && (
                <div className="mb-3" >
                    <a href={dataVehicle.file_download} className="" target="_blank" rel="noopener noreferrer" id="btn-animated" style={{ color: '#c0392b' }}>
                        <i className="bi bi-file-earmark-pdf-fill"></i> ไฟล์เอกสาร
                    </a>
                </div>
            )}
                </div>
            </div>

            {isOpenModalEditVehicle && (
                <Modal_edit_vehicle isOpen={handleOpenModalEditVehicle} onClose={handleCloseModalEditVehicle} dataVehicle={isDataVehicle} />
            )}
    
            {isOpenModalEditOther && (
                <Modal_edit_vehicle_other isOpen={handleOpenModalEditOther} onClose={handleCloseModalEditOther} dataVehicle={isDataVehicle} />
            )}
        </div>
        

    );
}


// พรบ ประกัน
const InsuranceInfo = ({ dataVehicle }) => {
    const [isOpenModalTax, setOpenModalTax] = useState(false);
    const [dataTaxModal, setDataTaxModal] = useState(null);
    const handleOpenModalTax = (data) => {
        setDataTaxModal(data);
        setOpenModalTax(true);
    };
    const handleCloseModalTax = () => {
        setOpenModalTax(false);
    };

    const [isOpenModalCMI, setOpenMoadalCMI] = useState(false);
    const [dataModalCMI, setDataModalCMI] = useState(null);
    const handleOpenModalCMI = (data) => {
        setDataModalCMI(data);
        setOpenMoadalCMI(true);
    };
    const handleCloseModalCMI = () => {
        setOpenMoadalCMI(false);
    };

    const [isOpenModalInsurance, setOpenModaleInsurance] = useState(false);
    const [dataModalInsurance, setDataModalInsurance] = useState(null);
    const handleOpenModalInsurace = (data) => {
        setOpenModaleInsurance(true);
        setDataModalInsurance(data);
    };
    const handleCloseModalInsurance = () => {
        setOpenModaleInsurance(false);
    }

    if (!dataVehicle) return null;

    return (
        <div className="p-2">
            <div className="mb-3">
                <strong>ภาษี</strong> <strong><button className="btn-animated" style={{ color: 'green' }} onClick={()=>handleOpenModalTax((dataVehicle))}><i class="bi bi-pencil-square"></i></button></strong>
                <div className="row">
                    <div className="col-lg-12">
                        <p>
                            <strong>หมดอายุวันที่:</strong> {formatDate(dataVehicle.tax_end)}
                        </p>
                        {getTaxStatusMessage(dataVehicle.tax_end)}
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <strong>พรบ</strong> <strong><button className="btn-animated" style={{ color: 'green' }} onClick={()=>handleOpenModalCMI(dataVehicle)}><i class="bi bi-pencil-square"></i></button></strong>
                <div className="row">
                    <div className="col-lg-4">
                        <p><strong>วันที่เริ่มต้น:</strong> {formatDate(dataVehicle.cmi_start)}</p>
                    </div>
                    <div className="col-lg-6">
                        <p><strong>หมดอายุวันที่:</strong> {formatDate(dataVehicle.cmi_end)} </p>
                        {ActInsuranceStatusMessage(dataVehicle.cmi_end)}
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <strong>ประกันภัย</strong> <strong><button className="btn-animated" style={{ color: 'green' }} onClick={()=>handleOpenModalInsurace(dataVehicle)}><i class="bi bi-pencil-square"></i></button></strong>
                <div className="row">
                    <div className="col-lg-4">
                        <p><strong>วันที่เริ่มต้น:</strong> {formatDate(dataVehicle.insurance_start)}</p>
                    </div>
                    <div className="col-lg-4">
                        <p><strong>หมดอายุวันที่:</strong> {formatDate(dataVehicle.insurance_end)}</p>
                        {InsuranceStatusMessage(dataVehicle.insurance_end)}
                    </div>
                    <div className="col-lg-4">
                        <p><strong>บริษัท:</strong> {(dataVehicle.insurance_name)}</p>
                    </div>
                </div>
            </div>

                {isOpenModalTax && (
                    <Modal_UpdateTex isOpen={isOpenModalTax} onClose={handleCloseModalTax} dataTax={dataTaxModal} />
                )};

                {isOpenModalCMI && (
                    <Modal_UpdateCMI isOpen={isOpenModalCMI} onClose={handleCloseModalCMI} dataCMI={dataModalCMI} />
                )}
                {isOpenModalInsurance && (
                    <Modal_UpdateInsurance isOpen={isOpenModalInsurance} onClose={handleCloseModalInsurance} dataInsurance={dataModalInsurance} />
                )}
        </div>
    );
    // ฟังก์ชันตรวจสอบสถานะภาษี
    function getTaxStatusMessage(taxEndDate) {
        const today = new Date();
        const taxEnd = new Date(taxEndDate);
        const diffDays = (taxEnd - today) / (1000 * 60 * 60 * 24); // คำนวณจำนวนวัน

        if (diffDays < 0) {
            return <p className="text-danger fw-bold">⚠️ ภาษีหมดอายุแล้ว โปรดต่ออายุ</p>;
        } else if (diffDays <= 30) {
            return <p className="text-warning fw-bold">⚠️ ภาษีใกล้หมดอายุ โปรดต่ออายุ</p>;
        } else {
            return <p className="text-success fw-bold">✅ ภาษียังไม่หมดอายุ</p>;
        }
    }
    function ActInsuranceStatusMessage(taxEndDate) {
        const today = new Date();
        const taxEnd = new Date(taxEndDate);
        const diffDays = (taxEnd - today) / (1000 * 60 * 60 * 24); // คำนวณจำนวนวัน

        if (diffDays < 0) {
            return <p className="text-danger fw-bold">⚠️ พรบ.หมดอายุแล้ว โปรดต่ออายุ</p>;
        } else if (diffDays <= 30) {
            return <p className="text-warning fw-bold">⚠️ พรบ.ใกล้หมดอายุ โปรดต่ออายุ</p>;
        } else {
            return <p className="text-success fw-bold">✅ พรบ.ยังไม่หมดอายุ</p>;
        }
    }
    function InsuranceStatusMessage(taxEndDate) {
        const today = new Date();
        const taxEnd = new Date(taxEndDate);
        const diffDays = (taxEnd - today) / (1000 * 60 * 60 * 24); // คำนวณจำนวนวัน

        if (diffDays < 0) {
            return <p className="text-danger fw-bold">⚠️ ประกันภัยหมดอายุแล้ว โปรดต่ออายุ</p>;
        } else if (diffDays <= 30) {
            return <p className="text-warning fw-bold">⚠️ ประกันภัยใกล้หมดอายุ โปรดต่ออายุ</p>;
        } else {
            return <p className="text-success fw-bold">✅ ประกันภัยยังไม่หมดอายุ</p>;
        }
    }
};

// สินเชื่อ
const FinanceInfo = ({ dataVehicle }) => {
    if (!dataVehicle) return null;

    const [financeData, setFinanceData] = useState(null); // เปลี่ยนจาก [] เป็น null
    const id = dataVehicle.reg_id;

    const fetchFinanceInfo = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No access token found");
                return;
            }

            const response = await axios.get(`${apiUrl}/api/autocardetails/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("API Response:", response.data);
            setFinanceData(response.data.length > 0 ? response.data[0] : null); // แสดงเฉพาะข้อมูลแรก ถ้าไม่มีให้เป็น null
        } catch (error) {
            console.error("Error fetching fetchFinanceInfo:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status);
                console.error("Response Data:", error.response.data);
            }
            setFinanceData(null);
        }
    };

    const [isOpenModalAddAutoCar, setOpenModalAutoCar] = useState(false);
    const [dataModalAutuCar, setDataModalAutoCar] = useState(null);
    const handleOpenModaleAutoCer = (data) => {
        setOpenModalAutoCar(true);
        setDataModalAutoCar(data);
    };
    const handleCloseModaleAutoCer = (data) => {
        setOpenModalAutoCar(false);
    };
    const [isOpenModalEditAutoCar, setOpenModalEditAutoCar] = useState(false);
    const [dataModalEditAutuCar, setDataModalEditAutoCar] = useState(null);
    const handleOpenModaleEditAutoCer = (data) => {
        setOpenModalEditAutoCar(true);
        setDataModalEditAutoCar(data);
    };
    const handleCloseModaleEditAutoCer = (data) => {
        setOpenModalEditAutoCar(false);
    };
    useEffect(() => {
        if (id) fetchFinanceInfo();
    }, [id]); // เพิ่ม id เป็น dependency

    return (
        <div>
            {financeData ? (
                <>
                    {/* รายการข้อมูลสินเชื่อรถ */}
                    <div className="d-flex justify-content-center position-relative">
                        <strong>สินเชื่อรถ</strong>
                        {/* ปุ่ม Edit อยู่มุมขวาบน */}
                        <button className="p-0 position-absolute end-0 btn-animated" style={{ color: 'green' }} onClick={()=>handleOpenModaleEditAutoCer(financeData)}>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                    </div>
                    {/* ข้อมูลของสินเชื่อ */}
                    <div className="row mb-2">
                        <div className="col-lg-4">
                            <p><strong>บริษัท:</strong> {financeData.insurance_company}</p>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-lg-4">
                            <p><strong>จำนวนเต็ม:</strong> {financeData.loan_amount} <strong>บาท</strong></p>
                        </div>
                        <div className="col-lg-4">
                            <p><strong>ดอกเบี้ย:</strong> {financeData.interest_rate} <strong>%</strong></p>
                        </div>
                        <div className="col-lg-4">
                            <p><strong>ค่างวดต่อเดือน :</strong> {financeData.monthly_payment} <strong>บาท</strong></p>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-lg-4">
                            <p><strong>วันที่เริ่มต้น:</strong> {formatDate(financeData.start_date)}</p>
                        </div>
                        <div className="col-lg-4">
                            <p><strong>วันที่สิ้นสุด :</strong> {formatDate(financeData.end_date)}</p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <p style={{ color: 'red' }}>ไม่มีข้อมูลสินเชื่อรถ  <strong><button className="link" onClick={()=>handleOpenModaleAutoCer(dataVehicle)}>เพิ่มข้อมูล</button></strong></p>
                </div>
            )}

            {isOpenModalAddAutoCar && (
                <Modal_AddAutoCar isOpen={isOpenModalAddAutoCar} onClose={handleCloseModaleAutoCer} regData={dataModalAutuCar} />
            )}
            {isOpenModalEditAutoCar && (
                <Modal_UpdateAutoCar isOpen={isOpenModalEditAutoCar} onClose={handleCloseModaleEditAutoCer} dataAuto={dataModalEditAutuCar} />
            )}
        </div>

    );
};

// บำรุงรักษา
const MaintenanceInfo = ({dataVehicle}) => {
    if (!dataVehicle) return null;
    return(
        <>
        <div className="p-3">
            <div className="row">
                <div className="col-lg-4">
                <p>เลขไมล์รถ ล่าสุด <strong>000000000</strong> </p>
                </div>
                <div className="col-lg">
                <p>เลขไมล์รวม <strong>000000000</strong> </p>
                </div>
                
            </div>
        </div>
        </>
    )
};

export default CardDetailsVehicle;
