import React, {useEffect, useState} from "react";
import './index.css';
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import {useNavigate} from "react-router-dom";
const cookies = new Cookies();



const ClassHistory = () => {
    const[isLoaded, setIsLoaded]= useState(false);
    const[history, setHistory]= useState([]);
    const[more, setMore]= useState(false);
    const navigate = useNavigate()
    let token = cookies.get('token');

    const view_history = () =>{
        const settings = {
            "url": "http://127.0.0.1:8000/places/class_history/",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Token " + token
            },
            "data": JSON.stringify({
            }),
            error: function(xhr){
                // alert(xhr.responseText);
            }
        };

        $.ajax(settings).done(function (response) {
            setIsLoaded(true);
            setHistory(response.reverse());
        });
    }

    const redirect = (path) => {
        navigate(path);
    }

    const historyList = () => {
        var lst = history.map(item => <div class="p-2 border border-info rounded m-1 history-item"> <h5>{item[1]}</h5><p>{item[0]}</p> </div>);
        return <div className="d-flex flex-row flex-wrap justify-content-center">{lst}</div>
    }

    useEffect(() => {
        view_history();
    }, []);

    return (
        <div>
            <section className="py-5">
                <div className="container py-5">
                    <div className="row mb-4 mb-lg-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 className="fw-bold">My Class History</h2>
                        </div>
                    </div>
                    {historyList()}
                    
                </div>
            </section>
        </div>
    );
};

export default ClassHistory;