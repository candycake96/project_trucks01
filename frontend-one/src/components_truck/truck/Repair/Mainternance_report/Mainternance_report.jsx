import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Table_mainternance_timeline from "./table/Table_mainternance_timeline";

const Mainternance_report = () => {
  const [activeKey, setActiveKey] = useState("summary");

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">📊 รายงานซ่อมบำรุง</h2>
        <p className="text-muted">สรุปการซ่อมบำรุงรถบรรทุกและอุปกรณ์</p>
      </div>

      {/* Date Filter + Export */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <input type="date" className="form-control d-inline-block me-2" />
          <input type="date" className="form-control d-inline-block" />
        </div>
        <div>
          <button className="btn btn-outline-primary me-2">Export PDF</button>
          <button className="btn btn-outline-success">Export Excel</button>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="summary">📌 สรุปทั้งหมด</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="pm">🛡️ Preventive (PM)</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="cm">⚙️ Corrective (CM)</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Summary */}
          <Tab.Pane eventKey="summary">
            <div className="row g-4 mb-3">
              <div className="col-md-4">
                <div className="card shadow-lg border-0 h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title text-success fw-bold">🛠️ เสร็จแล้ว</h5>
                    <h2 className="fw-bold text-success">128</h2>
                    <p className="text-muted">เดือนนี้</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-lg border-0 h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title text-warning fw-bold">⚡ กำลังทำ</h5>
                    <h2 className="fw-bold text-warning">42</h2>
                    <p className="text-muted">In Progress</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-lg border-0 h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title text-danger fw-bold">❌ ค้างอยู่</h5>
                    <h2 className="fw-bold text-danger">15</h2>
                    <p className="text-muted">ยังไม่ได้เริ่ม</p>
                  </div>
                </div>
              </div>
            </div>
           <Table_mainternance_timeline />
          </Tab.Pane>

          {/* PM */}
          <Tab.Pane eventKey="pm">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-info text-white fw-bold">
                🛡️ Preventive Maintenance (PM)
              </div>
              <div className="card-body p-0">
                <table className="table table-hover table-striped mb-0">
                  <thead className="table-info">
                    <tr>
                      <th>ลำดับ</th>
                      <th>ทะเบียนรถ</th>
                      <th>งาน PM</th>
                      <th>สถานะ</th>
                      <th>วันที่</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>88-1234</td>
                      <td>เปลี่ยนน้ำมันเครื่อง</td>
                      <td><span className="badge bg-success">เสร็จแล้ว</span></td>
                      <td>01/09/2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Tab.Pane>

          {/* CM */}
          <Tab.Pane eventKey="cm">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-warning text-dark fw-bold">
                ⚙️ Corrective Maintenance (CM)
              </div>
              <div className="card-body p-0">
                <table className="table table-hover table-striped mb-0">
                  <thead className="table-warning">
                    <tr>
                      <th>ลำดับ</th>
                      <th>ทะเบียนรถ</th>
                      <th>งาน CM</th>
                      <th>สถานะ</th>
                      <th>วันที่</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>77-5678</td>
                      <td>ซ่อมเบรค</td>
                      <td><span className="badge bg-danger">ค้างอยู่</span></td>
                      <td>03/09/2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default Mainternance_report;
