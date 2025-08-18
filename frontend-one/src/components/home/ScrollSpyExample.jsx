import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ScrollSpyExample = () => {
  const [activeItem, setActiveItem] = useState('list-item-1');

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  };
  
  return (
    <div className="container py-4">
      {/* For large screens */}
      <div className="d-none d-lg-flex gap-4">
        <div className="col-md-4">
          <div id="list-example" className="list-group shadow rounded bg-light">
            <a
              className={`list-group-item list-group-item-action ${activeItem === 'list-item-1' ? 'active' : ''}`}
              href="#list-item-1"
              onClick={() => handleItemClick('list-item-1')}
            >
              เป้าหมายในการดำเนินธุรกิจ
            </a>
            <a
              className={`list-group-item list-group-item-action ${activeItem === 'list-item-2' ? 'active' : ''}`}
              href="#list-item-2"
              onClick={() => handleItemClick('list-item-2')}
            >
              กลยุทธ์ในการดำเนินงาน
            </a>
            <a
              className={`list-group-item list-group-item-action ${activeItem === 'list-item-3' ? 'active' : ''}`}
              href="#list-item-3"
              onClick={() => handleItemClick('list-item-3')}
            >
              วิสัยทัศน์
            </a>
            <a
              className={`list-group-item list-group-item-action ${activeItem === 'list-item-4' ? 'active' : ''}`}
              href="#list-item-4"
              onClick={() => handleItemClick('list-item-4')}
            >
              พันธกิจ
            </a>
            <a
              className={`list-group-item list-group-item-action ${activeItem === 'list-item-5' ? 'active' : ''}`}
              href="#list-item-5"
              onClick={() => handleItemClick('list-item-5')}
            >
              เป้าหมายในการดำเนินธุรกิจ
            </a>
          </div>
        </div>

        <div className="col-md-8">
          <div className="p-4 shadow rounded bg-white">
            {activeItem === 'list-item-1' && (
              <div id="list-item-1">
                <h4 className="fw-bold fs-4 mb-3">เป้าหมายในการดำเนินธุรกิจ</h4>
                <p>คือการเป็นมืออาชีพในการช่วยลดต้นทุนด้านโลจิสติกส์...</p>
              </div>
            )}

            {activeItem === 'list-item-2' && (
              <div id="list-item-2">
                <h4 className="fw-bold fs-4 mb-3">กลยุทธ์ในการดำเนินงาน</h4>
                <p>บริษัทฯ ได้จัดเตรียมบุคลากรที่มีความรู้ความสามารถไว้คอยให้บริการ...</p>
              </div>
            )}

            {activeItem === 'list-item-3' && (
              <div id="list-item-3">
                <h4 className="fw-bold fs-4 mb-3">วิสัยทัศน์</h4>
                <p>บริษัทฯ กำหนดวิสัยทัศน์ในการเป็นผู้นำด้านโลจิสติกส์...</p>
              </div>
            )}

            {activeItem === 'list-item-4' && (
              <div id="list-item-4">
                <h4 className="fw-bold fs-4 mb-3">พันธกิจ</h4>
                <p>พันธกิจของบริษัทฯ ได้แก่ การให้บริการด้านโลจิสติกส์แบบครบวงจร...</p>
              </div>
            )}

            {activeItem === 'list-item-5' && (
              <div id="list-item-5">
                <h4 className="fw-bold fs-4 mb-3">เป้าหมายในการดำเนินธุรกิจ</h4>
                <p>เป้าหมายในการดำเนินธุรกิจ คือการเป็นมืออาชีพ...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* For small screens */}
      <div className="d-lg-none">
        <div className="mt-3">
          {activeItem === 'list-item-1' && (
            <div id="list-item-1">
              <h4 className="fw-bold fs-4 mb-3">เป้าหมายในการดำเนินธุรกิจ</h4>
              <p>คือการเป็นมืออาชีพในการช่วยลดต้นทุนด้านโลจิสติกส์...</p>
            </div>
          )}

          {activeItem === 'list-item-2' && (
            <div id="list-item-2">
              <h4 className="fw-bold fs-4 mb-3">กลยุทธ์ในการดำเนินงาน</h4>
              <p>บริษัทฯ ได้จัดเตรียมบุคลากรที่มีความรู้ความสามารถ...</p>
            </div>
          )}

          {activeItem === 'list-item-3' && (
            <div id="list-item-3">
              <h4 className="fw-bold fs-4 mb-3">วิสัยทัศน์</h4>
              <p>บริษัทฯ กำหนดวิสัยทัศน์ในการเป็นผู้นำด้านโลจิสติกส์...</p>
            </div>
          )}

          {activeItem === 'list-item-4' && (
            <div id="list-item-4">
              <h4 className="fw-bold fs-4 mb-3">พันธกิจ</h4>
              <p>พันธกิจของบริษัทฯ ได้แก่ การให้บริการด้านโลจิสติกส์แบบครบวงจร...</p>
            </div>
          )}

          {activeItem === 'list-item-5' && (
            <div id="list-item-5">
              <h4 className="fw-bold fs-4 mb-3">เป้าหมายในการดำเนินธุรกิจ</h4>
              <p>เป้าหมายในการดำเนินธุรกิจ คือการเป็นมืออาชีพ...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollSpyExample;
