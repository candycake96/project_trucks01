import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 

// นำเข้ารูปภาพพื้นหลังจากโฟลเดอร์
import backgroundImage from '../images/ship/logistics-01.jpg'; // ตรวจสอบเส้นทางให้ตรงกับที่ตั้งไฟล์ของคุณ

const CarouselFadeExample = () => {
  return (
    <div
      className="position-relative d-flex align-items-center justify-content-center"
      style={{ height: '100vh' }} // ปรับความสูงของส่วนนี้ได้ตามต้องการ
    >
      {/* รูปภาพพื้นหลัง */}
      <img
        src={backgroundImage} // ใช้รูปภาพที่นำเข้า
        alt="Background"
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ objectFit: 'cover' }} // ทำให้รูปภาพครอบคลุม
      />

      {/* เลเยอร์สีดำโปร่งแสง */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 bg-black"
        style={{ opacity: 0.3 }} // เพิ่มความมืดให้ชัดเจนขึ้น
      ></div>

      {/* ข้อความ */}
      <div className="position-relative z-1 text-center text-white">
        <h1 className="display-4 fw-bold">ยินดีต้อนรับสู่เว็บไซต์ของเรา</h1>
        <h3 className='lead mt-3'>บริษัท เอ็นซีแอล อินเตอร์เนชั่นแนล โลจิสติกส์ จำกัด (มหาชน)</h3>
        <p className="lead mt-4">สร้างสรรค์และแบ่งปันเรื่องราวดีๆ</p>
      </div>
    </div>
  );
};

export default CarouselFadeExample;
