import React, {useState, useEffect} from "react";
import $ from 'jquery';
import Cookies from 'universal-cookie';
import './index.css'
const cookies = new Cookies();

// useEffect is used at beginning, can also make dependent on variable

function Payment(props){

    //const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [past, setPast] = useState([]);
    const [credit, setCredit] = useState("");
    const [future, setFuture] = useState([]);
    const [newCredit, setNewCredit] = useState("");
    const [amount, setAmount] = useState(12);

    let token = cookies.get('token');


    function changePayment(event)
    {
        event.preventDefault();
        const settings2 = {
            "url": "http://localhost:8000/accounts/edit_payment/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Token " + token,

            },
            "data": JSON.stringify({
                "credit_card": newCredit
            }),
            error: function(xhr){
                $("#error_label").text("Credit card value is incorrect");
                $("#success_label").text("");


            }
        };

        $.ajax(settings2).done(function (response) {
            $("#success_label").text("Successfully changed credit card!");
            $("#error_label").text("");

            setCredit(newCredit);
        });

    }

    const updatePayments = (event) => {
        let temp = amount + 12;
        if (temp === 62){
            $("#more").text("Done Loading");
        }
        if (temp > 50){
            temp = 50;
        }
        
        setAmount(temp);
        futurePayments();
    }

    const futurePayments = () => {
        const settings = {
                "url": "http://localhost:8000/accounts/view_payment/",
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + token,


                },
                "data": JSON.stringify({
                }),
                error: function(xhr){
                    alert("The server has an error. Perhaps it has not yet been set up.")
                }
            };

            $.ajax(settings).done(function (response) {
                setLoaded(true);
                setPast(response["Previous payments"].split(","));
                let future_installments = response["Future installments"].split(",");
                setFuture(future_installments.slice(0,amount));

            });
    }
    

    useEffect(()=>{

        futurePayments();
        updatePayments();

        const settings2 = {
            "url": "http://localhost:8000/accounts/edit_payment/",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Token " + token,

            },
            "data": JSON.stringify({
            }),
            error: function(xhr){
                alert("Could not Get payment")
            }
        };

        $.ajax(settings2).done(function (response) {
            setCredit(response["credit_card"]);





        });

    }, []);

    return (
        <div>
            <section>
                <div className="container">
                    Current payment method: Credit card # {credit}<br/>

                    Change payment method (enter credit card number):
                    <form id="register-form">
                        <div className="mb-3"><input type="text" className="form-control" id="firstName"  onChange={c=>setNewCredit(c.target.value)}  /></div>
                        <button id="change_credit" className="btn btn-primary d-block w-100" type="submit" onClick={(event) => changePayment(event)}>Change</button>



                    </form>
                    <br/>
                    <label id ="success_label" style ={{color:"green"}}></label>
                    <label id ="error_label" style ={{color:"red"}}></label>

                    <br/>


                    <div className="heading">
                        <h2>Previous payments</h2>
                        <table id="prev-table" className="table">
                            <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Time</th>
                                <th scope="col">Amount</th>
                            </tr>
                            </thead>
                            <tbody>


                            {past.map((sub,index) => (
                                <tr>
                                    <td>{sub.split("|")[0]}</td>
                                    <td>{sub.split("|")[1]}</td>
                                    <td> {sub.split("|")[2]}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="heading">
                        <h2>Future installment</h2>
                        <table id="future-table" className="table">
                            <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Time</th>
                                <th scope="col">Amount</th>
                            </tr>
                            </thead>
                            <tbody>


                            {future.map((sub,index) => (
                                <tr>
                                    <td>{sub.split("|")[0]}</td>
                                    <td>{sub.split("|")[1]}</td>
                                    <td> {sub.split("|")[2]}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button id="more" className="btn btn-primary d-block w-100" type="submit" onClick={(event) => updatePayments(event)}>Load More</button>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </div>
            </section>
        </div>)
}

export default Payment;