import React from "react";

const CarMainRepair = () => {
    return (
        <>
            <div className="container">
                <div className="p-6">
                    <div className="text-center">
                        <div className="mb-3 fs-5 fw-bolder">
                            <p>งานซ่อม</p>
                        </div>
                    </div>

                    <div className="row mb-2">

                        <div className="col-lg-6 ">
                            <div className="card rounded-1" style={{ background: "	#578ebe", color: "#ffffff" }}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <div className="p-1" style={{ background: "#4e80ab" }}>
                                                <p>ยังไม่ได้เปิดงานซ่อม</p>
                                                <p>เปิดงานซ่อมแล้ว</p>
                                            </div>
                                        </div>
                                        <div className="col" style={{ textAlign: "right" }}>
                                            <p className="fs-3">0</p>
                                            <p>เปิดงานซ่อม(แจ้งซ่อม)</p>
                                        </div>
                                    </div>
                                </div>
                                <button style={{ background: "#4d87ba" }}>Viwe </button>
                            </div>
                        </div>

                        <div className="col-lg-6 ">
                            <div className="card rounded-1" style={{ background: "	#8775a7", color: "#ffffff" }}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <div className="p-1" style={{ background: "#796996" }}>
                                                <p>งานซ่อมเดือนที่แล้ว <strong>0</strong></p>
                                                <p>งานซ่อมเดือนนี้ <strong>0</strong></p>
                                            </div>
                                        </div>
                                        <div className="col" style={{ textAlign: "right" }}>
                                            <p className="fs-3">0</p>
                                            <p>งานซ่อมเดือนนี้</p>
                                        </div>
                                    </div>
                                </div>
                                <button style={{ background: "#7f6da1" }}>Viwe </button>
                            </div>
                        </div>

                    </div>

                    <div className="row mb-3">
                        <div className="col-lg-6 ">
                            <div className="card rounded-1" style={{ background: "	#44b6ae", color: "#ffffff" }}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <div className="p-1" style={{ background: "#3da39c" }}>
                                                <p>นัดซ่อมวันนี้ <strong>0</strong></p>
                                                <p>เข้าซ่อมแล้ววันนี้ <strong>0</strong></p>
                                            </div>
                                        </div>
                                        <div className="col" style={{ textAlign: "right" }}>
                                            <p className="fs-3">0</p>
                                            <p>งานซ่อมวันนี้</p>
                                        </div>
                                    </div>
                                </div>
                                <button style={{ background: "#40aca4" }}>Viwe </button>
                            </div>
                        </div>

                        <div className="col-lg-6 ">
                            <div className="card rounded-1" style={{ background: "	#e35b5a", color: "#ffffff" }}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <div className="p-1" style={{ background: "#cc5251" }}>
                                                <p>งานซ่อมวันที่แล้ว <strong>0</strong></p>
                                                <p>งานซ่อมวันนี้ <strong>0</strong></p>
                                            </div>
                                        </div>
                                        <div className="col" style={{ textAlign: "right" }}>
                                            <p className="fs-3">0</p>
                                            <p>ประเมินซ่อมเสร็จวันนี้</p>
                                        </div>
                                    </div>
                                </div>
                                <button style={{ background: "#e14f4e" }}>Viwe </button>
                            </div>
                        </div>

                    </div>

                    <div className="mb-3">
                        <div className="">
                            <button className="btn btn-primary">แจ้งซ่อม</button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>ประเภทรถ</th>
                                    <th>ทะเบียนรถ</th>
                                    <th>เลขไมล์ล่าสุด</th>
                                    <th>เลขไมล์ซ่อมบำรุง</th>
                                    <th>แผนการซ่อมบำรุง</th>
                                    <th className="col-1">แจ้งส่งซ่อม</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CarMainRepair;

