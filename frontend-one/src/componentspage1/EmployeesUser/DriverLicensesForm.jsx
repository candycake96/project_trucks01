import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../config/apiConfig';

const DriverLicensesForm = ({ driverLicenses, setDriverLicenses }) => {
    const [drivingLicenseTypes, setDrivingLicenseTypes] = useState([]);

    const fetchDrivingLicenseTypes = async () => {
        try {
            const response = await axios.get(
            `${apiUrl}/api/getdrivinglicensetypes`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setDrivingLicenseTypes(response.data);
        } catch (error) {
            console.error("Error fetching license types:", error);
        }
    };

    useEffect(() => {
        fetchDrivingLicenseTypes();
    }, []);

    const addDriverLicenseForm = () => {
        setDriverLicenses([
            ...driverLicenses,
            {
                license_number: '',
                issued_date: '',
                expiry_date: '',
                license_type: '',
                issuing_authority: ''
            },
        ]);
    };

    const removeDriverLicenseForm = (index) => {
        const updatedLicenses = driverLicenses.filter((_, i) => i !== index);
        setDriverLicenses(updatedLicenses);
    };

    const updateDriverLicense = (index, field, value) => {
        const updatedLicenses = [...driverLicenses];
        updatedLicenses[index][field] = value;
        setDriverLicenses(updatedLicenses);
    };

    return (
        <div>
            <div className="mb-3">
                <button
                    type="button"
                    className="btn" 
                    style={{background: "#20c997"}}
                    onClick={addDriverLicenseForm}
                >
                    <i className="bi bi-plus-lg"></i> เพิ่มข้อมูลใบขับขี่
                </button>
            </div>
            {driverLicenses.map((license, index) => (
                <div key={index} className='mb-3'>
                    <h5>ใบขับขี่ที่ {index + 1}</h5>
                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <label className="form-label">รหัสใบขับขี่ <span style={{ color: "red" }}> *</span></label>
                            <input
                                type="text"
                                className="form-control"
                                value={license.license_number}
                                onChange={(e) =>
                                    updateDriverLicense(index, 'license_number', e.target.value)
                                }
                                placeholder="License number"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 mb-3">
                            <label className="form-label">วันที่ออกใบขับขี่ <span style={{ color: "red" }}> *</span></label>
                            <input
                                type="date"
                                className="form-control"
                                value={license.issued_date}
                                onChange={(e) =>
                                    updateDriverLicense(index, 'issued_date', e.target.value)
                                }
                            />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label className="form-label">วันที่หมดอายุใบขับขี่ <span style={{ color: "red" }}> *</span></label>
                            <input
                                type="date"
                                className="form-control"
                                value={license.expiry_date}
                                onChange={(e) =>
                                    updateDriverLicense(index, 'expiry_date', e.target.value)
                                }
                            />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label className="form-label">ประเภทใบขับขี่ <span style={{ color: "red" }}> *</span></label>
                            <select
                                className="form-select"
                                value={license.license_type}
                                onChange={(e) =>
                                    updateDriverLicense(index, 'license_type', e.target.value)
                                }
                            >
                                <option value="">กรุณาเลือกประเภทใบขับขี่ <span style={{ color: "red" }}> *</span></option>
                                {drivingLicenseTypes.map((LType) => (
                                    <option key={LType.license_type_id} value={LType.license_type_id}>
                                        {LType.license_code} {LType.license_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">หน่วยงานที่ออกใบขับขี่ <span style={{ color: "red" }}> *</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={license.issuing_authority}
                            onChange={(e) =>
                                updateDriverLicense(index, 'issuing_authority', e.target.value)
                            }
                            placeholder="Issuing authority"
                        />
                    </div>
                    <div className="text-end mb-3">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeDriverLicenseForm(index)}
                            style={{background: "#dc3545"}}
                        >
                          <i className="bi bi-trash-fill"></i>  ลบใบขับขี่
                        </button>
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default DriverLicensesForm;
