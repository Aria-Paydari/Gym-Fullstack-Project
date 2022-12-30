import React, {useState, useEffect} from "react";
import $ from 'jquery';
// useEffect is used at beginning, can also make dependent on variable

function Submit(props){

    const [username, setUsername] = useState("");
    const[password, setPassword]= useState("");
    const[firstName, setFirstName]= useState("");
    const[lastName, setLastName]= useState("");
    const[email, setEmail]= useState("");
    const[phoneNumber, setPhoneNumber]= useState("");
    const[avatar, setAvatar]= useState("");
    const[creditCard, setCreditCard]= useState("");




    const userSubmit = (evt) => {
        evt.preventDefault();

        const settings = {
            "url": "http://localhost:8000/accounts/register/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "username": username,
                "password": password,
                "first_name": firstName,
                "last_name": lastName,
                "email" :email,
                "avatar": "example.jpg",
                "phone_number": parseInt(phoneNumber),
                "credit_card": creditCard

            }),
            error: function(xhr){
            }
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    }
    return (
        <>
            <form onSubmit={userSubmit} id ="loginForm">
                <label> Username: </label>
                <input type = "text" value ={username} onChange={u => setUsername(u.target.value)} id ="username"/>
                <br/>

                <label> Password: </label>
                <input type = "text" value ={password} onChange={u => setPassword(u.target.value)} id ="password"/>
                <br/>
                <label> First Name: </label>
                <input type = "text" value ={firstName} onChange={u => setFirstName(u.target.value)} id ="first_name"/>
                <br/>
                <label> Last Name: </label>
                <input type = "text" value ={lastName} onChange={u => setLastName(u.target.value)} id ="last_name"/>
                <br/>
                <label> Email: </label>
                <input type = "text" value ={email} onChange={u => setEmail(u.target.value)} id ="email"/>
                <br/>
                <label> Phone Number: </label>
                <input type = "text" value ={phoneNumber} onChange={u => setPhoneNumber(u.target.value)} id ="phone_number"/>
                <br/>

                <label> Credit Card: </label>
                <input type = "text" value ={creditCard} onChange={u => setCreditCard(u.target.value)} id ="phone_number"/>
                <br/>

            </form>
            <button id="signin_button" form ="loginForm" value = "login_btn">Register</button> <br/>
            <a href ="#">Have a membership? Sign in here</a>

        </>)
}

export default Submit;