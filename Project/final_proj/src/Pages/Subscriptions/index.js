import React, {useState, useEffect} from "react";
import $ from 'jquery';
import Cookies from 'universal-cookie';
import {useNavigate} from "react-router-dom";
import './index.css'
const cookies = new Cookies();


// useEffect is used at beginning, can also make dependent on variable

function Subscriptions(props){

    const navigate = useNavigate()

    const [isLoaded, setLoaded] = useState(false);
    const [items, setItems] = useState([]);
    let token = cookies.get('token');


    function addsub(event, amount, type)
    {
        const settings2 = {
            "url": "http://localhost:8000/subs/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Token " + token,
                
            },
            "data": JSON.stringify({
                "plan": type,
                "amount": amount
            }),
            error: function(xhr){
                navigate('/login');
            }
        };

        $.ajax(settings2).done(function (response) {
            $("#success_label").text("Successfully Added subscription!");
        });
        
    }

useEffect(()=>{
    console.log("inja");
    const settings = {
        "url": "http://localhost:8000/subs/",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
        }),
        error: function(xhr){
            alert("The server has an error. Perhaps it has not yet been set up.")
            navigate('/login')
        }
    };

    $.ajax(settings).done(function (response) {
        setLoaded(true);
        setItems(response);
    });
    
}, []);

    return (
        <div>
            <section>
                <div className="container">
                    <label id ="success_label" style ={{color:"green"}}></label>
                    <br/>

                    <div className="heading">
                        <h2>Subscriptions</h2>
                        <table id="subs-table" className="table">
                            <thead>
                            <tr>
                                <th scope="col">Price</th>
                                <th scope="col">Type</th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>


                            {items.map((sub,index) => (
                                <tr>
                                    <td>${sub.amount}</td>
                                    <td>{sub.plan}</td>
                                    <td><button id="add-button" className="btn btn-primary d-block"  type="submit" onClick={(event) => addsub(event, sub.amount, sub.plan)}>Subscribe</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>)
}


export default Subscriptions;