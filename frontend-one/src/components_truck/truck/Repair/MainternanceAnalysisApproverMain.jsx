import React, { useEffect, useState } from "react";
import MainternanceAnalysisApprover from "./MainternanceAnalysisApprover";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";
import MainternanceAnalysisApproverShowEdit from "./MainternanceAnalysisApproverShowEdit";

const MainternanceAnalysisApproverMain = ({ maintenanceJob }) => {
    const [isApproverShowData, setApprovershowData] = useState({ approvers: [] });

    const fetchApproverShowData = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/ananlysis_approver_show_data/${maintenanceJob?.request_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setApprovershowData(response.data);
        } catch (error) {
            console.error("Error fetching approver data:", error);
        }
    };

    useEffect(() => {
        if (maintenanceJob?.request_id) {
            fetchApproverShowData();
        }
    }, [maintenanceJob]);

    return (
        <>
            {isApproverShowData.approvers.length > 0 ? (
                <MainternanceAnalysisApproverShowEdit maintenanceJob={maintenanceJob} isApproverShowData={isApproverShowData} />
            ) : (
                <MainternanceAnalysisApprover maintenanceJob={maintenanceJob}/>
            )}
        </>
    );
};

export default MainternanceAnalysisApproverMain;
