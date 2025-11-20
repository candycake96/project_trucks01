import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const TruckHome = () => {

  return (
    // <div className="login-container">
    //         <h1>test Truck</h1>
    // </div>
  <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
{/* <Container className="mt-4">
      <h3 className="text-center">Dashboard</h3>
      <Row className="mt-3">

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>จำนวนผู้ใช้งาน</Card.Title>
              <Card.Text>150 คน</Card.Text>
              <Button variant="primary">ดูรายละเอียด</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>รายการรอดำเนินการ</Card.Title>
              <Card.Text>5 รายการ</Card.Text>
              <Button variant="warning">ดูรายการ</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>แจ้งเตือน</Card.Title>
              <Card.Text>3 รายการ</Card.Text>
              <Button variant="danger">ดูแจ้งเตือน</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container> */}

      
      <div className="text-center p-4 shadow-sm rounded-3 bg-white">
        {/* Illustration */}
        <div className="mb-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png"
            alt="welcome"
            width={120}
          />
        </div>

        {/* ข้อความต้อนรับ */}
        <h2 className="fw-bold mb-2">ยินดีต้อนรับสู่ระบบซ่อมบำรุง!</h2>

        {/* ข้อความแนวทาง / แนะนำ */}
        <p className="text-muted mb-3">
          ที่นี่คุณสามารถจัดการงานซ่อมและบำรุงรถของคุณได้อย่างง่ายดาย
        </p>

        {/* ปุ่ม Quick Action */}
        <button className="btn btn-primary btn-lg">
          ➕ เริ่มเพิ่มงานซ่อม
        </button>
      </div>
    </div>

  );
};

export default TruckHome;
