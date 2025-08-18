import React from "react";

const TaxForm = ({formData, setFormdata, errors, formTransportInsurance, setFormTransportInsurance, formGoodsInsurance, setFormGoodsInsurance }) => {

    const handleFileInsurance = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 2 * 1024 * 1024) { // ไฟล์ไม่เกิน 2MB
            setFormTransportInsurance((prevState) => ({
              ...prevState,
              insurance_file: file
            }));
        } else {
            alert("ไฟล์ใหญ่เกินไป");
        }
    };
    
    const handleFileGoods = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 2 * 1024 * 1024) { // ไฟล์ไม่เกิน 2MB
            setFormGoodsInsurance((prevState) => ({
              ...prevState,
              insurance_goods_file: file
            }));
        } else {
            alert("ไฟล์ใหญ่เกินไป");
        }
    };


    return (
        <>
                                    <div className="mb-3">
                                <div className="">
                                    <p className="fw-bolder">ภาษี</p>
                                </div>
                            </div>

                            <div className="col-lg-4 mb-3">
                            <label htmlFor="input_tax_end" className="form-label fw-medium">วันหมดอายุ <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="date"
                                        name="tax_end"
                                        id="input_tax_end"
                                        className="form-control"
                                        value={formData.tax_end}
                                        onChange={(e) => setFormdata({ ...formData, tax_end: e.target.value })}
                                        placeholder=""
                                    />
                                    {errors.tax_end && <p className="text-danger">{errors.tax_end}</p>}
                            </div>

                            <div className="mb-3">
                                <p className="fw-bolder">พรบ</p>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-4">
                                <label htmlFor="input_cmi_start" className="form-label fw-medium">วันที่เริ่มต้น <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="date"
                                        name="cmi_start"
                                        id="input_cmi_start"
                                        className="form-control"
                                        value={formData.cmi_start}
                                        onChange={(e) => setFormdata({ ...formData, cmi_start: e.target.value })}
                                        placeholder=""
                                    />
                                    {errors.cmi_start && <p className="text-danger">{errors.cmi_start}</p>}
                                </div>
                                <div className="col-lg-4">
                                <label htmlFor="input_cmi_end" className="form-label fw-medium">วันที่หมดอายุ <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="date"
                                        name="cmi_end"
                                        id="input_cmi_end"
                                        className="form-control"
                                        value={formData.cmi_end}
                                        onChange={(e) => setFormdata({ ...formData, cmi_end: e.target.value })}
                                        placeholder=""
                                     />
                                     {errors.cmi_end && <p className="text-danger">{errors.cmi_end}</p>}
                                </div>
                            </div>

        {/*  ....................     */}
                            <div className="mb-3">
                                <p className="fw-bolder">ประกันภัยรถขนส่ง</p>
                            </div>


                            <div className="row mb-3">
                                <div className="col-lg-4">
                                <label htmlFor="input_insurance_start_date" className="form-label fw-medium">วันที่เริ่มต้น <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="date"
                                        name="insurance_start_date"
                                        id="input_insurance_start_date"
                                        className="form-control"
                                        value={formTransportInsurance.insurance_start_date}
                                        onChange={(e) => setFormTransportInsurance({ ...formTransportInsurance, insurance_start_date: e.target.value })}
                                        placeholder=""
                                    />
                                    {/* {errors.insurance_start_date && <p className="text-danger">{errors.insurance_start_date}</p>} */}
                                </div>
                                <div className="col-lg-4">
                                <label htmlFor="input_insurance_end_date" className="form-label fw-medium">วันที่หมดอายุ <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="date"
                                        name="insurance_end_date"
                                        id="input_insurance_end_date"
                                        className="form-control"
                                        value={formTransportInsurance.insurance_end_date}
                                        onChange={(e) => setFormTransportInsurance({ ...formTransportInsurance, insurance_end_date: e.target.value })}
                                        placeholder=""
                                     /> 
                                     {/* {errors.insurance_end_date && <p className="text-danger">{errors.insurance_end_date}</p>} */}
                                </div>
                                <div className="col-lg-4">
                                <label htmlFor="input_insurance_company" className="form-label fw-medium">บริษัทประกันภัย <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="text"
                                        name="insurance_company"
                                        id="input_insurance_company"
                                        className="form-control"
                                        value={formTransportInsurance.insurance_company}
                                        onChange={(e) => setFormTransportInsurance({ ...formTransportInsurance, insurance_company: e.target.value })}
                                        placeholder=""
                                     />
                                     {/* {errors.insurance_company && <p className="text-danger">{errors.insurance_company}</p>} */}
                                </div>
                            </div>  
                            <div className="row">
                                <div className="col-lg-2 mb-3">
                                <label htmlFor="input_insurance_converage_amount" className="form-label fw-medium">จำนวนเงินคุ้มครอง <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="text"
                                        name="insurance_converage_amount"
                                        id="input_insurance_converage_amount"
                                        className="form-control"
                                        value={formTransportInsurance.insurance_converage_amount}
                                        onChange={(e) => setFormTransportInsurance({ ...formTransportInsurance, insurance_converage_amount: e.target.value })}
                                        placeholder=""
                                     />
                                </div>
                                <div className="col-lg-2 mb-3">
                                <label htmlFor="input_nsurance_premium" className="form-label fw-medium">เบี้ยประกัน <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="text"
                                        name="nsurance_premium"
                                        id="input_nsurance_premium"
                                        className="form-control"
                                        value={formTransportInsurance.nsurance_premium}
                                        onChange={(e) => setFormTransportInsurance({ ...formTransportInsurance, nsurance_premium: e.target.value })}
                                        placeholder=""
                                     />
                                </div>
                                <div className="col-lg-4 mb-3">
                                <label htmlFor="input_insurance_file" className="form-label fw-medium">เอกสารเพิ่มเติม <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="file"
                                        name="insurance_file"
                                        id="input_insurance_file"
                                        className="form-control"
                                        // value={formTransportInsurance.insurance_file}
                                        onChange={handleFileInsurance}
                                        placeholder=""
                                     />
                                </div>
                            </div>
                {/*  ....................   */}

                <div className="mb-3">
                                <p className="fw-bolder">ประกันภัยสินค้าระหว่างการขนส่ง</p>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-4">
                                <label htmlFor="input_insurance_start_date" className="form-label fw-medium">วันที่เริ่มต้น <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="date"
                                        name="insurance_start_date"
                                        id="input_insurance_start_date"
                                        className="form-control"
                                        value={formGoodsInsurance.insurance_start_date}
                                        onChange={(e) => setFormGoodsInsurance({ ...formGoodsInsurance, insurance_start_date: e.target.value })}
                                        placeholder=""
                                    />
                                    {/* {errors.insurance_start_date && <p className="text-danger">{errors.insurance_start_date}</p>} */}
                                </div>
                                <div className="col-lg-4">
                                <label htmlFor="input_insurance_end_date" className="form-label fw-medium">วันที่หมดอายุ <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="date"
                                        name="insurance_end_date"
                                        id="input_insurance_end_date"
                                        className="form-control"
                                        value={formGoodsInsurance.insurance_end_date}
                                        onChange={(e) => setFormGoodsInsurance({ ...formGoodsInsurance, insurance_end_date: e.target.value })}
                                        placeholder=""
                                     /> 
                                     {/* {errors.insurance_end_date && <p className="text-danger">{errors.insurance_end_date}</p>} */}
                                </div>
                                <div className="col-lg-4">
                                <label htmlFor="input_insurance_company" className="form-label fw-medium">บริษัทประกันภัย <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="text"
                                        name="insurance_company"
                                        id="input_insurance_company"
                                        className="form-control"
                                        value={formGoodsInsurance.insurance_company}
                                        onChange={(e) => setFormGoodsInsurance({ ...formGoodsInsurance, insurance_company: e.target.value })}
                                        placeholder=""
                                     />
                                     {/* {errors.insurance_company && <p className="text-danger">{errors.insurance_company}</p>} */}
                                </div>
                            </div>  
                            <div className="row">
                                <div className="col-lg-2 mb-3">
                                <label htmlFor="input_insurance_converage_amount" className="form-label fw-medium">จำนวนเงินคุ้มครอง <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="text"
                                        name="insurance_converage_amount"
                                        id="input_insurance_converage_amount"
                                        className="form-control"
                                        value={formGoodsInsurance.insurance_converage_amount}
                                        onChange={(e) => setFormGoodsInsurance({ ...formGoodsInsurance, insurance_converage_amount: e.target.value })}
                                        placeholder=""
                                     />
                                </div>
                                <div className="col-lg-2 mb-3">
                                <label htmlFor="input_nsurance_premium" className="form-label fw-medium">เบี้ยประกัน <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="text"
                                        name="nsurance_premium"
                                        id="input_nsurance_premium"
                                        className="form-control"
                                        value={formGoodsInsurance.nsurance_premium}
                                        onChange={(e) => setFormGoodsInsurance({ ...formGoodsInsurance, nsurance_premium: e.target.value })}
                                        placeholder=""
                                     />
                                </div>
                                <div className="col-lg-4 mb-3">
                                <label htmlFor="input_insurance_file" className="form-label fw-medium">เอกสารเพิ่มเติม <span style={{ color: "red" }}> *</span></label>
                                    <input
                                        type="file"
                                        name="insurance_file"
                                        id="input_insurance_file"
                                        className="form-control"
                                        // value={formGoodsInsurance.insurance_file}
                                        onChange={handleFileGoods}
                                        placeholder=""
                                     />
                                </div>
                            </div>
        </>
    )
}


export default TaxForm;