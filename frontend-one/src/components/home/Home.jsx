import { useState } from "react";
import CarouselFadeExample from "./CarouselFadeExample";
import News from "./News";
import ScrollSpyExample from "./ScrollSpyExample";
import Footter from "../../containers/Footer";
import Popup from "./Popup";

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true); // กำหนดสถานะให้ป็อบอัพเปิด

  const handleClosePopup = () => {
    setIsPopupOpen(false); // ปิดป็อบอัพ
  };

  return (
    <>
      <Popup isOpen={isPopupOpen} onClose={handleClosePopup} />{" "}
      {/* แสดงป็อบอัพ */}
      <div>
        <div className="">
          {/* ปก */}
          <CarouselFadeExample />
        </div>


        <div style={{ background: "" }}>
  <div className="container p-3">
    <div className="text-center d-flex justify-content-center">
      <div className="col-lg-3">
        <a href="/loginpage" className="b text-decoration-none" style={{ textDecoration: "none" }}>
          <div
            className="card shadow"
            style={{
              background: "#243865",
              borderRadius: "10px",
              transition: "transform 0.2s, background 0.2s",
            }}
          >
            <div className="card-body d-flex justify-content-center align-items-center">
              <p className="fs-4 text-white m-0 text">สำหรับพนักงาน</p>
              <p className=" text-white m-0 text">คลิ๊กที่นี่</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</div>

<style>
{`
  /* เพิ่มแอคชั่นการเปลี่ยนสีให้การ์ด */
  .b:hover .card {
    background: #1f487e;
    transform: scale(1.05);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  }

  /* เพิ่มแอคชั่นการเปลี่ยนสีให้ <p> */
  .b:hover .card-body p {
    color: #7B68EE !important; /* เปลี่ยนสีข้อความใน <p> */
    transition: color 0.2s;
  }
`}
</style>


        <div className="bg-base-300 text-base-content p-4">
          {/* <OtherBarOne /> */}
          <aside></aside>
          <ScrollSpyExample />
        </div>

        <br />
        <div>
          {/* News */}
          <News />
        </div>
      </div>
      <div className="">{/* <Footter/> */}</div>
    </>
  );
};

export default Home;
