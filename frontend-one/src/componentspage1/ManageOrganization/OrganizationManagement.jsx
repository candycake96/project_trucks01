import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Company from "./Company";
import Branch from "./Branch";
import Department from "./Department";
import JobPosition from "./JobPosition";

const OrganizationMenagement = () => {
    const location = useLocation();
    const receivedData = location.state;

    const [user, setUser] = useState(null);
    const [userCompanyID, setUserCompanyID] = useState(null);

    // โหลดข้อมูล user จาก localStorage
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const userObject = JSON.parse(userData);
            console.log("User Data from localStorage:", userObject);
            setUser(userObject);
        }
    }, []);

    
    // ตั้งค่า userCompanyID ตามลำดับความสำคัญ
    useEffect(() => {
        console.log("Received Data:", receivedData);

        if (receivedData?.company_id) {
            setUserCompanyID(receivedData.company_id);
            console.log("Setting userCompanyID from receivedData:", receivedData.company_id);
        } else if (user && user.company_id) {
            setUserCompanyID(user.company_id);
            console.log("Setting userCompanyID from user:", user.company_id);
        }
    }, [receivedData, user]);

    console.log("Final userCompanyID:", userCompanyID);

    if (!userCompanyID) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container p-2">
            {/* <p>Received Company ID: {receivedData?.company_id}</p>
            <p>User Company ID: {userCompanyID}</p> */}

            <Company user={user} CompanyID={userCompanyID} />
            <div className="row">
                <div className="col-lg-6">
                    <div className="mb-3">
                        <Branch user={user} CompanyID={userCompanyID} />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="mb-3">
                        <Department user={user} CompanyID={userCompanyID} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="mb-3 col-lg-6">
                    <JobPosition user={user} CompanyID={userCompanyID} />
                </div>
            </div>
        </div>
    );
};

export default OrganizationMenagement;
