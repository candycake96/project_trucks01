import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";
import Modal_Edit_Approval_End from "./Mobal/Modal_Edit_Approval_End";

const MainternanceApprover_mgr_add = ({ maintenanceJob, hasPermission }) => {

    const [isDataRequestAll, setDataRequestAll] = useState([]);
    const [quotations, setQuotations] = useState([]);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const fetchDataRequestAll = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No access token found");
                return;
            }

            const response = await axios.get(`${apiUrl}/api/approval_shows_id/${maintenanceJob?.request_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDataRequestAll(response.data);
        } catch (error) {
            console.error("Error fetching detailscartype:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status);
                console.error("Response Data:", error.response.data);
            }
        }
    };

    useEffect(() => {
        fetchDataRequestAll();
    }, [maintenanceJob]);

    const dataRequest = isDataRequestAll.length > 0 ? isDataRequestAll[0] : null;

    // ฟังก์ชันแปลงวันที่เป็น dd/mm/yyyy
    function formatDateDMY(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    // ฟังก์ชันแปลงเวลา ISO เป็น HH:MM 
    function formatTimeHM(timeString) {
        if (!timeString) return "-";
        // รองรับทั้ง "HH:MM:SS", "HH:MM" และ "1970-01-01T11:53:00.000Z"
        if (timeString.includes("T")) {
            // กรณีเป็น ISO string
            const date = new Date(timeString);
            if (isNaN(date)) return "-";
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
        }
        // กรณีเป็น HH:MM:SS หรือ HH:MM
        return timeString.length >= 5 ? timeString.substring(0, 5) : timeString;
    }

    const handleApprovalAdd = async (status) => {
        try {
            const payload = {
                request_id: maintenanceJob?.request_id,
                approver_name: `${user?.fname} ${user?.lname}`,
                approval_status: status,
                approval_date: new Date(),
                remark: "", // หรือใส่หมายเหตุจากช่อง input ก็ได้
            };

            const response = await axios.post(
                `${apiUrl}/api/approval_save/${user?.id_emp}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("✅ บันทึกสถานะเรียบร้อยแล้ว");
            } else {
                alert("❌ ไม่สามารถบันทึกสถานะได้");
            }
        } catch (error) {
            console.error("❌ Error:", error);
            alert("เกิดข้อผิดพลาดในการบันทึก");
        }
    };

    const [isOpenModalApprovalEdit, setOpenModalApprovalEdit] = useState(false);
    const [dataModalApprovalEdit, setModalApprovalEdit] = useState(null);
    const handleOpenModaleApprovalEdit = (data) => {
        setOpenModalApprovalEdit(true);
        setModalApprovalEdit(data);
    };
    const handaleCloseModalApprovalEdit = () => {
        setOpenModalApprovalEdit(false);
    }


    const fetchDataQuotationsAll = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No access token found");
                return;
            }

            const response = await axios.get(`${apiUrl}/api/quotation_show_analysis_id/${dataRequest?.analysis_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setQuotations(response.data);
        } catch (error) {
            console.error("Error fetching detailscartype:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status);
                console.error("Response Data:", error.response.data);
            }
        }
    };

    useEffect(() => {
        if (dataRequest?.analysis_id) {
            fetchDataQuotationsAll();
        }
    }, [dataRequest]);



    return (

        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Header */}
                    <div className="card shadow border-0 mb-4">
                        <div className="card-header bg-gradient bg-primary text-white d-flex align-items-center">
                            <i className="bi bi-clipboard2-check-fill fs-4 me-2"></i>
                            <h4 className="mb-0">รายละเอียดใบขออนุมัติซ่อม</h4>
                        </div>
                        <div className="card-body pb-2">
                            <div className="row mb-2">
                                <div className="col-md-4 mb-2"><strong>เลขที่ใบงาน:</strong> <span className="text-primary">{dataRequest ? dataRequest.request_no : "-"}</span></div>
                                <div className="col-md-4 mb-2"><strong>ผู้แจ้ง:</strong> <span>{dataRequest ? dataRequest.request_emp_name : "-"}</span></div>
                                <div className="col-md-4 mb-2"><strong>วันที่แจ้ง:</strong>{dataRequest ? formatDateDMY(dataRequest.request_date) : "-"}</div>
                            </div>
                            {/* <div className="row mb-2">
                                <div className="col-md-6 mb-2"><strong>รายละเอียด:</strong> {maintenanceJob?.description || "-"}</div>
                            </div> */}
                            <div className="row mb-2">
                                <div className="col-md-3 mb-2"><strong>ทะเบียนรถ:</strong> <span>{dataRequest ? dataRequest.reg_number : "-"}</span></div>
                                <div className="col-md-3 mb-2"><strong>เลขไมล์:</strong> {dataRequest ? dataRequest.car_mileage : "-"}</div>
                                <div className="col-md-3 mb-2"><strong>สาขา:</strong> {dataRequest ? dataRequest.branch_name : "-"}</div>
                                <div className="col-md-3 mb-2"><strong>ประเภท:</strong> {dataRequest ? dataRequest.car_type_name : "-"}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-3 mb-2"><strong>ผู้จัดรถ:</strong> {dataRequest ? dataRequest.planning_name : "-"}</div>
                                <div className="col-md-4 mb-2">
                                    <strong>สถานะ:</strong>{" "}
                                    {dataRequest?.planning_vehicle_availability && (
                                        dataRequest.planning_vehicle_availability === 'available' ? (
                                            <span className="badge bg-success bg-gradient px-3 py-2">
                                                <i className="bi bi-check-circle me-1"></i>
                                                รถว่างสามารถเข้าซ่อมได้ทันที
                                            </span>
                                        ) : (
                                            <span className="badge bg-warning bg-gradient px-3 py-2">
                                                <i className="bi bi-clock me-1"></i>
                                                รอคิวซ่อม ({dataRequest.planning_vehicle_availability || "ไม่ระบุผู้วางแผน"})
                                            </span>
                                        )
                                    )}



                                </div>
                                <div className="col-md-4 mb-2"><strong>จะว่างตั้งแต่ วันที่:</strong> {dataRequest ? formatDateDMY(dataRequest.planning_event_date) : "-"} <strong> เวลา:</strong>  {dataRequest ? formatTimeHM(dataRequest.planning_event_time) : "-"} </div>
                                <div className="col-md-4 mb-2"><strong>หมายเหตุ:</strong> {dataRequest ? dataRequest.planning_event_remarke : "-"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Analysis Section */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-gradient bg-info text-white">
                            <i className="bi bi-tools me-2"></i>ความคิดเห็นของแผนกซ่อมบำรุง
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-lg-12 d-flex flex-wrap gap-3">
                                    {dataRequest?.is_pm && (
                                        <span className="badge rounded-pill bg-warning text-dark px-3 py-2">
                                            <i className="bi bi-gear-fill me-1"></i> PM (ซ่อมก่อนเสีย)
                                        </span>
                                    )}
                                    {dataRequest?.is_cm && (
                                        <span className="badge rounded-pill bg-danger px-3 py-2">
                                            <i className="bi bi-exclamation-triangle-fill me-1"></i> CM (เสียก่อนซ่อม)
                                        </span>
                                    )}
                                    {dataRequest?.urgent_repair && (
                                        <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2">
                                            <i className="bi bi-lightning-fill me-1"></i> จำเป็นต้องซ่อมด่วนทันที
                                        </span>
                                    )}
                                    {dataRequest?.inhouse_repair && (
                                        <span className="badge rounded-pill bg-secondary px-3 py-2">
                                            <i className="bi bi-house-gear-fill me-1"></i> แผนกช่างซ่อมเองได้
                                        </span>
                                    )}
                                    {dataRequest?.send_to_garage && (
                                        <span className="badge rounded-pill bg-primary px-3 py-2">
                                            <i className="bi bi-truck-front-fill me-1"></i> ต้องส่งอู่
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4"><strong>ตั้งแต่วันที่:</strong>  {formatDateDMY(dataRequest?.analysis_date) || '-'} <strong>เวลา:</strong>{formatTimeHM(dataRequest?.analysis_time) || '-'}</div>
                                <div className="col-md-4"><strong>เนื่องจาก:</strong>  {dataRequest?.analysis_remark || '-'} </div>
                                <div className="col-md-4"><strong>ราคา:</strong> {dataRequest?.total_with_vat || '-'} </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md"><strong>อู่ / บริษัท:</strong> {dataRequest?.vendor_names_all || '-'} </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4"><strong>ผู้ตรวจสอบ:</strong> {dataRequest?.analysis_emp_name || '-'}  </div>
                                <div className="col-md-4"><strong>วันที่:</strong> {formatDateDMY(dataRequest?.analysis_date) || '-'} </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <strong className="me-1">หัวหน้าแผนกซ่อมบำรุง:</strong>
                                    <span className="me-2">
                                        {dataRequest?.approver_emp_name || '-'}
                                    </span>
                                    {dataRequest?.approval_status === 'approved' ? (
                                        <span className="badge rounded-pill bg-success px-3 py-2">
                                            <i className="bi bi-check-circle me-1"></i> อนุมัติ
                                        </span>
                                    ) : dataRequest?.approval_status === 'rejected' ? (
                                        <span className="badge rounded-pill bg-danger px-3 py-2">
                                            <i class="bi bi-ban"></i> ไม่อนุมัติ
                                        </span>
                                    ) : dataRequest?.approval_status === 'revise' ? (
                                        <span className="badge rounded-pill bg-warning text-dark px-3 py-2">
                                            <i class="bi bi-clock-history"></i> รอการแก้ไข
                                        </span>
                                    ) : (
                                        <span className="badge rounded-pill bg-warning text-dark px-3 py-2">
                                            <i class="bi bi-clock-history"></i> รอการอนุมัติ
                                        </span>
                                    )}

                                </div>
                                <div className="col-md-6"><strong>วันที่:</strong> {formatDateDMY(dataRequest?.approval_date) || '-'} </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <strong className="me-1">ผู้จัดการฝ่ายขนส่งและคลังสินค้า:</strong>
                                    {dataRequest?.approval_status_end === 'อนุมัติ' ? (
                                        <span className="badge rounded-pill bg-success px-3 py-2">
                                            <i className="bi bi-check-circle me-1"></i> อนุมัติ
                                        </span>
                                    ) : dataRequest?.approval_status_end === 'ไม่อนุมัติ' ? (
                                        <span className="badge rounded-pill bg-danger px-3 py-2">
                                            <i class="bi bi-ban"></i> ไม่อนุมัติ
                                        </span>
                                    ) : (
                                        <span className="badge rounded-pill bg-warning text-dark px-3 py-2">
                                            <i class="bi bi-clock-history"></i> รอการอนุมัติ
                                        </span>
                                    )}
                                </div>
                                <div className="col-md-6"><strong>วันที่:</strong> {formatDateDMY(dataRequest?.approval_date_end) || '-'} </div>
                            </div>
                        </div>
                    </div>

                    {/* Quotation Section */}
                    <h5 className="mb-3 text-primary"><i className="bi bi-file-earmark-text me-2"></i>ใบเสนอราคา</h5>
                    {quotations.map((q, idx) => (
                        <div key={q.quotation_id || idx} className="card mb-4 border-0 shadow-sm">
                            {/* Header */}
                            <div className="card-header  d-flex justify-content-between align-items-center " style={{
                                backgroundColor: '#CCCCFF', // #9FE2BF + transparency
                                color: '#000',
                            }}>
                                <div>
                                    <i className="bi bi-shop me-2"></i>
                                    <span className="fw-bold">{q.vendor_name}</span>
                                </div>
                                <div>
                                    <i className="bi bi-calendar-event me-1"></i>
                                    <span>{formatDateDMY(q.quotation_date)}</span>
                                </div>
                            </div>

                            <div className="card-body">
                                {/* Note */}
                                <div className="mb-3 text-secondary">
                                    <i className="bi bi-chat-left-text me-1"></i>
                                    <strong>หมายเหตุ:</strong> {q.note || "-"}
                                </div>

                                {/* Table */}
                                <div className="table-responsive">
                                    <table className="table table-hover table-bordered align-middle mb-0">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>ชื่ออะไหล่</th>
                                                <th>ประเภท</th>
                                                <th className="text-center">จำนวน</th>
                                                <th className="text-center">หน่วย</th>
                                                <th className="text-end">ราคา/หน่วย</th>
                                                <th className="text-end">ส่วนลด</th>
                                                <th className="text-end">VAT%</th>
                                                <th className="text-end">ราคารวม</th>
                                                <th className="text-center">สถานะอนุมัติ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {q.parts?.map((part, pidx) => (
                                                <tr key={part.part_id || pidx}>
                                                    <td>{part.part_name}</td>
                                                    <td>{part.maintenance_type}</td>
                                                    <td className="text-center">{part.part_qty}</td>
                                                    <td className="text-center">{part.part_unit}</td>
                                                    <td className="text-end">{part.part_price.toLocaleString()} บาท</td>
                                                    <td className="text-end">{part.part_discount.toLocaleString()} บาท</td>
                                                    <td className="text-end">{part.part_vat} %</td>
                                                    <td className="text-end">{part.total_price_with_vat.toLocaleString()} บาท</td>
                                                    <td className="text-center">
                                                        {part.is_approved_part !== null && (
                                                            <span
                                                                className={`badge rounded-pill px-3 py-2 ${part.is_approved_part ? "bg-success" : "bg-danger"
                                                                    }`}
                                                            >
                                                                {part.is_approved_part ? (
                                                                    <>
                                                                        <i className="bi bi-check-circle me-1"></i>อนุมัติ
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-x-circle me-1"></i>ไม่อนุมัติ
                                                                    </>
                                                                )}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary Section */}
                                <div className="mt-2 p-3 rounded shadow-sm text-end" style={{ maxWidth: '280px', fontSize: '0.875rem', marginLeft: 'auto' }}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">ราคารวม:</span>
                                        <strong>{q.subtotal.toLocaleString()} บาท</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1 text-primary align-items-center">
                                        <span className="text-muted">
                                            <i className="bi bi-receipt me-1"></i>
                                            VAT {q.quotation_vat ? <span>({q.quotation_vat}%)</span> : null}:
                                        </span>
                                        <strong>{q.total_part_vat.toLocaleString()} บาท</strong>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="d-flex flex-column text-success fw-semibold">
                                        <div className="d-flex justify-content-between">
                                            <span>ราคารวมสุทธิ :</span>
                                            <span>{q.total_price_with_vat_per_parts.toLocaleString()} บาท</span>
                                        </div>
                                        <small className="text-end text-muted">(รวมภาษีแล้ว)</small>
                                    </div>
                                </div>



                            </div>
                        </div>
                    ))}



                    <div className="my-4">
                        <div className="card border-0 shadow-sm bg-light">
                            <div className="card-body d-flex align-items-center">
                                <i className="bi bi-clock-history fs-3 text-primary me-3"></i>
                                <div>
                                    <h6 className="mb-1 fw-bold text-primary">ประวัติการซ่อมรถยนต์คันนี้</h6>
                                    <p className="mb-0 text-secondary" style={{ fontSize: "1rem" }}>
                                        เพื่อโปรดพิจารณา ทั้งนี้รถยนต์คันดังกล่าวมีประวัติการซ่อมดังนี้
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    {hasPermission("MANAGER_APPROVE_REPAIR") && (
                        <div className="text-center mt-4 d-flex justify-content-center gap-3">

                            {/* ✅ กรณีมีผลอนุมัติแล้ว → แสดงปุ่มแก้ไข */}
                            {dataRequest?.approval_status_end ? (
                                <button
                                    className="btn btn-warning btn-lg px-5 shadow"
                                    onClick={() => handleOpenModaleApprovalEdit(dataRequest)}
                                    style={{ color: "#ffffff" }}
                                >
                                    <i className="bi bi-pencil-square me-2"></i>แก้ไข
                                </button>
                            ) : (
                                /* ✅ กรณียังไม่มีผลอนุมัติ → แสดงปุ่มอนุมัติ / ไม่อนุมัติ */
                                <>
                                    <button
                                        className="btn btn-danger btn-lg px-5 shadow"
                                        onClick={() => handleApprovalAdd("ไม่อนุมัติ")}
                                    >
                                        <i className="bi bi-x-circle me-2"></i>ไม่อนุมัติ
                                    </button>

                                    <button
                                        className="btn btn-primary btn-lg px-5 shadow"
                                        onClick={() => handleApprovalAdd("อนุมัติ")}
                                    >
                                        <i className="bi bi-check-circle me-2"></i>อนุมัติ
                                    </button>
                                </>
                            )}

                        </div>
                    )}

                </div>
            </div>

            {/* button  ของ manager approval End  */}
            {isOpenModalApprovalEdit && (
                <Modal_Edit_Approval_End isOpen={isOpenModalApprovalEdit} onClose={handaleCloseModalApprovalEdit} user={user} initialData={dataModalApprovalEdit} />
            )}
        </div>
    );
};

export default MainternanceApprover_mgr_add;