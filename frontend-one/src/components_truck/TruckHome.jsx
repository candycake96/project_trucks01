import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const TruckHome = () => {

  return (
    // <div className="login-container">
    //         <h1>test Truck</h1>
    // </div>
<Container className="mt-4">
      <h3 className="text-center">Dashboard</h3>
      <Row className="mt-3">
        {/* การ์ดข้อมูลสรุป */}
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
    </Container>
  );
};

export default TruckHome;
