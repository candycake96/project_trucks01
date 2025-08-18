import React, { useEffect, useState } from "react";
import MainternanceAnanlysis_Add from "./MainternanceAnalysis_Add";
import MainternanceAnalysis_showEdit from "./MainternanceAnalysis_showsEdit";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";

const MainternanceAnanlysis_ShowDetails = ({ maintenanceJob, hasPermission }) => {
    const [dataAnanlysis, setDataAnanlysis] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnanlysisDetails = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/ananlysis_show_details/${maintenanceJob?.request_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setDataAnanlysis(response.data);
        } catch (error) {
            console.error("Error fetching Ananlysis data:", error);
            setDataAnanlysis(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnanlysisDetails();
        // eslint-disable-next-line
    }, []);

    if (loading) return <div>Loading...</div>;

    // ถ้ามีข้อมูล analysis_id หรือ quotations ให้แสดง showEdit
    const hasAnalysis =
        dataAnanlysis && 
        (
            (Array.isArray(dataAnanlysis) && dataAnanlysis.length > 0) ||
            (dataAnanlysis.analysis_id || (dataAnanlysis.quotations && dataAnanlysis.quotations.length > 0))
        );

    return (
        <div>
            {hasAnalysis ? (
                <MainternanceAnalysis_showEdit maintenanceJob={maintenanceJob} data={dataAnanlysis} hasPermission={hasPermission} />
            ) : (
                <MainternanceAnanlysis_Add maintenanceJob={maintenanceJob} />
            )}
        </div>
    );
};

export default MainternanceAnanlysis_ShowDetails;