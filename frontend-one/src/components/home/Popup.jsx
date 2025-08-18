// Popup.js
import React from "react";
import imgPopup from '../images/vdeo/nclout.gif';

const Popup = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // ไม่แสดงถ้า isOpen เป็น false

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      <div className="bg-white p-6 rounded-lg shadow-lg z-10">
     
      <img width='600' src={imgPopup} alt="Loading GIF" />
        {/* <h2 className="text-xl font-bold mb-4">ยินดีต้อนรับสู่เว็บไซต์!</h2>
        <p className="mb-4">นี่คือข้อความป็อบอัพที่คุณต้องการแสดงเมื่อเข้าชมเว็บไซต์.</p>
        <button className="btn btn-primary" onClick={onClose}>ปิด</button> */}
      </div>
    </div>
  );
};

export default Popup;
