import React from "react";
import { Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const Vehicle_pm_start = () => {
    return (
        <>
            <div className="container p-3">
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h4 className="fw-bold text-primary">จัดการข้อมูลรถ PM</h4>
                            <small className="text-muted">
                                จัดการข้อมูลรถประวัติการทำ PM
                            </small>
                        </div>
                        <div className="">
                            <Button as={Link} to="" className="me-1">ลงทะเบียนรถเพื่อเริ่มต้น PM</Button>                         
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default Vehicle_pm_start;