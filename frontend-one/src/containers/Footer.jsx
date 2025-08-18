import React from "react";
import "./Footter.css"; // Create a separate CSS file for custom styling

const Footter = () => {
  return (
    <footer className="footer footer-center bg-light text-dark rounded p-4 p-md-5">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 text-center text-md-start">
            <img 
              src="https://int.nclthailand.com/wp-content/uploads/2024/05/Screenshot-2024-05-08-100352-2.png" 
              alt="NCL Logo" 
              className="footer-logo"
            />
            <h2 className="mt-3">
              บริษัท เอ็นซีแอล อินเตอร์เนชั่นแนล โลจิสติกส์ จำกัด (มหาชน)
              <br />
              56/9-10 ซอยตากสิน 12/1 ถนนสมเด็จพระเจ้าตากสิน แขวงบุคคโล เขตธนบุรี กรุงเทพมหานคร 10600
            </h2>
          </div>
          <div className="col-12 col-md-6 mt-4 mt-md-0 text-center text-md-end">
            <h6 className="footer-title mb-3">Follow Us</h6>
            <div className="social-icons">
              {/* <a href="#" className="social-icon">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-instagram"></i>
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footter;
