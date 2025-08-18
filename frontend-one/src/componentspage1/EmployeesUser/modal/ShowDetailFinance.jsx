import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../config/apiConfig";

const ShowDetailFinance = ({ emp, onEdit }) => {
    if (!emp) return null; // ตรวจสอบค่าเพื่อไม่ให้เกิด error
    const id = emp.id_emp;
    
    const [salaries, setSalaries] = useState([]);
    const [socialSecurity, setSocialSecurity] = useState([]);
    // สมมติว่าในอนาคตถ้ามีข้อมูลกองทุนสำรองเลี้ยงชีพแยกต่างหาก ก็สามารถเพิ่ม state ใหม่ได้ เช่น:
    // const [providentFund, setProvidentFund] = useState([]);

    // ดึงข้อมูลเงินเดือน
    const fetchSalaries = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/getFinanceSalaries/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setSalaries(response.data);
        } catch (error) {
            console.error("Error fetching salaries:", error);
        }
    };

    // ดึงข้อมูลประกันสังคม (หรือข้อมูลที่เกี่ยวข้อง)
    const fetchSocialSecurity = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/get_social_security/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setSocialSecurity(response.data);
        } catch (error) {
            console.error("Error fetching social security:", error);
        }
    };

    useEffect(() => {
        fetchSalaries();
        fetchSocialSecurity();
    }, [id]);

    // ฟังก์ชันแปลงวันที่
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="">
            {salaries.map((row) => (
                <div key={row.salary_id}>
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="col-4 fw-bold">เงินเดือน</div>
                            <button 
                                style={{ color: '#008000', border: 'none', background: 'transparent' }} 
                                onClick={() => onEdit(row)}
                            >
                                <i className="bi bi-pencil-square"></i> แก้ไข
                            </button>
                        </div>
                        <div className="mb-3">
                            <div className="row">
                                <div className="col-lg-4">
                                    <p>จำนวนเงิน: {row.base_salary}</p>
                                </div>
                                <div className="col-lg-5">
                                    วันที่เริ่มต้นหัก: {formatDate(row.effective_date)}
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            ))}

            {socialSecurity.map((row) => (
                <div key={row.social_security_id}>
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="col-4 fw-bold">ประกันสังคม</div>
                            <button 
                                style={{ color: '#008000', border: 'none', background: 'transparent' }} 
                                onClick={() => onEdit(row)}
                            >
                                <i className="bi bi-pencil-square"></i> แก้ไข
                            </button>
                        </div>
                        <div className="mb-3">
                            <div className="row">
                                <div className="col-4">
                                    <p>จำนวนเงินที่หัก: {row.contribution_amount}</p>
                                </div>
                                <div className="col-3">
                                    อัตราการหัก: {/* แทรกข้อมูลอัตราการหักถ้ามี */}
                                </div>
                                <div className="col-4">
                                    วันที่เริ่มต้น: {formatDate(row.effective_date)}
                                </div>
                            </div>                                
                        </div>
                    </div>
                </div>
            ))}

            {/* หากมีข้อมูลกองทุนสำรองเลี้ยงชีพที่แตกต่างจาก socialSecurity สามารถ render ที่นี่ */}
            {socialSecurity.map((row) => (
                <div key={`${row.social_security_id}-pf`}>
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="col-4 fw-bold">กองทุนสำรองเลี้ยงชีพ</div>
                            <button 
                                style={{ color: '#008000', border: 'none', background: 'transparent' }} 
                                onClick={() => onEdit(row)}
                            >
                                <i className="bi bi-pencil-square"></i> แก้ไข
                            </button>
                        </div>
                        <div className="mb-3">
                            <div className="row">
                                <div className="col-4">
                                    <p>จำนวนเงินที่หัก: {row.contribution_amount}</p>
                                </div>
                                <div className="col-4">
                                    อัตราการหัก: {/* แทรกข้อมูลอัตราการหักถ้ามี */}
                                </div>
                                <div className="col-4">
                                    วันที่เริ่มต้นหัก: {formatDate(row.effective_date)}
                                </div>
                            </div>                                
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShowDetailFinance;
