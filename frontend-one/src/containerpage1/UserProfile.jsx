import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData)); // แปลง JSON เป็น Object แล้วเก็บใน state
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-profile">
      <h3>Welcome, {user.fname} {user.lname}</h3>
      <p>Employee Code: {user.code}</p>
    </div>
  );
};

export default UserProfile;
