import React, { useEffect, useState } from "react";
import './CompanyManagement.css';
import axios from "axios";
import Modal_Company_add from "./modal/Modal_Company_Add";
import Modal_Company_Edit from "./modal/Modal_Company_Edit";
import { apiUrl } from "../../config/apiConfig";

const Company = ({user, CompanyID}) => {
    const [isCompany, setCompany] = useState([]);
    const [modalOpenCompany, setModalOpenCompany] = useState(false);
    const [modalOpentCompanyEdit, setModalOpenCompanyEdit] = useState(false);
    const [dataModalCompanyEdit, setDataModalCompanyEdit] = useState(null);
    const handleOpenModalCompanyEdit = (dataModal) => {
        setModalOpenCompanyEdit(true);
        setDataModalCompanyEdit(dataModal)
    }
    const handleCloseModalCompanyEdit = () => {
        setModalOpenCompanyEdit(false);
    }

    const handleOpenModalCompany = () => {
        setModalOpenCompany(true);
    }

    const handleCloseModalCompany = () => {
        setModalOpenCompany(false);
    }

    const fetchCompanyShowAll = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token found");
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}/api/getcompanyid/${CompanyID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("API Response:", response.data); // ✅ ตรวจสอบ Response
            setCompany(response.data);

          } catch (error) {
            console.error("Error fetching employee details:", error);
          }
    }

    useEffect(() => {
        fetchCompanyShowAll();
    }, []);
    return (
<>
        <div className="">

            {isCompany && isCompany.length > 0 ? (
                <> 
                    {isCompany.map((rowCompany, index) => (
                        <div className="card mb-3 rounded-0 shadow-sm "  key={index}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <p className="fs-5 fw-normal">ข้อมูลหน่วยงาน</p>
                                    </div>
                                    <div className="col-lg-6 d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button className="btn md-flex Edit-button " onClick={() => handleOpenModalCompanyEdit(rowCompany)} >
                                        <i class="bi bi-building-fill-gear"></i> แก้ไข
                                            </button>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-2">
                                        <img src={rowCompany.company_logo} alt="Company Logo" />
                                    </div>
                                    <div className="col-lg-9">
                                        <p className="fs-4 fw-bolder mb-2">{rowCompany.company_name}</p>
                                        <p className="">{rowCompany.company_address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className="md-3">
                    <div className="text-center">
                        <p className="fw-bolder fs-4">ไม่พบข้อมูล</p>
                    </div>
                </div>
            )}
        </div>

        {modalOpenCompany && (
            <Modal_Company_add 
            isOpen = {modalOpenCompany}
            onClose = {handleCloseModalCompany}
            />
        )}
        {modalOpentCompanyEdit && dataModalCompanyEdit && (
            <Modal_Company_Edit isOpen={modalOpentCompanyEdit} onClose={handleCloseModalCompanyEdit} dataCompany={dataModalCompanyEdit}/>
        )}
        </>
    )
}

export default Company;