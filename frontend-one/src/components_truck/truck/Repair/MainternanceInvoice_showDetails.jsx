import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Tab, Nav, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import MainternanceInvoice_showEdit from "./MainternanceInvoice_showEdit";
import MainternanceInvoice_showApproval from "./MainternanceInvoice_showApproval";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";


const MainternanceInvoice_showDetaile = () => {
    const location = useLocation();
    const { requestId, invoiceID } = location.state || {};
    const [activeKey, setActiveKey] = useState("detailInvoice");
    const [loading, setLoading] = useState(false);

    const generateInvoiceReport = async () => {
        setLoading(true); // เริ่มโหลด
        try {
            const response = await axios.post(
                `${apiUrl}/api/generate-repair-invoice-repor/${invoiceID}`,
                {},
                { responseType: 'blob' }
            );

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (error) {
            console.error("Error generating report:", error);
        } finally {
            setLoading(false); // โหลดเสร็จ
        }
    };

        const generateReport = async () => {
            setLoading(true); // เริ่มโหลด
            try {
                const response = await axios.post(
                    `${apiUrl}/api/report-createRepair/${requestId}`,
                    {},
                    { responseType: 'blob' }
                );
    
                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(pdfBlob);
                window.open(url, '_blank');
                setTimeout(() => window.URL.revokeObjectURL(url), 10000);
            } catch (error) {
                console.error("Error generating report:", error);
            } finally {
                setLoading(false); // โหลดเสร็จ
            }
        };
    

    return (
        <>
            <div className="container p-3" >
                <div className="mb-3 ">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h5 className="fw-bold text-primary mb-1">ใบแจ้งหนี้ (Invoice) </h5>
                            <p className="text-muted mb-0">
                                รายงานใบแจ้งหนี้
                            </p>
                        </div>
                        <div>
                            <Dropdown as={ButtonGroup}>
                                <Dropdown.Toggle
                                    variant="outline-success"
                                    id="dropdown-basic"
                                    size="sm"
                                >
                                    Job Report <i className="bi bi-printer"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => alert("พิมพ์ แจ้งซ่อม แบบร่าง (Draft)")}>
                                        PDF แจ้งซ่อม แบบร่าง (Draft)
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={generateReport} disabled={loading}>
                                        PDF แจ้งซ่อม แบบลงนาม (Signed)
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={generateReport} disabled={loading}>
                                        PDF ใบแจ้งหนี้ แบบร่าง (Draft)
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={generateInvoiceReport} disabled={loading} >
                                        PDF ใบแจ้งหนี้ แบบลงนาม (Signed)
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                        </div>
                    </div>
                </div>


                <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)} >
                    <Nav variant="tabs" className="mb-3">
                        <Nav.Item>
                            <Nav.Link eventKey="detailInvoice">ใบแจ้งหนี้</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="pm">งานอนุมัติ</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>
                        {/* Summary */}
                        <Tab.Pane eventKey="detailInvoice">
                            <MainternanceInvoice_showEdit requestId={requestId} invoiceID={invoiceID} />
                        </Tab.Pane>

                        {/* PM */}
                        <Tab.Pane eventKey="pm">
                            <MainternanceInvoice_showApproval requestId={requestId} invoiceID={invoiceID} />
                        </Tab.Pane>

                    </Tab.Content>
                </Tab.Container>


            </div>
        </>
    )
}


export default MainternanceInvoice_showDetaile;