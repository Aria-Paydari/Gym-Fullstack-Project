import React, {useState} from "react";
import './index.css';
import Cookies from 'universal-cookie';
import {useNavigate} from "react-router-dom";
import $ from 'jquery';

const cookies = new Cookies();

const Login = () => {
    const [username, setUsername] = useState("");
    const[password, setPassword]= useState("");
    const navigate = useNavigate()

    function set_cookie(token){
        cookies.set('token', token, { path: '/', secure: true, sameSite: 'none' })
    }

    const login = (evt) =>{
        evt.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "csrftoken=PcfubTYmFXjzzXy5uyDTtfhX8j0y22LD");

        const raw = JSON.stringify({
            "username": username,
            "password": password
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://127.0.0.1:8000/accounts/login/", requestOptions)
            .then(response => {
                if (!response.ok){ throw new Error(response.status);}
                return response.json()})
            .then(data => set_cookie(data['token']))
            .then(data => navigate('/'))
            .catch(error => {console.log('error', error);
                    $("#error_label").text("The given username or password is incorrect.")
                }
            );
    }

    return (
        <div>
            <section className="py-5">
                <div className="container py-5">
                    <div className="row mb-4 mb-lg-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 className="fw-bold">Sign in</h2>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 col-xl-4">
                            <form id="login-form" onSubmit={login}>

                                <div className="mb-3"><input className="form-control" id="username" value ={username} onChange={u => setUsername(u.target.value)} type="username" name="username" placeholder="Username"/></div>
                                <div className="mb-3"><input className="form-control" id="password" value ={password} onChange={u => setPassword(u.target.value)} type="password" name="password" placeholder="Password"/></div>
                                <label id="error_label"  style ={{color:"red"}}></label>
                                <div className="mb-3">
                                    <button id="login-button" className="btn btn-primary d-block w-100" type="submit">Continue</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;