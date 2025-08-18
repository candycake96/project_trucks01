import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import '../Repair/PlanningReqair.css'

const PlanningRepair = ({ maintenanceJob }) => {

    const [planning, setPlanning] = useState({
        request_id: "",
        planning_emp_id: "",
        planning_vehicle_availability: "",
        planning_event_date: "",
        planning_event_time: "",
        planning_event_remarke: ""
    });


    const [user, setUser] = useState(null);  //token
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        if (maintenanceJob && user) {
            setPlanning({
                request_id: maintenanceJob.request_id || "",
                planning_emp_id: user.id_emp || "",
                planning_vehicle_availability: maintenanceJob.planning_vehicle_availability || "",
                planning_event_date: maintenanceJob.planning_event_date || "",
                planning_event_time: maintenanceJob.planning_event_time?.substring(0, 5) || "",  // ตัดเหลือ HH:MM
                planning_event_remarke: maintenanceJob.planning_event_remarke || ""
            });
        }
    }, [maintenanceJob, user]);

    // ⏰ ดึงวันที่และเวลา ณ ขณะนั้น
    const getCurrentDateTime = () => {
        const now = new Date();
        const date = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const time = now.toTimeString().slice(0, 5); // HH:MM (24h)
        return { date, time };
    };

    const handleAvailabilityChange = (e) => {
        const isAvailable = e.target.checked;
        const { date, time } = getCurrentDateTime();
        setPlanning((prev) => ({
            ...prev,
            planning_vehicle_availability: isAvailable ? "available" : "not_available",
            planning_event_date: isAvailable ? date : "",
            planning_event_time: isAvailable ? time : ""
        }));
    };


    const handlePlanningInput = (e) => {
        const { name, value } = e.target;

        if (name === "planning_vehicle_availability") {
            if (value === "available") {
                const { date, time } = getCurrentDateTime();
                setPlanning((prev) => ({
                    ...prev,
                    planning_vehicle_availability: value,
                    planning_event_date: date,
                    planning_event_time: time,
                }));
            } else {
                setPlanning((prev) => ({
                    ...prev,
                    planning_vehicle_availability: value,
                    planning_event_date: "", // clear fields
                    planning_event_time: "",
                }));
            }
        } else {
            setPlanning((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [errorMessage, setErrorMessage] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const tokenData = localStorage.getItem('token');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        if (tokenData) {
            setToken(tokenData);
        }
    }, []);


    const handleSave = async (e) => {
        e.preventDefault();
        try {
            console.log("Token:", token);
            console.log("User:", user);
            console.log("data:", planning);

            // ตรวจสอบว่า request_id และ planning_emp_id มีค่าหรือไม่
            if (!planning.request_id || !planning.planning_emp_id || !planning.planning_vehicle_availability || !planning.planning_event_time) {
                setErrorMessage("กรุณาระบุข้อมูลให้ครบถ้วน");
                return;
            }

            // แปลง request_id ให้เป็นตัวเลข
            const numericRequestId = Number(planning.request_id);

            if (isNaN(numericRequestId)) {
                setErrorMessage("รหัสคำขอไม่ถูกต้อง (ต้องเป็นตัวเลข)");
                return;
            }

            // สร้าง payload ที่จะส่งไป backend
            const response = await axios.post(
                `${apiUrl}/api/planning_add`,
                {
                    request_id: planning.request_id,
                    planning_emp_id: planning.planning_emp_id, // ตรวจชื่อฟิลด์ให้ตรง
                    planning_vehicle_availability: planning.planning_vehicle_availability,
                    planning_event_date: planning.planning_event_date,
                    planning_event_time: planning.planning_event_time,
                    planning_event_remarke: planning.planning_event_remarke
                },
                {
                    headers: {
                        'Content-Type': 'application/json', // ใช้ application/json แทน multipart/form-data ถ้าไม่มีไฟล์
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                }
            );
            console.log("Updated successfully:", response.data);
            setMessage(response.data.message);
            setMessageType("success");
            setErrorMessage("บันทึกข้อมูลเรียบร้อยแล้ว");
            fetchShowDetailPlanning();
            alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");

        } catch (error) {
            console.error("❌ Error occurred:", error);
            setErrorMessage("เกิดข้อผิดพลาด กรุณาลองใหม่");
        }
    };

    const [detailPlanning, setDetailPlanning] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    // แสดงข้อมูลที่มีการบันทึก
    const fetchShowDetailPlanning = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No access token found");
                return;
            }

            const response = await axios.get(`${apiUrl}/api/planning_show_id/${maintenanceJob.request_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDetailPlanning(response.data);
            console.log("📦 detailPlanning:", response.data);
        } catch (error) {
            console.error("Error fetching detailscartype:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status);
                console.error("Response Data:", error.response.data);
            }
        }
    };

    useEffect(() => {
        fetchShowDetailPlanning();
    }, [maintenanceJob]);
    // เซ็ตข้อมูลจาก detailPlanning (ถ้ามี)
    useEffect(() => {
        if (!isEditing && Array.isArray(detailPlanning) && detailPlanning.length > 0) {
            const plan = detailPlanning[0];
            setPlanning({
                request_id: plan.request_id || "",
                planning_emp_id: plan.planning_emp_id || "",
                planning_vehicle_availability: plan.planning_vehicle_availability || "",
                planning_event_date: plan.planning_event_date?.slice(0, 10) || "",  // ใช้ slice(0, 10) แทน
                planning_event_time: plan.planning_event_time ? new Date(plan.planning_event_time).toISOString().substring(11, 16) : "",
                planning_event_remarke: plan.planning_event_remarke || ""
            });
            console.log("Raw time from plan:", plan.planning_event_time);

        }
    }, [detailPlanning, isEditing]);


    const handleCancel = () => {
        if (Array.isArray(detailPlanning) && detailPlanning.length > 0) {
            const plan = detailPlanning[0];
            setPlanning({
                request_id: plan.request_id || "",
                planning_emp_id: plan.planning_emp_id || "",
                planning_vehicle_availability: plan.planning_vehicle_availability || "",
                planning_event_date: plan.planning_event_date || "",
                planning_event_time: plan.planning_event_time?.substring(0, 5) || "",
                planning_event_remarke: plan.planning_event_remarke || ""
            });
        }
        setIsEditing(false);
    };


    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        console.log("Submitting: ", planning);
        setIsEditing(false);
        try {
            const res = await axios.put(
                `${apiUrl}/api/planning_update/${detailPlanning[0]?.planning_id ?? ''}`,
                {
                    request_id: planning.request_id,
                    planning_emp_id: planning.planning_emp_id,
                    planning_vehicle_availability: planning.planning_vehicle_availability,
                    planning_event_date: planning.planning_event_date,
                    planning_event_time: planning.planning_event_time,
                    planning_event_remarke: planning.planning_event_remarke
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                }
            );
            setMessage(res.data.message); // ✅ ใช้ res แทน response
            alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
            setMessageType("success");
            setErrorMessage("บันทึกข้อมูลเรียบร้อยแล้ว");
            fetchShowDetailPlanning();
        } catch (error) {
            console.error("❌ Error occurred:", error);
            setErrorMessage("เกิดข้อผิดพลาด กรุณาลองใหม่");
        }
    };


    const permissions = user?.permission_codes || [];
    const hasPermission = (code) => permissions.includes(code);

    return (
        <>

            {Array.isArray(detailPlanning) && detailPlanning.length > 0 ? (
                <>
                    <div className=" mb-3">
                        <div className="">
                            {console.log("✅ มีข้อมูล detailPlanning:", detailPlanning)}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="mb-0 fw-bold text-dark ">ความเห็นของแผนกจัดรถ</p>
                                {/* สิทธ์เข้าถึงแก้ไขผู้ตรวจสอบ */}

                                {hasPermission("VEHICLE_PAIR_DRIVER_SETTING") && (
                                    Array.isArray(detailPlanning) &&
                                    detailPlanning.length > 0 &&
                                    detailPlanning[0].planning_emp_id === user.id_emp && !isEditing && (
                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            onClick={() => setIsEditing(true)}
                                            style={{ whiteSpace: 'nowrap' }}
                                        >
                                            <i className="bi bi-pencil-fill me-1"></i> แก้ไข
                                        </button>
                                    )
                                )}
                            </div>

                            <form action="" onSubmit={handleSubmitEdit}>
                                <div className="mb-3">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="flex-grow-1 me-3" style={{ minWidth: '200px' }}>
                                            <div className="col-lg-3">
                                                <label htmlFor="reporter" className="form-label mb-1">
                                                    ผู้จัดรถ <strong style={{ color: 'red' }}>*</strong>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="reporter"
                                                    id="reporter"
                                                    value={`${detailPlanning[0]?.fname ?? ''} ${detailPlanning[0]?.lname ?? ''}`}
                                                    className="form-control"
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row ">
                                        <div className="col-lg-3">

                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-3 form-check">
                                                <input
                                                    className="form-check-input no-disable-style"
                                                    type="radio"
                                                    id="availableNow"
                                                    name="planning_vehicle_availability"
                                                    value="available"
                                                    checked={planning.planning_vehicle_availability === "available"}
                                                    onChange={isEditing ? handlePlanningInput : () => { }}
                                                />
                                                <label className="form-check-label" htmlFor="availableNow">
                                                    รถว่างสามารถเข้าซ่อมได้ทันที
                                                </label>
                                            </div>

                                            <div className="col-lg-3 form-check">
                                                <input
                                                    className="form-check-input no-disable-style"
                                                    type="radio"
                                                    id="notAvailable"
                                                    name="planning_vehicle_availability"
                                                    value="not_available"
                                                    checked={planning.planning_vehicle_availability === "not_available"}
                                                    onChange={isEditing ? handlePlanningInput : () => { }}
                                                />
                                                <label className="form-check-label" htmlFor="notAvailable">
                                                    รถไม่ว่าง
                                                </label>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-3">
                                            <label htmlFor="planning_event_date" className="form-label">
                                                วันที่รถว่าง <strong style={{ color: 'red' }}>*</strong>
                                            </label>
                                            <input
                                                type="date"
                                                name="planning_event_date"
                                                id="planning_event_date"
                                                className="form-control"
                                                value={planning?.planning_event_date || ""}
                                                onChange={handlePlanningInput}
                                                disabled={!isEditing}

                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label htmlFor="planning_event_time" className="form-label">
                                                เวลา <strong style={{ color: 'red' }}>*</strong>
                                            </label>
                                            <input
                                                type="time"
                                                name="planning_event_time"
                                                id="planning_event_time"
                                                className="form-control"
                                                value={planning.planning_event_time || ""}
                                                step="60" // เพิ่มให้เลือกเป็นนาที (ไม่ใช่วินาที
                                                onChange={handlePlanningInput}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="col-lg-5">
                                            <label htmlFor="planning_event_remarke" className="form-label">
                                                หมายเหตุ (ถ้ามี)
                                            </label>
                                            <input
                                                type="text"
                                                name="planning_event_remarke"
                                                id="planning_event_remarke"
                                                className="form-control"
                                                value={planning.planning_event_remarke || ""}
                                                placeholder="ระบุเพิ่มเติม เช่น วิ่งงานยังไม่เสร็จสิ้น"
                                                onChange={handlePlanningInput}
                                                disabled={!isEditing}

                                            />
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        {isEditing && (
                                            <>
                                                <button className="btn btn-success" type="submit">
                                                    ยืนยันการจัดรถ

                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary ms-2"
                                                    onClick={handleCancel}
                                                >
                                                    ยกเลิก
                                                </button>

                                            </>
                                        )}

                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </>
            ) : user?.permission_codes.includes('CHECK_REQUEST_CAR') ? (
                <>
                    <div className=" mb-3">
                        <div className="">
                            <div className="">
                                {errorMessage && (
                                    <div className="alert alert-danger text-center" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                {message && (
                                    <div className={`alert alert-${messageType} text-center`} role="alert">
                                        {message}
                                    </div>
                                )}
                            </div>

                            <form action="" onSubmit={handleSave}>
                                <div className="mb-3">
                                    <div className="row ">
                                        <div className="col-lg-3 mb-3 ">
                                            <label htmlFor="reporter" className="form-label">
                                                ผู้จัดรถ <strong style={{ color: 'red' }}>*</strong>
                                            </label>
                                            <input
                                                type="text"
                                                name="reporter"
                                                id="reporter"
                                                value={`${user?.fname ?? ''} ${user?.lname ?? ''}`}
                                                className="form-control"
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-lg-3 form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="availableNow"
                                                    name="planning_vehicle_availability"
                                                    value="available"
                                                    checked={planning.planning_vehicle_availability === "available"}
                                                    onChange={handlePlanningInput}
                                                />
                                                <label className="form-check-label" htmlFor="availableNow">
                                                    รถว่างสามารถเข้าซ่อมได้ทันที
                                                </label>
                                            </div>

                                            <div className="col-lg-3 form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="notAvailable"
                                                    name="planning_vehicle_availability"
                                                    value="not_available"
                                                    checked={planning.planning_vehicle_availability === "not_available"}
                                                    onChange={handlePlanningInput}
                                                />
                                                <label className="form-check-label" htmlFor="notAvailable">
                                                    รถไม่ว่าง
                                                </label>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-3">
                                            <label htmlFor="planning_event_date" className="form-label">
                                                วันที่รถว่าง <strong style={{ color: 'red' }}>*</strong>
                                            </label>
                                            <input
                                                type="date"
                                                name="planning_event_date"
                                                id="planning_event_date"
                                                className="form-control"
                                                value={planning?.planning_event_date || ""}
                                                onChange={handlePlanningInput}
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label htmlFor="planning_event_time" className="form-label">
                                                เวลา <strong style={{ color: 'red' }}>*</strong>
                                            </label>
                                            <input
                                                type="time"
                                                name="planning_event_time"
                                                id="planning_event_time"
                                                className="form-control"
                                                value={planning.planning_event_time}
                                                step="60" // เพิ่มให้เลือกเป็นนาที (ไม่ใช่วินาที
                                                onChange={handlePlanningInput}
                                            />
                                        </div>
                                        <div className="col-lg-5">
                                            <label htmlFor="planning_event_remarke" className="form-label">
                                                หมายเหตุ (ถ้ามี)
                                            </label>
                                            <input
                                                type="text"
                                                name="planning_event_remarke"
                                                id="planning_event_remarke"
                                                className="form-control"
                                                value={planning.planning_event_remarke}
                                                placeholder="ระบุเพิ่มเติม เช่น วิ่งงานยังไม่เสร็จสิ้น"
                                                onChange={handlePlanningInput}
                                            />
                                        </div>
                                    </div>

                                    {hasPermission("ADD_READY_CHECK") && (
                                        <div className="text-center">
                                            <button className="btn btn-primary" type="submit">
                                                ยืนยันการจัดรถ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>


                </>
            ) : (
                null
            )}


        </>
    )
}


export default PlanningRepair;