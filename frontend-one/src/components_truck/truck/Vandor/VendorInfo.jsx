import React from "react";
import { Link } from "react-router-dom";

const VendorInfo = () => {

    return (
        <>
            <div className="container">
                <div className="p-3">
                    <div className="mb-3">

                        <div className="mb-2">
                            <p className="fw-bolder fs-4">ข้อมูลผู้จำหน่ายสินค้า / อู่ซ่อม</p>
                        </div>

                        <div className="mb-1">
                            <nav aria-label="breadcrumb" style={{ color: '#0000FF' }}>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/truck">หน้าแรก</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/truck/Vendor">ผู้จำหน่ายสินค้า อู่ซ่อม (ทั้งหมด)</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        ข้อมูลผู้จำหน่ายสินค้า (อู่ซ่อม)
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        <div className="mb-3">
                            <hr />
                        </div>
                        <div className="mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="mb-3">
                                        <p> <i class="bi bi-briefcase-fill"></i> ชื่อร้าน / อู่ซ่อม / ผู้ประกอบการ :</p>
                                    </div>
                                    <div className="mb-3">
                                        <p>คะแนนการใช้บริการ</p>
                                        <p>⭐⭐⭐⭐⭐ X%</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>


                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <p className="fw-bolder">  ประวัติงานสั่งซื้อ / งานซ่อม </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default VendorInfo;