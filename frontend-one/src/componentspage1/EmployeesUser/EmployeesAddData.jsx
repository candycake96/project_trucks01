import axios from "axios";
import React, { useEffect, useState } from "react";
import EmployeeInfoForm from "./EmployeeInfoForm";
import CurrentAddressForm from "./EmployeeAddressForm";
import DriverLicensesForm from "./DriverLicensesForm";
import EmployeePermissionForm from "./EmployeePermissionForm";
import EmployeeFinanceForm from "./EmployeeFinanceForm";
import { apiUrl } from "../../config/apiConfig";

const EmployeesAddData = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [employeeInfo, setEmployeeInfo] = useState({
    code: '',
    date_job: '',
    fname: '',
    lname: '',
    nickname: '',
    identification_number: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    id_position: '',
    id_department: '',
    id_branch: '',
    company_id: '',
    status: 'Active',
    image: null,
    passport: ''
  });

  const [currentAddress, setCurrentAddress] = useState({
    country: '',
    postal_code: '',
    house_number: '',
    street: '',
    city: '',
    province: ''
  });


  const [permanentAddress, setPermanentAddress] = useState({
    country: '',
    postal_code: '',
    house_number: '',
    street: '',
    city: '',
    province: ''
  });

  const [driverLicenses, setDriverLicenses] = useState([{
    license_number: '',
    issued_date: '',
    expiry_date: '',
    license_type: '',
    issuing_authority: '',
    status: 'Active'
  }]);

  const [roles, setRoles] = useState([]);

  const [permissionCode, setPermpssionCode] = useState([]);

  const [salaryMaster, setSalaryMaster] = useState([{
    base_salary: '',
    effective_date: ''
  }]);

  const [socialsecurityMaster, setSocialsecurityMaster] = useState([{
    contribution_rate: '',
    contribution_amount: '',
    effective_date: ''
  }]);

  const [providentFundsMaster, setProvidentFundsMaster] = useState([{
    employee_rate: '',
    employee_contribution: '',
    effective_date: ''
  }]);


  const [activeForm, setActiveForm] = useState('employeeInfo');

  useEffect(() => {
    setActiveForm('employeeInfo');
  }, []);

  const validateForm = () => {
    // Check for required fields
    if (!employeeInfo.fname || !employeeInfo.lname || !employeeInfo.email) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return false;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(employeeInfo.email)) {
      setMessage("Please provide a valid email address.");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form befor
    // .e submitting
    if (!validateForm()) return;

    // Filter driver licenses that have a license number
    const filteredDriverLicenses = driverLicenses.filter(
      (license) => license.license_number && license.license_number.trim() !== ""
    );


    // Prepare FormData
    const formData = new FormData();

    // Append image if present
    if (employeeInfo.image) {
      formData.append('image', employeeInfo.image);
    }

    console.log('Raw permissionCode:', permissionCode);
    console.log('Stringified permissionCode:', JSON.stringify(permissionCode));
    
    // Append other data
    formData.append('employeeInfo', JSON.stringify(employeeInfo));
    formData.append('currentAddress', JSON.stringify(currentAddress));
    formData.append('permanentAddress', JSON.stringify(permanentAddress));
    formData.append('driverLicenses', JSON.stringify(filteredDriverLicenses));
    formData.append('roles', JSON.stringify(roles));
    formData.append('salaryMaster', JSON.stringify(salaryMaster));
    formData.append('socialsecurityMaster', JSON.stringify(socialsecurityMaster));
    formData.append('providentFundsMaster', JSON.stringify(providentFundsMaster));
    formData.append('permissionCode', JSON.stringify(permissionCode));

    // / วิธีดูค่าทั้งหมดใน FormData
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ': ' + pair[1]);
    // }

    // Log the FormData content
    console.log("Form data being submitted:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    console.log("Form data being submitted:", formData);

    try {

      // Post the data to the backend
      const response = await axios.post(
        `${apiUrl}/api/addemployeesdriver`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Handle successful submission
      setMessage(response.data.message || "Data submitted successfully.");
      setMessageType("success");

      // Reset input values after successful submission
      setEmployeeInfo({
        code: '',
        date_job: '',
        fname: '',
        lname: '',
        nickname: '',
        identification_number: '',
        email: '',
        password: '',
        phone: '',
        gender: '',
        id_position: '',
        id_department: '',
        id_branch: '',
        company_id: '',
        status: 'Active',
        image: null,
      });
      setCurrentAddress({
        country: '',
        postal_code: '',
        house_number: '',
        street: '',
        city: '',
        province: ''
      });
      setPermanentAddress({
        country: '',
        postal_code: '',
        house_number: '',
        street: '',
        city: '',
        province: ''
      });
      setDriverLicenses([{
        license_number: '',
        issued_date: '',
        expiry_date: '',
        license_type: '',
        issuing_authority: '',
        status: 'Active'
      }]);
      setRoles([]);


      // Hide message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      // Handle errors
      console.error("Error submitting form:", error);
      setMessage("Failed to add driver license or submit data.");
      setMessageType("error");

      // Hide message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit}>
        <div className="text-center p-3 fs-4">
          <h3>เพิ่มข้อมูลพนักงาน</h3>
        </div>

        <div className="card container mb-3">
          {message && (
            <div className="p-1">
              <div
                className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                style={{
                  backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                  color: messageType === "success" ? "#155724" : "#721c24",
                  border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                }}
              >
                {message}
              </div>
            </div>
          )}

          <div className="card-body">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  type="button"
                  className={activeForm === 'employeeInfo' ? 'nav-link active' : 'nav-link'}
                  onClick={() => setActiveForm('employeeInfo')}
                >
                  ข้อมูลพนักงาน
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={activeForm === 'currentAddress' ? "nav-link active" : 'nav-link'}
                  onClick={() => setActiveForm('currentAddress')}
                >
                  ข้อมูลที่อยู่
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={activeForm === 'driverLicenses' ? 'nav-link active' : 'nav-link'}
                  onClick={() => setActiveForm('driverLicenses')}
                >
                  ข้อมูลใบขับขี่
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={activeForm === 'finance' ? 'nav-link active' : 'nav-link'}
                  onClick={() => setActiveForm('finance')}
                >
                  ข้อมูลการเงิน
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={activeForm === 'permissions' ? 'nav-link active' : 'nav-link'}
                  onClick={() => setActiveForm('permissions')}
                >
                  สิทธิ์การใช้งาน
                </button>
              </li>
            </ul>

            {activeForm === 'employeeInfo' && (
              <EmployeeInfoForm employeeInfo={employeeInfo} setEmployeeInfo={setEmployeeInfo} />
            )}

            {activeForm === 'currentAddress' && (
              <CurrentAddressForm
                currentAddress={currentAddress}
                setCurrentAddress={setCurrentAddress}
                permanentAddress={permanentAddress}
                setPermanentAddress={setPermanentAddress}
              />
            )}

            {activeForm === 'driverLicenses' && (
              <DriverLicensesForm driverLicenses={driverLicenses} setDriverLicenses={setDriverLicenses} />
            )}

            {activeForm === 'permissions' && (
              <EmployeePermissionForm roles={roles} setRoles={setRoles} permissionCode={permissionCode} setPermissionCode={setPermpssionCode} />
            )}

            {activeForm === 'finance' && (
              <EmployeeFinanceForm
                salaryMaster={salaryMaster}
                setSalaryMaster={setSalaryMaster}
                socialsecurityMaster={socialsecurityMaster}
                setSocialsecurityMaster={setSocialsecurityMaster}
                providentFundsMaster={providentFundsMaster}
                setProvidentFundsMaster={setProvidentFundsMaster}
              />
            )}
          </div>
        </div>

        <div className="mb-3 text-center">
          <button type="submit" className="btn Teal-button" >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeesAddData;
