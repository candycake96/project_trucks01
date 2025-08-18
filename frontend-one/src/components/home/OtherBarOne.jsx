import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'daisyui/dist/full.css';

const ScrollSpyExample = () => {
  const [activeItem, setActiveItem] = useState('list-item-1');

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  };

  return (
    <div className="p-5">
      {/* Sidebar */}
      <div className="hidden md:flex flex-row gap-4">
        <div className="w-1/3">
          <div id="list-example" className="list-group shadow-lg rounded-lg bg-base-200">
            <a
              className={`list-group-item list-group-item-action ${activeItem === 'list-item-1' ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'}`}
              href="#list-item-1"
              onClick={() => handleItemClick('list-item-1')}
            >
              เป้าหมายในการดำเนินธุรกิจ
            </a>
            <a
              className={`list-group-item list-group-item-action ${activeItem === 'list-item-2' ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'}`}
              href="#list-item-2"
              onClick={() => handleItemClick('list-item-2')}
            >
              กลยุทธ์ในการดำเนินงาน
            </a>
            <a
              className={`list-group-item list-group-item-action ${activeItem === 'list-item-3' ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'}`}
              href="#list-item-3"
              onClick={() => handleItemClick('list-item-3')}
            >
              วิสัยทัศน์
            </a>
            <a
              className={`list-group-item list-group-item-action ${activeItem === 'list-item-4' ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'}`}
              href="#list-item-4"
              onClick={() => handleItemClick('list-item-4')}
            >
              พันธกิจ
            </a>
            <a
              className={`list-group-item list-group-item-action ${activeItem === 'list-item-5' ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'}`}
              href="#list-item-5"
              onClick={() => handleItemClick('list-item-5')}
            >
              เป้าหมายในการดำเนินธุรกิจ
            </a>
          </div>
        </div>

        <div className="w-2/3">
          <div className="scrollspy-example p-5 shadow-lg rounded-lg bg-white">
            {activeItem === 'list-item-1' && (
              <div id="list-item-1">
                <h4 className="font-bold text-xl mb-3">เป้าหมายในการดำเนินธุรกิจ</h4>
                <p>คือการเป็นมืออาชีพในการช่วยลดต้นทุนด้านโลจิสติกส์ เพื่อเพิ่มประสิทธิภาพและสร้างความพึงพอใจให้แก่ลูกค้าให้มากที่สุด</p>
              </div>
            )}

            {activeItem === 'list-item-2' && (
              <div id="list-item-2">
                <h4 className="font-bold text-xl mb-3">กลยุทธ์ในการดำเนินงาน</h4>
                <p>บริษัทฯ ได้จัดเตรียมบุคลากรที่มีความรู้ความสามารถไว้คอยให้บริการแก่ลูกค้า...</p>
              </div>
            )}

            {activeItem === 'list-item-3' && (
              <div id="list-item-3">
                <h4 className="font-bold text-xl mb-3">วิสัยทัศน์</h4>
                <p>บริษัทฯ กำหนดวิสัยทัศน์ในการเป็นผู้นำในด้านการให้บริการด้านโลจิสติกส์แบบครบวงจร...</p>
              </div>
            )}

            {activeItem === 'list-item-4' && (
              <div id="list-item-4">
                <h4 className="font-bold text-xl mb-3">พันธกิจ</h4>
                <p>พันธกิจของบริษัทฯ ได้แก่ การประกอบธุรกิจให้บริการด้านโลจิสติกส์แบบครบวงจร...</p>
              </div>
            )}

            {activeItem === 'list-item-5' && (
              <div id="list-item-5">
                <h4 className="font-bold text-xl mb-3">เป้าหมายในการดำเนินธุรกิจ</h4>
                <p>เป้าหมายในการดำเนินธุรกิจ คือการเป็นมืออาชีพในการช่วยลดต้นทุนด้านโลจิสติกส์...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex flex-col gap-4">
          {activeItem === 'list-item-1' && (
            <div id="list-item-1">
              <h4 className="font-bold text-xl mb-3">เป้าหมายในการดำเนินธุรกิจ</h4>
              <p>คือการเป็นมืออาชีพในการช่วยลดต้นทุนด้านโลจิสติกส์ เพื่อเพิ่มประสิทธิภาพและสร้างความพึงพอใจให้แก่ลูกค้าให้มากที่สุด</p>
            </div>
          )}

          {activeItem === 'list-item-2' && (
            <div id="list-item-2">
              <h4 className="font-bold text-xl mb-3">กลยุทธ์ในการดำเนินงาน</h4>
              <p>บริษัทฯ ได้จัดเตรียมบุคลากรที่มีความรู้ความสามารถไว้คอยให้บริการแก่ลูกค้า...</p>
            </div>
          )}

          {activeItem === 'list-item-3' && (
            <div id="list-item-3">
              <h4 className="font-bold text-xl mb-3">วิสัยทัศน์</h4>
              <p>บริษัทฯ กำหนดวิสัยทัศน์ในการเป็นผู้นำในด้านการให้บริการด้านโลจิสติกส์แบบครบวงจร...</p>
            </div>
          )}

          {activeItem === 'list-item-4' && (
            <div id="list-item-4">
              <h4 className="font-bold text-xl mb-3">พันธกิจ</h4>
              <p>พันธกิจของบริษัทฯ ได้แก่ การประกอบธุรกิจให้บริการด้านโลจิสติกส์แบบครบวงจร...</p>
            </div>
          )}

          {activeItem === 'list-item-5' && (
            <div id="list-item-5">
              <h4 className="font-bold text-xl mb-3">เป้าหมายในการดำเนินธุรกิจ</h4>
              <p>เป้าหมายในการดำเนินธุรกิจ คือการเป็นมืออาชีพในการช่วยลดต้นทุนด้านโลจิสติกส์...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollSpyExample;
