import React from "react";
import { Link } from "react-router-dom";
import NewsShow from "../News/Details";
import backgroundImage from '../images/ship/large_shutterstock_2143830159_0_49ee091016.jpg';

const NewsPage = () => {
  return (
    <>

{/* <div
      className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }} // ใช้ URL ที่อิมพอร์ต
      // style={{ backgroundImage: "url('')" }} // ใส่ URL ของภาพที่ต้องการ
    > */}
      {/* เลเยอร์สีดำโปร่งแสง */}
      {/* <div className="absolute inset-0 bg-black opacity-30"></div>
      
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold">
          
        </h1>
        <p className="text-lg md:text-2xl mt-4">ข่าวสารและกิจกรรม</p>
      </div>
    </div> */}


      <div>
        <div>
        <div className="">
  <div className="row align-items-center">
    <div className="col-lg-4">
    <h3
    className="p-3 text-center " 
    style={{
       color: '#000099',
       textAlign: 'center',
       marginBottom: '1rem',
       fontWeight: 'bold',
       fontSize: '2rem',
    }}>ข่าวสารและกิจกรรม
    </h3>
    </div>
    <div className="col-lg-8 d-flex">
      <hr className="flex-grow-1" />
    </div>
  </div>
</div>
          {/* <h3 className="p-3 text-center fw-bolder fs-4" style={{color: '#000066	'}}>ข่าวสารและกิจกรรม</h3>
          <hr className="mx-auto w-75" /> */}
        </div>
        <NewsShow showDeleteButton={false} showDetailsButton={true}/> 
      </div>
    </>
  );
};

export default NewsPage;
