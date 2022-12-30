import React, {useEffect, useRef, useState} from "react";
import './index.css';
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import {forEach} from "react-bootstrap/ElementChildren";
import {useNavigate} from "react-router-dom";
const cookies = new Cookies();

const Register = () => {
    const [username, setUsername] = useState("");
    const[password, setPassword]= useState("");
    const[firstName, setFirstName]= useState("");
    const[lastName, setLastName]= useState("");
    const[email, setEmail]= useState("");
    const[phoneNumber, setPhoneNumber]= useState("");
    const[avatar, setAvatar]= useState("");
    const[creditCard, setCreditCard]= useState("");
    const navigate = useNavigate()

    const register = (evt) =>{
        evt.preventDefault();
        const settings = {
            "url": "http://127.0.0.1:8000/accounts/register/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Cookie": "csrftoken=PcfubTYmFXjzzXy5uyDTtfhX8j0y22LD"
            },
            "data": JSON.stringify({
                "phone_number": parseInt(phoneNumber),
                "avatar": avatar,
                "credit_card": creditCard,
                "username": username,
                "email": email,
                "password": password,
                "first_name": firstName,
                "last_name": lastName
            }),
            error: function(xhr){
                const res = JSON.parse(xhr.responseText);
                if(res.hasOwnProperty("username")){
                    $("#username_label").text(res["username"]);
                }
                if(res.hasOwnProperty("email")){
                    $("#email_label").text(res["email"]);
                }
                if(res.hasOwnProperty("password")){
                    $("#password_label").text(res["password"]);
                }
                if(res.hasOwnProperty("phone_number")){
                    $("#phone_label").text(res["phone_number"]);
                }
                if(res.hasOwnProperty("credit_card")){
                    $("#credit_label").text(res["credit_card"]);
                }
                if(res.hasOwnProperty("avatar")){
                    $("#avatar_label").text("Please choose an avatar.");
                }
            }
        };

        $.ajax(settings).done(function (response) {
            navigate("/login");
        });
    }

    const redirect = (event, path) => {
        navigate(path);
    }

    const setImage = (event, imageName) => {
        $("#avatar_image").attr("src",require(`../../assets/avatars/${imageName}`));
    }

    const addAvatars = (event) => {
        let items = ['blue.png', 'red.png', 'anime1.jpg', 'anime2.jpg', 'arnold.jpg', 'gigachad.png',  "Heisenberg.jpg",
            "karisu.png", "kaguya.jpg", "rem.jpg", "light.jpg"]

        let curr_items = $('#avatar option').map((index, option) => option.value).toArray()

        items.forEach(item => {
            if (!(curr_items.includes(item)))
            {
                $('#avatar').append($('<option>', {text:`${item}`}));
            }
        })
    }

    return (
        <div>
            <section className="py-5">
                <div className="container py-5">
                    <div className="row mb-4 mb-lg-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 className="fw-bold">Register</h2>
                        </div>
                    </div>
                    <img id="avatar_image"></img>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 col-xl-4">
                            <form id="register-form">
                                <div className="mb-3">
                                    <p id="username_label"  style ={{color:"red"}}></p>
                                    <input className="form-control" id="username" value ={username} onChange={u => setUsername(u.target.value)} type="username" name="username" placeholder="Username"/></div>
                                <p id="password_label" style ={{color:"red"}}></p>
                                <div className="mb-3"><input className="form-control" id="password" value ={password} onChange={u => setPassword(u.target.value)} type="password" name="password" placeholder="Password"/></div>
                                <div className="mb-3"><input className="form-control" id="firstName" value ={firstName} onChange={u => setFirstName(u.target.value)} type="firstName" name="firstName" placeholder="firstName"/></div>
                                <div className="mb-3"><input className="form-control" id="lastName" value ={lastName} onChange={u => setLastName(u.target.value)} type="lastName" name="lastName" placeholder="lastName"/></div>
                                <p id="email_label" style ={{color:"red"}}></p>
                                <div className="mb-3"><input className="form-control" id="email" value ={email} onChange={u => setEmail(u.target.value)} type="email" name="email" placeholder="email"/></div>
                                <p id="phone_label" style ={{color:"red"}}></p>
                                <div className="mb-3"><input className="form-control" id="phoneNumber" value ={phoneNumber} onChange={u => setPhoneNumber(u.target.value)} type="number" name="phoneNumber" placeholder="phoneNumber"/></div>
                                <p id="credit_label" style ={{color:"red"}}></p>
                                <div className="mb-3"><input className="form-control" id="creditCard" value ={creditCard} onChange={u => setCreditCard(u.target.value)} type="number" name="creditCard" placeholder="creditCard"/></div>
                                <p id="avatar_label" style ={{color:"red"}}></p>
                                <select id="avatar" name="avatar" onClick={(event) => addAvatars(event)} onChange={(event) => {setImage(event, event.target.value); setAvatar(event.target.value)}} value={avatar}>
                                    <option id="initial-avatar" selected>Select Avatar</option>
                                </select>
                                <br></br>
                                <br></br>

                                <div className="mb-3">
                                    <button id="register-button" className="btn btn-primary d-block w-100" type="submit" onClick={(event) => register(event)}>Continue</button>
                                </div>
                            </form>
                            <p>Already have an account?</p>
                            <button id="login-button" className="btn btn-primary d-block w-100" type="submit" onClick={(event) => redirect(event, '/login')}>Log in</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Register;