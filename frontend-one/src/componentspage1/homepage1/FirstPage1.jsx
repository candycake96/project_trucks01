import React from "react";
import "../homepage1/FirstPage1.css";
import { Link } from "react-router-dom";
import calendarImg  from '../image/CompanyOuting(1).png';

const FirstPage1 = () => {
  return (
    <>
      <div className="p-7">
        <div className="">
          <div className="container text-center">
            <div className="row">
              
              <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3">
                <Link to="http://leave.nclthailand.com:5551/login.php" className="custom-hover">
                  <div className="card" style={{ width: "25rem", background: '#E5A000' }}>
                    <div className="card-body">
                      <p className="fs-5 fw-bolder"> <i class="bi bi-person-fill-down"></i> ระบบลางาน</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3">
                <Link to="/page1/bookingroomdetails" className="custom-hover">
                  <div className="card" style={{ width: "25rem", background: '#E5A000' }}>
                    <div className="card-body">
                      <p className="fs-5 fw-bolder"><i class="bi bi-calendar2-event"></i> จองห้องประชุม</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3">
                <Link to="/page1/companypolicy" className="custom-hover">
                  <div className="card" style={{ width: "25rem", background: '#E5A000' }}>
                    <div className="card-body">
                      <p className="fs-5 fw-bolder"  ><i class="bi bi-globe"></i> นโยบายบริษัท</p>
                    </div>
                  </div>
                </Link>
              </div>

<hr className="mb-3" />

<div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3">
                <Link to="/page1/call" className="custom-hover">
                  <div className="card" style={{ width: "25rem", background: '#3d3635' }}>
                    <div className="card-body">
                      <p className="fs-5 fw-bolder" style={{color: '#ffffff'}}><i class="bi bi-people-fill"></i> เบอร์โทรภายใน</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3">
                <Link to="http://leave.nclthailand.com:5551/login.php" className="custom-hover">
                  <div className="card" style={{ width: "25rem", background: '#3d3635' }}>
                    <div className="card-body">
                      <p className="fs-5 fw-bolder" style={{color: '#ffffff'}} > <i class="bi bi-folder-fill"></i> ฟร์อมจัดเก็บสัญญา</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3">
                <Link to="/page1/memopage" className="custom-hover">
                  <div className="card" style={{ width: "25rem", background: '#3d3635' }}>
                    <div className="card-body">
                      <p className="fs-5 fw-bolder" style={{color: "#ffffff"}}> <i class="bi bi-receipt-cutoff"></i> MEMO Job</p>
                    </div>
                  </div>
                </Link>
              </div>

              <hr className="mb-3" />

              <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3">
                <Link to="/page1/logintruck" className="custom-hover">
                  <div className="card" style={{ width: "25rem", background: '#3d3635' }}>
                    <div className="card-body">
                      <p className="fs-5 fw-bolder" style={{color: "#ffffff"}}> <i class="bi bi-truck"></i> Truck and WMS </p>
                    </div>
                  </div>
                </Link>
              </div>

            </div>
            <hr className="mb-3"/>
            <Link to=''>
            <div className="card border-0">
              <div className="card-body">
                <p className="fs-5 fw-bolder mb-3"> <i class="bi bi-calendar2-event "></i> ปฏิฐินบริษัท</p>
                <img src={calendarImg} alt="" className="card-img-top mx-auto d-block" style={{width: "40rem"}} />
              </div>
            </div>
            </Link>
            
          </div>
        </div>
      </div>


    </>
  );
};

export default FirstPage1;
