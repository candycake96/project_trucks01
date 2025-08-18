import React from "react";

const FinanceForm = ({ isFinance, setFinance }) => {

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFinance((prevState) => ({ ...prevState, file_finance: file }));
    };


    return (
        <>
            <div className="mb-3">
                <p className="fw-bolder">
                    สินเชื่อ
                </p>
            </div>

            <div className="col-lg-4 mb-3">
                <label htmlFor="input_insurance_company" className="form-label fw-medium">บริษัท</label>
                <input
                    type="text"
                    name="insurance_company"
                    id="input_insurance_company"
                    className="form-control"
                    value={isFinance.insurance_company}
                    onChange={(e) => setFinance({ ...isFinance, insurance_company: e.target.value })}
                    placeholder=""
                />
            </div>

            <div className="row mb-3">
                <div className="col-lg-4 mb-3">
                    <label htmlFor="input_loan_amount" className="form-label fw-medium">จำนวนเต็ม</label>
                    <input
                        type="text"
                        name="loan_amount"
                        id="input_loan_amount"
                        className="form-control"
                        value={isFinance.loan_amount}
                        onChange={(e) => setFinance({ ...isFinance, loan_amount: e.target.value })}
                        placeholder=""
                    />
                </div>
                <div className="col-lg-4 mb-3">
                    <label htmlFor="input_interest_rate" className="form-label fw-medium">ดอกเบี่ย %</label>
                    <input
                        type="text"
                        name="interest_rate"
                        id="input_interest_rate"
                        className="form-control"
                        value={isFinance.interest_rate}
                        onChange={(e) => setFinance({ ...isFinance, interest_rate: e.target.value })}
                        placeholder=""
                    />
                </div>
                <div className="col-lg-4 mb-3">
                    <label htmlFor="input_monthly_payment" className="form-label fw-medium">ค่างวดต่อเดือน</label>
                    <input
                        type="text"
                        name="monthly_payment"
                        id="input_monthly_payment"
                        className="form-control"
                        value={isFinance.monthly_payment}
                        onChange={(e) => setFinance({ ...isFinance, monthly_payment: e.target.value })}
                        placeholder=""
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-lg-4 mb-3">
                    <label htmlFor="input_start_date" className="form-label fw-medium">วันที่เริ่มต้น</label>
                    <input
                        type="date"
                        name="start_date"
                        id="input_start_date"
                        className="form-control"
                        value={isFinance.start_date}
                        onChange={(e) => setFinance({ ...isFinance, start_date: e.target.value })}
                        placeholder=""
                    />
                </div>
                <div className="col-lg-4 mb-3">
                    <label htmlFor="input_end_date" className="form-label fw-medium">วันที่สิ้นสุด</label>
                    <input
                        type="date"
                        name="end_date"
                        id="input_end_date"
                        className="form-control"
                        value={isFinance.end_date}
                        onChange={(e) => setFinance({ ...isFinance, end_date: e.target.value })}
                        placeholder=""
                    />
                </div>
            </div>

            <div className="col-lg-8 mb-3">
                <label htmlFor="input_file_finance" className="form-label fw-medium">เอกสารเพิ่มเติม (ถ้ามี)</label>
                <input
                    type="file"
                    name="file_finance"
                    id="input_file_finance"
                    className="form-control"
                    onChange={handleFileChange}
                />
                {isFinance.file_finance && (
                    <p className="mt-2">Selected file: {isFinance.file_finance.name}</p>
                )}
            </div>


        </>
    )
}

export default FinanceForm;