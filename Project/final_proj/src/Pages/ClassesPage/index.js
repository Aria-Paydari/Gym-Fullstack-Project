import React, {useState, useEffect} from "react";
import $ from 'jquery';
import {useParams, useNavigate} from "react-router-dom";
import Cookies from 'universal-cookie';
import './index.css';
const cookies = new Cookies();
// useEffect is used at beginning, can also make dependent on variable

function ClassesPage(props){

    const [isLoaded, setLoaded] = useState(false);
    const [classInfo, setClassInfo] = useState([]);

    const {studio_name, class_name} = useParams();
    let token = cookies.get('token');
    const navigate = useNavigate();

    useEffect(()=>{
        let name_settings = {
            "url": "http://localhost:8000/places/filter_classes/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "studio_name": studio_name,
                "type": "class_name",
                "value": class_name
            }),
            error: function(xhr){
                alert(xhr.responseText);
            }
        };

        if (!isLoaded){
            $.ajax(name_settings).done(function (response) {
                setLoaded(true);
                setClassInfo(response[0]);
            }); 
        }
    }, []);

    const register = () => {
        if (!token) {
            navigate('/login');
        }
        else {
            let register_settings = {
                "url": "http://localhost:8000/places/my_classes/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + token
                },
                "data": JSON.stringify({
                    "name": class_name,
                    "request": "enroll"
                }),
                error: function(xhr){
                    // alert(xhr.responseText);
                    $("#success_label2").text("");
                    $("#success_label1").css('color', 'red');
                    $("#success_label1").text("You do not have a subscription");
                }
            };
    
            $.ajax(register_settings).done(function (response) {
                $("#success_label2").text("");
                $("#success_label1").text(response[0]);
            }); 
        }
    }

    const drop = () => {
        if (!token) {
            navigate('/login');
        }
        else {
            let drop_settings = {
                "url": "http://localhost:8000/places/my_classes/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + token
                },
                "data": JSON.stringify({
                    "name": class_name,
                    "request": "drop"
                }),
                error: function(xhr){
                    // alert(xhr.responseText);
                    $("#success_label1").text("");
                    $("#success_label2").css('color', 'red');
                    $("#success_label2").text("You do not have a subscription");
                }
            };
    
            $.ajax(drop_settings).done(function (response) {
                $("#success_label1").text("");
                $("#success_label2").text(response[0]);
            }); 
        }
    }

    const classtimes = (str) => {
        if (classInfo.times !== undefined && str === "times"){
            let times = classInfo.times.split("|");
            return <p>{times[0]} from {times[1]} to {times[2]}</p>
        }
        else if (classInfo.times !== undefined && str === "ends"){
            let times = classInfo.times.split("|");
            return <p>{times[4].substring(4)}/{times[4].substring(2,4)}/{times[4].substring(0,2)}</p>
        }
    }

    return (
        <>
            <div>
                <section className="py-5">
                    <div className="container py-5">
                        <div className="row">
                            <div class="col">
                                <div className="row mb-4 mb-lg-5">
                                    <div className="col-md-8 col-xl-6 text-center mx-auto">
                                        <h2 className="fw-bold">{classInfo.name}</h2>
                                    </div>
                                </div>
                                <div className="row d-flexs justify-content-center">
                                    <div className="col-md-3">
                                        <p class="body-text"><b>Description: </b>{classInfo.description}</p>
                                        <p class="body-text"><b>Tags: </b>{classInfo.keywords}</p>
                                        <p class="body-text"><b>Current Capacity: </b>{classInfo.capacity}</p>
                                        <p class="body-text"><b>Instructor: </b>{classInfo.coach}</p>
                                        <p class="body-text" id="times"><b>Time: </b>{classtimes("times")}</p>
                                        <p class="body-text" id="ends"><b>Class Ends: </b>{classtimes("ends")}</p>
                                        <label id ="success_label1" style ={{color:"green"}}></label>
                                        <button id="register-class" onClick={() => register()} className="btn btn-dark d-block w-100" type="button">Register</button>
                                        <label id ="success_label2" style ={{color:"green"}}></label>
                                        <button id="drop-class" onClick={() => drop()} className="btn btn-dark d-block w-100" type="button">Drop</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <br/>

        </>)
}

export default ClassesPage;