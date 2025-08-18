import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const NewsContent = () => {
  return (
    <>
      <div>
        <div>
          <h3 className="p-3 text-center ">จัดการข้อมูลข่าว</h3>
          <hr className="mx-auto w-75" />
        </div>
        <div className="container my-4">
          <div className="row justify-content-center">
            {/* Card */}
            <div className="col-sm-6 col-md-4 mb-4">
  <div className="card shadow-lg h-100">
    <img
      src="/src/images/ship/scene.jpg"
      className="card-img-top"
      alt="Generated"
      style={{
        height: "200px",
        objectFit: "cover",
      }}
    />
    <div className="card-body">
      <h5 className="card-title">ข่าวล่าสุด</h5>
      <p className="card-text">
        ตัวอย่างข้อความที่สนับสนุนเนื้อหาของการ์ดนี้
        สามารถเพิ่มเติมข้อมูลที่มีความยาวมากขึ้นได้
      </p>
    </div>
    <div className="card-footer text-center">
      <a href="button" className="btn btn-primary mx-2">
        Details
      </a>
      <a href="button" className="btn btn-secondary mx-2">
        Edit
      </a>
      <a href="button" className="btn btn-dangen mx-2">
        Deletes
      </a>
    </div>
  </div>
</div>


            {/* Add more cards if necessary */}
            <div className="col-sm-6 col-md-4 mb-4">
              <div className="card shadow-lg h-100">
                <img
                  src="/src/images/ship/ai-generated.jpg"
                  className="card-img-top"
                  alt="Generated"
                  style={{
                    height: "200px",
                    objectFit: "cover", //ย่อขยายไม่เพี้ยน
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">ข่าวเพิ่มเติม</h5>
                  <p className="card-text">
                    ข้อความเพิ่มเติมที่สนับสนุนเนื้อหาของการ์ดนี้
                    เพื่อสร้างประสบการณ์การใช้งานที่ดีขึ้น
                  </p>
                  <div className="d-flex justify-content-end">
                    <Link to="/about" className="btn btn-primary">
                      อ่านเพิ่มเติม
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a className="p-1 rounded " href="">
                ดูข่าวเพิ่มเติม
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsContent;
