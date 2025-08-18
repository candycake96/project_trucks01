import React, { useState } from 'react';

const CurrentAddressForm = ({ currentAddress, setCurrentAddress, permanentAddress, setPermanentAddress }) => {

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      // คัดลอกข้อมูลจาก currentAddress ไป permanentAddress
      setCurrentAddress({ ...permanentAddress });
    } else {
      // รีเซ็ต currentAddress เมื่อไม่เลือก checkbox
      setCurrentAddress({
        country: '',
        postal_code: '',
        house_number: '',
        street: '',
        city: '',
        province: ''
      });
    }
  };

  return (
    <>
      <div>
        <div className="mb-3">
          <p><i className="bi bi-credit-card-2-front"></i> ที่อยู่ตามบัตรประชาชน</p>
        </div>

        <div className="row">
          <div className="col-lg-3 mb-3">
            <label htmlFor="inputCountry">ประเทศ <span style={{ color: "red" }}> *</span></label>
            <input
              type="text"
              className="form-control"
              value={permanentAddress.country}
              onChange={(e) => setPermanentAddress({ ...permanentAddress, country: e.target.value })}
              placeholder="ประเทศ"
            />
          </div>
          <div className="col-lg-3">
            <label htmlFor="inputPostalCode">รหัสไปรษณีย์ <span style={{ color: "red" }}> *</span></label>
            <input
              type="text"
              className="form-control"
              value={permanentAddress.postal_code}
              onChange={(e) => setPermanentAddress({ ...permanentAddress, postal_code: e.target.value })}
              placeholder="รหัสไปรษณีย์"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-lg-3">
            <label htmlFor="inputHouseNumber">ที่อยู่ <span style={{ color: "red" }}> *</span></label>
            <input
              type="text"
              className="form-control"
              value={permanentAddress.house_number}
              onChange={(e) => setPermanentAddress({ ...permanentAddress, house_number: e.target.value })}
              placeholder="ที่อยู่"
            />
          </div>
          <div className="col-lg-3">
            <label htmlFor="inputStreet">ถนน/ตำบล <span style={{ color: "red" }}> *</span></label>
            <input
              type="text"
              className="form-control"
              value={permanentAddress.street}
              onChange={(e) => setPermanentAddress({ ...permanentAddress, street: e.target.value })}
              placeholder="ถนน/ตำบล"
            />
          </div>
          <div className="col-lg-3">
            <label htmlFor="inputCity">เมือง/อำเภอ <span style={{ color: "red" }}> *</span></label>
            <input
              type="text"
              className="form-control"
              value={permanentAddress.city}
              onChange={(e) => setPermanentAddress({ ...permanentAddress, city: e.target.value })}
              placeholder="เมือง/อำเภอ"
            />
          </div>
          <div className="col-lg-3">
            <label htmlFor="inputProvince">จังหวัด <span style={{ color: "red" }}> *</span></label>
            <input
              type="text"
              className="form-control"
              value={permanentAddress.province}
              onChange={(e) => setPermanentAddress({ ...permanentAddress, province: e.target.value })}
              placeholder="จังหวัด"
            />
          </div>
        </div>
      </div>

      <br />
      <hr />
      <br />
      <div className="mb-3">
        <p><i className="bi bi-house-heart-fill"></i> ที่อยู่ปัจจุบัน <span style={{ color: "red" }}> *</span></p>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="flexCheckDefault"
            onChange={handleCheckboxChange}
          />
          <label htmlFor="flexCheckDefault" className='form-check-label'>คัดลอกข้อมูลจากที่อยู่ตามบัตรประชาชน</label>
        </div>

        <div className="row">
          <div className="col-lg-3 mb-3">
            <label htmlFor="inputCountry">ประเทศ</label>
            <input
              type="text"
              className="form-control"
              value={currentAddress.country}
              onChange={(e) => setCurrentAddress({ ...currentAddress, country: e.target.value })}
              placeholder="ประเทศ"
            />
          </div>
          <div className="col-lg-3">
            <label htmlFor="inputPostalCode">รหัสไปรษณีย์</label>
            <input
              type="text"
              className="form-control"
              value={currentAddress.postal_code}
              onChange={(e) => setCurrentAddress({ ...currentAddress, postal_code: e.target.value })}
              placeholder="รหัสไปรษณีย์"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-lg-3">
            <label htmlFor="inputHouseNumber">ที่อยู่</label>
            <input
              type="text"
              className="form-control"
              value={currentAddress.house_number}
              onChange={(e) => setCurrentAddress({ ...currentAddress, house_number: e.target.value })}
              placeholder="ที่อยู่"
            />
          </div>
          <div className="col-lg-3">
            <label htmlFor="inputStreet">ถนน/ตำบล</label>
            <input
              type="text"
              className="form-control"
              value={currentAddress.street}
              onChange={(e) => setCurrentAddress({ ...currentAddress, street: e.target.value })}
              placeholder="ถนน/ตำบล"
            />
          </div>
          <div className="col-lg-3">
            <label htmlFor="inputCity">เมือง/อำเภอ</label>
            <input
              type="text"
              className="form-control"
              value={currentAddress.city}
              onChange={(e) => setCurrentAddress({ ...currentAddress, city: e.target.value })}
              placeholder="เมือง/อำเภอ"
            />
          </div>
          <div className="col-lg-3">
            <label htmlFor="inputProvince">จังหวัด</label>
            <input
              type="text"
              className="form-control"
              value={currentAddress.province}
              onChange={(e) => setCurrentAddress({ ...currentAddress, province: e.target.value })}
              placeholder="จังหวัด"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentAddressForm;
