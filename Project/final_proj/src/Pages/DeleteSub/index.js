import React, {useState} from "react";
import {Button} from "react-bootstrap";
import Cookies from 'universal-cookie';
import $ from "jquery";
const cookies = new Cookies();

const DeleteSub = () => {
    const [buttonText, setButtonText] = useState('Continue');
    let token = cookies.get('token');



    function deleteSubscription(){

        const settings = {
            "url": "http://localhost:8000/subs/",
            "method": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Token " + token,
                "Cookie": "csrftoken=PcfubTYmFXjzzXy5uyDTtfhX8j0y22LD"
            },
            "data": JSON.stringify({
            }),
            error: function(xhr){
                // if (xhr.status === 404){
                //     alert("The server has an error. Perhaps it has not yet been set up.")
                //
                //     setLoaded(true);
                //
                // }

                alert("You do not have a subscription to delete.")
            }
        };

        $.ajax(settings).done(function (response) {
            //subList = response.map((sub)=> <li>{JSON.stringify(sub)}</li>);


            setButtonText("Subscription successfully deleted.")

        });
        
    }



    return (
        <div>
            <section className="py-5">
                <div className="container py-5">
                    <div className="row mb-4 mb-lg-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 className="fw-bold">Would you like to cancel your subscription?</h2>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <Button id="logout-button" onClick={deleteSubscription}>{buttonText}</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DeleteSub;