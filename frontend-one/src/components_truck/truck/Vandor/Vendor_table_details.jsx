import React, { useEffect, useState } from "react";
import Modal_vandor_details from "./modal/Modal_vandor_details";
import { apiUrl } from "../../../config/apiConfig";
import axios from "axios";
import Modal_vendor_edit from "./modal/Modal_vendor_edit";
import { Link } from "react-router-dom";

const Vendor_table_details = ({ refresh }) => {
    // ข้อมูล
    const [isOpenModalVendorDetails, setOpenModalVendorDetails] = useState(false);
    const [isVendorID, setVendorID] = useState(null);
    // แก้ไข
    const [isOpenModalVendorEdit, setOpenModalVendorEdit] = useState(false);
    const [isDataVendorEdit, setDataVendorEdit] = useState(null);
    // 
    const [isShowDataVendor, setShowDataVender] = useState([]);

    const fetchVendorShowData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/vendor_show`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setShowDataVender(response.data);
        } catch (error) {
            console.error("Error fetching coverage type:", error);
        }
    };

    useEffect(() => {
        fetchVendorShowData();
    }, [refresh]);

// ข้อมูล 
    const handleOpenModalVandorDetails = (data) => {
        setVendorID(data);        
        setOpenModalVendorDetails(true);
    };
    const handleCloseModalVandorDetails = () => {
        setOpenModalVendorDetails(false);
    };
// แก้ไข
    const handOpenModalVendorEdit = (data) => {
        setOpenModalVendorEdit(true);
        setDataVendorEdit(data);
    };
    const handClossModalVendorEdit = () => {
        setOpenModalVendorEdit(false);
    }


    return (
        <div className="card">
            <div className="card-body">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>รายชื่ออู่/ร้าน/บริษัท</th>
                            <th>โทร</th>
                            <th>เงื่อนไขเครดิต</th>
                            <th>ลักษณะประกอบการ</th>
                            <th><i className="bi bi-file-text-fill"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isShowDataVendor.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.vendor_name}</td>
                                <td>{row.phone}</td>
                                <td>{row.credit_terms} วัน</td>
                                <td>{row.organization_type_name}</td>
                                <td>{row.vendor_id}</td>
                                <td>
                                <button className="btn btn-sm btn-outline-primary rounded-circle me-1" onClick={()=>handOpenModalVendorEdit(row)} >
                                <i class="bi bi-pencil-square"></i>{/* เปลี่ยนไอคอนเพื่อแยกความต่างก็ได้ */}
                                    </button>
                                    <button className="btn btn-sm btn-outline-primary rounded-circle me-1" onClick={()=>handleOpenModalVandorDetails(row)}>
                                        <i className="bi bi-file-text-fill"></i>
                                    </button>
                                    <Link to='/truck/VendorInfo' className="btn btn-sm btn-outline-primary rounded-circle me-1" >
                                    <i className="bi bi-box-arrow-up-right"></i>{/* เปลี่ยนไอคอนเพื่อแยกความต่างก็ได้ */}
                                    </Link>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isOpenModalVendorDetails && (
                <Modal_vandor_details
                    isOpen={isOpenModalVendorDetails}
                    onClose={handleCloseModalVandorDetails}
                    vendorID={isVendorID}
                />
            )}
            {isOpenModalVendorEdit && (
                <Modal_vendor_edit  
                isOpen={isOpenModalVendorEdit}
                onClose={handClossModalVendorEdit}
                isData={isDataVendorEdit}
                />
            )}
        </div>
    );
};

export default Vendor_table_details;
