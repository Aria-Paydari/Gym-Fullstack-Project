import React, {useEffect, useRef, useState} from "react";
import './index.css';
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import {forEach} from "react-bootstrap/ElementChildren";
import {useNavigate} from "react-router-dom";
const cookies = new Cookies();

const Profile = () => {
    const[firstName, setFirstName]= useState("");
    const[lastName, setLastName]= useState("");
    const[email, setEmail]= useState("");
    const[phoneNumber, setPhoneNumber]= useState("");
    const[avatar, setAvatar]= useState("");
    const navigate = useNavigate()
    let token = cookies.get('token');

    const view_profile = (event) =>{
        const settings = {
            "url": "http://127.0.0.1:8000/accounts/profile/",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Token " + token
            },
        };

        $.ajax(settings).done(function (response) {
            // $('#firstName').val(response['first_name']);
            // $('#lastName').val(response['last_name']);
            // $('#email').val(response['email']);
            // $('#phoneNumber').val(response['phone_number']);
            setFirstName(response['first_name']);
            setLastName(response['last_name']);
            setEmail(response['email']);
            setPhoneNumber(response['phone_number']);
            setImage(event, response['avatar']);
        });

        const settings6 = {
            "url": "http://127.0.0.1:8000/subs/mySubscription/",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Token " + token
            },
        };

        $.ajax(settings6).done(function (response) {
            if(response.hasOwnProperty("Membership")){
                $("#user_sub").text("You do not have a subscription.");


            }
            else{
                $("#user_sub").text("Current Subscription: $" + response['Amount']+" " +response["Plan"]);
                
            }
        });
    }


    const edit_profile = (event) =>{
        event.preventDefault();

        let info = {}
        if (firstName !== ""){
            info['first_name'] = firstName;
        }

        if (lastName !== ""){
            info['last_name'] = lastName;
        }

        if (email !== ""){
            info['email'] = email;
        }

        if (avatar !== ""){
            info['avatar'] = avatar;
        }

        if (phoneNumber !== ""){
            info['phone_number'] = parseInt(phoneNumber);
        }

        const settings = {
            "url": "http://127.0.0.1:8000/accounts/profile/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": "Token " + token,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(info),
            error: function(xhr){
                const res = JSON.parse(xhr.responseText);

                if(res.hasOwnProperty("email")){
                    $("#email_label").text(res["email"]);
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
            $('#change_status').text('Changes have been saved')
            setTimeout(() => {$('#change_status').text('')}, 2000);
        });
    }

    const redirect = (event, path) => {
        navigate(path);
    }

    const setImage = (event, imageName) => {
        $("#avatar_image").attr("src",require(`../../assets/avatars/${imageName}`));
    }

    const addAvatars = (event) => {
        let items = ['blue.png', 'red.png', 'anime1.jpg', 'anime2.jpg', 'arnold.jpg', 'gigachad.png', "Heisenberg.jpg",
        "karisu.png", "kaguya.jpg",  "rem.jpg", "light.jpg"]

        let curr_items = $('#avatar option').map((index, option) => option.value).toArray()

        items.forEach(item => {
            if (!(curr_items.includes(item)))
            {
                $('#avatar').append($('<option>', {text:`${item}`}));
            }
        })
    }

    useEffect(() => {
        if ((token === 'undefined' || token === undefined || token === null || token === '')){
            navigate("/register");
        }
        view_profile();
    }, []);

    return (
        <div>
            <section className="py-5">
                <div className="container py-5">
                    <div className="row mb-4 mb-lg-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 className="fw-bold">Profile</h2>
                        </div>
                    </div>
                    <img id="avatar_image"></img>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 col-xl-4">
                            <form id="register-form">
                                {/*<div className="mb-3"><input className="form-control" id="username" value ={username} onChange={u => setUsername(u.target.value)} type="username" name="username" placeholder="Username"/></div>*/}
                                {/*<div className="mb-3"><input className="form-control" id="password" value ={password} onChange={u => setPassword(u.target.value)} type="password" name="password" placeholder="Password"/></div>*/}
                                <div className="mb-3"><input className="form-control" id="firstName" value ={firstName} onChange={(u) => setFirstName(u.target.value)} type="firstName" name="firstName" placeholder="firstName"/></div>
                                <div className="mb-3"><input className="form-control" id="lastName" value ={lastName} onChange={(u) => setLastName(u.target.value)} type="lastName" name="lastName" placeholder="lastName"/></div>
                                <p id="email_label" style ={{color:"red"}}></p>
                                <div className="mb-3"><input className="form-control" id="email" value ={email} onChange={(u) => setEmail(u.target.value)} type="email" name="email" placeholder="email"/></div>
                                <p id="phone_label" style ={{color:"red"}}></p>
                                <div className="mb-3"><input className="form-control" id="phoneNumber" value ={phoneNumber} onChange={(u) => setPhoneNumber(u.target.value)} type="number" name="phoneNumber" placeholder="phoneNumber"/></div>


                                <p id="avatar_label" style ={{color:"red"}}></p>{/*<div className="mb-3"><input className="form-control" id="creditCard" value ={creditCard} onChange={u => setCreditCard(u.target.value)} type="number" name="creditCard" placeholder="creditCard"/></div>*/}
                                <select id="avatar" name="avatar" onClick={(event) => addAvatars(event)} onChange={(event) => {setImage(event, event.target.value); setAvatar(event.target.value)}} value={avatar}>
                                    <option id="initial-avatar" selected>Select Avatar</option>
                                </select>
                                <br></br>
                                <br></br>



                                <div className="mb-3">
                                    <p id='change_status'></p>
                                    <button id="register-button" className="btn btn-primary d-block w-100" type="submit" onClick={(event) => edit_profile(event)}>Save Changes</button>
                                </div>

                                <br/>
                                <label id="user_sub"></label>

                                <div className="Delete">
                                    <button id="deletesub--button" className="btn btn-primary d-block w-100" type="submit" onClick={(event) => redirect(event,"/subscriptions/cancel")}>Delete subscription</button>

                                </div>
                                <br/>
                                <div className="Payment">
                                    <button id="payment" className="btn btn-primary d-block w-100" type="submit" onClick={(event) => redirect(event,"/profile/payment")}>View Payment information</button>

                                </div>
                                <br/>
                                <label>Classes</label>
                                <div className="History"><button id="history" className="btn btn-success d-block w-100" type="submit" onClick={(event) => redirect(event,"/classhistory")}>View Your Class History</button>
                                </div>
                                <br/>
                                <div className="schedule"><button id="myschedule-button" className="btn btn-dark d-block w-100" type="submit" onClick={(event) => redirect(event,"/myschedule")}>My Schedule</button></div>
                                <br/>
                            </form>
                            <p>Want to sign out?</p>
                            <button id="login-button" className="btn btn-primary d-block w-100" type="submit" onClick={(event) => redirect(event, '/logout')}>Continue</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;