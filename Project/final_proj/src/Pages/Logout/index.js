import React, {useState} from "react";
import {Button} from "react-bootstrap";
import './index.css';
import Cookies from 'universal-cookie';
import {useNavigate} from "react-router-dom";
const cookies = new Cookies();

const Logout = () => {
    const [buttonText, setButtonText] = useState('Continue')
    const navigate = useNavigate();

    function logout(){
        cookies.set('token', '', { path: '/', secure: true, sameSite: 'none' });
        // setButtonText('User has been logged out')
        setButtonText('Loggin out...');
        setTimeout(() => navigate("/"), 1000);
    }

    return (
        <div>
            <section className="py-5">
                <div className="container py-5">
                    <div className="row mb-4 mb-lg-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 className="fw-bold">Would you like to sign out?</h2>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <Button id="logout-button" onClick={logout}>{buttonText}</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Logout;