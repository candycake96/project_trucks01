import React from "react";
import ReactModal from "react-modal";

const Modal_vehicle_book = ({ isOpen, onClose, children, title, dataTruck }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel={title || "Modal"}
            style={{
                content: {
                    width: "90%",             // กว้าง 90% ของหน้าจอ
                    maxWidth: "850px",        // สูงสุดบน Desktop
                    maxHeight: "390px",        // สูงสุด 90% ของ viewport
                    margin: "auto",
                    padding: "20px",
                    borderRadius: "0.5rem",
                    overflowY: "auto",        // scroll ถ้า content ยาว
                },
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px",          // เว้นขอบเล็กน้อยบนมือถือ
                },
            }}
        >
            {/* Header */}
            <div className="">
                <div className="row">
                    <div className="col-lg-7 mb-3">
                        {dataTruck?.file_download ? (
                            dataTruck.file_download.endsWith(".pdf") ? (
                                <iframe
                                    src={dataTruck.file_download}
                                    title="PDF Document"
                                    style={{ width: "100%", height: "350px", border: "none" }}
                                ></iframe>
                            ) : (
                                <img
                                    src={dataTruck.file_download}
                                    alt="Vehicle"
                                    className="img-fluid rounded shadow-sm"
                                    style={{ width: "100%", maxHeight: "350px", objectFit: "contain" }}
                                />
                            )
                        ) : (
                            <div className="text-center text-muted border rounded py-5">
                                ไม่มีไฟล์
                            </div>
                        )}
                    </div>

                    <div className="col-lg-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0 fw-border">{title || "สเปครถ"}</h5>
                            <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <table className="table table-striped">
                            <tr >
                                <td className="text-start col-1" ><i class="bi bi-car-front-fill"></i></td>
                                <td className="text-start">ประเภทรถ</td>
                                <td className="text-end">111</td>
                            </tr>
                            <tr>
                                <td><i class="bi bi-card-checklist"></i></td>
                                <td>ยี่ห้อ</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><i class="bi bi-card-checklist"></i></td>
                                <td>รุ่น</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><i class="bi bi-card-checklist"></i></td>
                                <td>ปี</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><i class="bi bi-card-checklist"></i></td>
                                <td>ขนาดเครื่องยนต์</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><i class="bi bi-card-checklist"></i></td>
                                <td>ระบบเกียร์</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><i class="bi bi-card-checklist"></i></td>
                                <td>จำนวนที่นั่ง</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><i class="bi bi-card-checklist"></i></td>
                                <td>สี</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><i class="bi bi-card-checklist"></i></td>
                                <td>ยี่ห้อ</td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            {/* Content */}
            <div>{children}</div>
        </ReactModal>
    );
};

export default Modal_vehicle_book;
