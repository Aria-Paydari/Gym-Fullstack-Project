import React, {useState, useEffect, useCallback} from "react";
import $ from 'jquery';
import {Link, useParams, useNavigate} from "react-router-dom";
import Cookies from 'universal-cookie';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// useEffect is used at beginning, can also make dependent on variable

// TODO: Finish Filter Update, Class pages, my_schedule

const cookies = new Cookies();

function Classes(props){

    //const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [classInfo, setClassInfo] = useState([]);
    const [studioName, setStudioName] = useState("");
    const [studioList, setStudioList] = useState([]);
    const [name, setName] = useState("");
    const [coach, setCoach] = useState("");
    const [st, setStartTime] = useState("");
    const [et, setEndTime] = useState("");
    const [sd, setStartDate] = useState("");
    let token = cookies.get('token');
    const navigate = useNavigate();

    useEffect(()=>{

        // LOAD STUDIOS

        let def_settings = {
            "url": "http://localhost:8000/places/nearby_studios/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "latitude": 21,
                "longitude": -3
            }),
            error: function(xhr){
                alert(xhr.responseText);
            }
        };
        
        if (!isLoaded){
            $.ajax(def_settings).done(function (response) {
                setLoaded(true);
                setStudioList(response);
                if (response.length > 0){
                    setStudioName(response[0].name);
                }
            });
        }

        // LOAD ALL CLASSES

        if (isLoaded){
            allClasses();
        }
        
    }, [isLoaded, studioName]);


    const allClasses = ()=>{
        let settings = {
            "url": "http://localhost:8000/places/filter_classes/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "studio_name": studioName,
                "type": "time_range",
                "value": "00:01,23:59"
            }),
            error: function(xhr){
                alert(xhr.responseText);
            }
        };

        $.ajax(settings).done(function (response) {
            setClassInfo(response);
        });
    }

    // Filter
    const filterRequest = (evt) => {
        evt.preventDefault();

        let requests = Array();

        let edited_date = sd.substring(5,7) + sd.substring(8) + sd.substring(2,4);
        let edited_time = st + "," + et;;

        if(name !== ""){
            let name_settings = {
                "url": "http://localhost:8000/places/filter_classes/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "studio_name": studioName,
                    "type": "class_name",
                    "value": name
                }),
                error: function(xhr){
                    alert(xhr.responseText);
                }
            };

            requests.push($.ajax(name_settings));
        }
        if (edited_time !== ","){
            let time_settings = {
                "url": "http://localhost:8000/places/filter_classes/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "studio_name": studioName,
                    "type": "time_range",
                    "value": edited_time
                }),
                error: function(xhr){
                    // alert(xhr.responseText);
                    $("#time-error").text(xhr.responseText.substring(2,xhr.responseText.length-2))
                }
            };

            requests.push($.ajax(time_settings));
        }
        if (edited_date !== ""){
            let date_settings = {
                "url": "http://localhost:8000/places/filter_classes/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "studio_name": studioName,
                    "type": "date",
                    "value": edited_date
                }),
                error: function(xhr){
                    alert(xhr.responseText);
                }
            };

            requests.push($.ajax(date_settings));
        }
        if (coach !== ""){
            let coach_settings = {
                "url": "http://localhost:8000/places/filter_classes/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "studio_name": studioName,
                    "type": "coach",
                    "value": coach
                }),
                error: function(xhr){
                    alert(xhr.responseText);
                }
            };

            requests.push($.ajax(coach_settings));
        }

        let wait = $.when.apply($, requests);
        wait.done(function(){
            
            if(requests.length === 0){
                allClasses();
                return;
            }
            else if(requests.length === 1){
                setClassInfo(arguments[0]);
            }
            else{
                let filteredArray = arguments[0][0];
                for(let i=1; i < requests.length; i++){
                    filteredArray = filteredArray.filter(studio => arguments[i][0].some(studio2 => studio.name === studio2.name));
                    setClassInfo(filteredArray);
                    
                }
            }
        });

    }

    const myschedule = () => {
        if (!token) {
            navigate('/login');
        }
        else {
            navigate('/myschedule');
        }
    }

    const redirect = (str) => {
        navigate("/classes/"+ studioName + "/" + str + "/");
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
                                    <h2 className="fw-bold">{studioName}</h2>
                                </div>
                            </div>
                            <div className="row d-flexs justify-content-center">
                                <div className="col-md-12">
                                    <ul class="list-group align-items-center">
                                        {classInfo.map((cls,index) => (
                                            // <li key={index}><button to={ "/classes/"+ studioName + ":" + cls.name + "/"}>{cls.name}</button> {cls.description} {cls.keywords} {cls.capacity} {cls.coach} {cls.times}</li>
                                            <button id="class-info" className="mb-3 btn btn-light d-block w-50 list-group-item" onClick={() => redirect(cls.name)}><b>{cls.name}</b><br/>Description: {cls.description} <br/>Capacity: {cls.capacity}<br/>Coach: {cls.coach}</button>
                                        ))}
                                    </ul>
                                </div>
                            </div>  
                        </div>
                        <div class="col">
                            <div className="row mb-4 mb-lg-5">
                                <div className="col-md-8 col-xl-6 text-center mx-auto">
                                    <h2 className="fw-bold">Classes Filters</h2>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center">
                                <div className="col-md-8">
                                    <select id="studio" name="studio" value={studioName} onChange={(e) => setStudioName(e.target.value)}>
                                            {studioList.map((stu) => (
                                            <option key={stu.name}>{stu.name}</option>
                                        ))}
                                    </select>
                                    <form id="filter-form">
                                        <div className="mb-3"><input type="text" className="form-control" id="className" name="className" placeholder="Class Name" onChange={(e) => setName(e.target.value)}/></div>
                                        <p id="time-error"></p>
                                        <div className="mb-3 input-group">
                                            <input className="form-control" type="time" id="start" name="start" min="00:01" max="23:59" onChange={(e) => setStartTime(e.target.value)}/>
                                            <span class="input-group-addon">-</span>
                                            <input className="form-control" type="time" id="end" name="end" min="00:01" max="23:59" onChange={(e) =>  setEndTime(e.target.value)}/>
                                        </div>
                                        <div className="mb-3"><input className="form-control" type="date" id="startd" name="startd" onChange={(e) =>  setStartDate(e.target.value)}/></div>
                                        <div className="mb-3"><input type="text" className="form-control" id="coachName" name="coachName" placeholder="Coach Name" onChange={(e) => setCoach(e.target.value)}/></div>
                                        <div className="mb-3">
                                            <p id='change_status'></p>
                                            <button id="filter-button" className="btn btn-dark d-block w-100" type="submit" onClick={filterRequest}>Filter</button>
                                        </div>
                                        <div className="mb-3">
                                            <p id='change_status2'></p>
                                            <button id="mysechdule-button" className="btn btn-dark d-block w-100" type="submit" onClick={myschedule}>My Schedule</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <br/>

    </>);
    
}

export default Classes;