import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../config/apiConfig'
// import './LoginPage.css'; // Import the custom CSS file

const LoginPage = () => {
    const [inputs, setInputs] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "email": inputs.email,
            "password": inputs.password
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${API_BASE_URL}/api/login`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === "ok") {
                    console.log("Login successful");
                    localStorage.setItem('token', result.accessToken);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    setIsLoggedIn(true);
                    navigate('/page1'); 
                } else {
                    setErrorMessage('Login failed: ' + result.message);
                }
            })
            .catch((error) => setErrorMessage('Error: ' + error));
    }

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/page1');
        } else {
            setLoading(false); // หยุดโหลดเมื่อไม่มี Token
        }
    }, [navigate]);
    
    if (loading) {
        return <div>Loading...</div>; // แสดงข้อความโหลด
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card w-100" style={{ maxWidth: '400px' }}>
                <div className="card-body">
                    <h5 className="card-title text-center">Login</h5>
                    <form onSubmit={handleSubmit}>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                value={inputs.email || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                name="password"
                                value={inputs.password || ""}
                                onChange={handleChange}
                                required
                            />
                            <div className="form-check mt-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="showPasswordCheck"
                                    checked={showPassword}
                                    onChange={toggleShowPassword}
                                />
                                <label className="form-check-label" htmlFor="showPasswordCheck">
                                    Show Password
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Sign in</button>
                        <div className="">
                            <div className="row">
                                <div className="col"><a href="/"><i className="bi bi-arrow-counterclockwise"></i> Home page</a></div>
                                <div className="col text-end"><a href="/">Forgot your password?</a></div>
                            </div>  
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
