import React from "react";

const EmployeeFinanceFrom = ({ salaryMaster, setSalaryMaster, socialsecurityMaster, setSocialsecurityMaster, providentFundsMaster, setProvidentFundsMaster }) => {


    return (
        <>
            <div className="">
                <div className="p-3">
                    <p className="mb-2 fw-bold">เงินเดือน  <span style={{ color: "red" }}> *</span> </p>
                    <div className="row g-3  align-items-center">
                        <div className="col-auto">
                            <label htmlFor="base_salary" className="col-form-label">จำนวนเงิน </label>
                        </div>
                        <div className="col-auto">
                            <input
                                id="base_salary" type="text" className="form-control" placeholder="000.0"
                                value={salaryMaster.base_salary}
                                onChange={(e) => setSalaryMaster({ ...salaryMaster, base_salary: e.target.value })}
                            />
                        </div>
                        <div className="col-auto">
                            <label htmlFor="effective_date" className="col-form-label" >วันที่เริ่มต้น </label>
                        </div>
                        <div className="col-auto">
                            <input
                                id="effective_date" type="date" className="form-control" placeholder="0%"
                                value={salaryMaster.effective_date}
                                onChange={(e) => setSalaryMaster({ ...salaryMaster, effective_date: e.target.value })}
                            />
                        </div>
                    </div>
                </div>



                <div className="p-3">
                    <p className="mb-2 fw-bold">
                        ประกันสังคม
                    </p>
                    <div className="row g-3  align-items-center">
                        <div className="col-auto">
                            <label htmlFor="contribution_amount" className="col-form-label">จำนวนเงินที่หัก </label>
                        </div>
                        <div className="col-auto">
                            <input
                                id="contribution_amount" type="text" className="form-control" placeholder="000.0"
                                value={socialsecurityMaster.contribution_amount}
                                onChange={(e) => setSocialsecurityMaster({ ...socialsecurityMaster, contribution_amount: e.target.value })}
                            />
                        </div>
                        <div className="col-auto">
                            <label htmlFor="contribution_rate" className="col-form-label" >อัตราการหัก % </label>
                        </div>
                        <div className="col-auto">
                            <input
                                id="contribution_rate" type="text" className="form-control" placeholder="0"
                                value={socialsecurityMaster.contribution_rate}
                                onChange={(e) => setSocialsecurityMaster({ ...socialsecurityMaster, contribution_rate: e.target.value })}
                            />
                        </div>
                        <div className="col-auto">
                            <label htmlFor="effective_date" className="col-form-label" >วันที่เริ่มต้นหัก </label>
                        </div>
                        <div className="col-auto">
                            <input
                                id="effective_date" type="date" className="form-control" placeholder="0%"
                                value={socialsecurityMaster.effective_date}
                                onChange={(e) => setSocialsecurityMaster({ ...socialsecurityMaster, effective_date: e.target.value })}
                            />
                        </div>
                    </div>
                </div>


                <div className="p-3">
                    <p className="mb-2 fw-bold">
                        กองทุนสำรองเลี้ยงชีพ
                    </p>
                    <div className="row g-3  align-items-center">
                        <div className="col-auto">
                            <label htmlFor="employee_contribution" className="col-form-label">จำนวนเงินที่หัก </label>
                        </div>
                        <div className="col-auto">
                            <input 
                            id="employee_contribution" type="text" className="form-control" placeholder="000.0" 
                            value={providentFundsMaster.employee_contribution}
                            onChange={(e) => setProvidentFundsMaster({ ...providentFundsMaster, employee_contribution: e.target.value })}
                            />
                        </div>
                        <div className="col-auto">
                            <label htmlFor="employee_rate" className="col-form-label" >อัตราการหัก </label>
                        </div>
                        <div className="col-auto">
                            <input 
                            id="employee_rate" type="text" className="form-control" placeholder="0%" 
                            value={providentFundsMaster.employee_rate}
                            onChange={(e) => setProvidentFundsMaster({ ...providentFundsMaster, employee_rate: e.target.value })}
                            />
                        </div>
                        <div className="col-auto">
                            <label htmlFor="effective_date" className="col-form-label" >วันที่เริ่มต้นหัก </label>
                        </div>
                        <div className="col-auto">
                            <input
                            id="effective_date" type="date" className="form-control" placeholder="0%"
                            value={providentFundsMaster.effective_date}
                            onChange={(e) => setProvidentFundsMaster({ ...providentFundsMaster, effective_date: e.target.value })} 
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
export default EmployeeFinanceFrom;