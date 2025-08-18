import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { saveAs } from "file-saver";
import { apiUrl } from "../../../config/apiConfig";

function ExcelUploader() {
    const [file, setFile] = useState(null);
    const [excelData, setExcelData] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    // ฟังก์ชันแปลง Serial Number เป็น Date
    const convertExcelDate = (serial) => {
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        return new Date(utc_value * 1000).toISOString().split("T")[0];
    };

    useEffect(() => {
        if (file) {
            handleFileUpload();
        }
    }, [file]);

    const handleFileUpload = () => {
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const binaryStr = reader.result;
                const workbook = XLSX.read(binaryStr, { type: "binary" });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json(sheet);

                const updatedData = jsonData.map((row) => ({
                    ...row,
                    recorded_date: typeof row.recorded_date === "number"
                        ? convertExcelDate(row.recorded_date)
                        : row.recorded_date,
                    emp_id: user ? user.id_emp : null
                }));

                console.log("Updated Data:", updatedData); // Check the updated data in console

                setExcelData(updatedData);
                console.log("Excel Data State:", updatedData); // Check the state of excelData
            };

            reader.readAsBinaryString(file);
        } else {
            alert("กรุณาเลือกไฟล์ก่อน");
        }
    };

    const sendDataToBackend = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/mileage_excel_uploader`, {
                data: excelData,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            alert("ข้อมูลถูกส่งไปที่ Server สำเร็จ!");
            setExcelData([]);
            setFile(null);
        } catch (error) {
            console.error("Error uploading data:", error);
            alert("เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง Server");
        }
    };

    const cleanData = excelData.map(({ emp_id, salary, ...rest }) => rest); // 🔹 ลบ id_emp และ salary

    return (
        <div className="container p-3">
            <div className="row">
                <div className="col-lg-12">
                    <div className="mb-3">
                        <label htmlFor="fileUpload" className="form-label fw-bold">
                            อัปโหลดไฟล์ Excel <strong>  </strong>
                            <strong><button className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" onClick={downloadTemplate}>
                        📥 ดาวน์โหลดไฟล์ตัวอย่าง
                    </button></strong>
                        </label>
                        <input
                            type="file"
                            id="fileUpload"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            </div>

            {excelData.length > 0 && (
                <div className="">
                    <h3>ข้อมูลที่แปลงแล้ว:</h3>
                    <table border="1" className="table table-striped">
                        <thead>
                            <tr>
                                {Object.keys(cleanData[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cleanData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, idx) => (
                                        <td key={idx}>{value !== undefined ? value : "null"}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
<div className="text-center">
  <button className="btn btn-mileage" onClick={sendDataToBackend}>บันทึก</button>   
</div>
                   
                </div>
            )}
        </div>
    );
}

const downloadTemplate = () => {
    const headers = [
        ["reg_number", "recorded_date", "odometer", "notes", "status"]
    ];

    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(data, "Excel_Template.xlsx");
};

export default ExcelUploader;
