import React, { useState, useEffect } from "react";

const PopupSettings = () => {
  const [isPopupEnabled, setIsPopupEnabled] = useState(true); // สถานะการเปิด/ปิดป็อบอัพ

  // ใช้ useEffect เพื่ออ่านค่าจาก localStorage เมื่อโหลดหน้า
  useEffect(() => {
    const popupSetting = localStorage.getItem("popupEnabled");
    if (popupSetting !== null) {
      setIsPopupEnabled(JSON.parse(popupSetting)); // ตั้งค่าตามข้อมูลใน localStorage
    }
  }, []);

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงการตั้งค่า
  const handleTogglePopup = () => {
    setIsPopupEnabled((prev) => {
      const newValue = !prev; // สลับค่า
      localStorage.setItem("popupEnabled", JSON.stringify(newValue)); // บันทึกค่าใน localStorage
      return newValue; // คืนค่าที่เปลี่ยน
    });
  };

  return (
    <div className="container my-4">
      <h1 className="text-2xl font-bold mb-4">การตั้งค่าป็อบอัพ</h1>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={isPopupEnabled}
          onChange={handleTogglePopup}
          className="mr-2"
        />
        <span>เปิดใช้งานป็อบอัพเมื่อเข้าสู่เว็บไซต์</span>
      </label>
    </div>
  );
};

export default PopupSettings;
