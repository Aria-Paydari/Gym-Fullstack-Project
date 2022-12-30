import React, {useState, useEffect} from "react";
import $ from 'jquery';
import {useParams} from "react-router-dom";
import Cookies from 'universal-cookie';
import './index.css'
const cookies = new Cookies();
// useEffect is used at beginning, can also make dependent on variable

function MySchedule(props){

    const [isLoaded, setLoaded] = useState(false);
    const [schedule, setSchedule] = useState([]);
    let token = cookies.get('token');

    useEffect(()=>{
        let name_settings = {
            "url": "http://localhost:8000/places/my_classes/",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            },
            "data": JSON.stringify({
            }),
            error: function(xhr){
                alert(xhr.responseText);
            }
        };

        if (!isLoaded){
            $.ajax(name_settings).done(function (response) {
                setLoaded(true);
                setScheduleInfo(response);
            }); 
        }
    }, []);

    function translateSchedule(arr){
        if (arr.length === 0){
            return "NO CLASSES";
        }

        let text = "";
        arr.forEach(item => {
            text += `<ul>${item[0]}
                        <li>Start Time: ${item[1]}</li>
                        <li>End Time: ${item[2]}</li>
                        <li>End Time: ${item[3]}</li>
                        <li>Description: ${item[4]}</li>
                        <li>Capacity: ${item[5]}</li>
                        <li>Coach: ${item[6]}</li>
                    </ul>`
        })
        return text;
    }

    function setScheduleInfo(schedule){
        $('#my-schedule-table').empty();
        $('#my-schedule-table').append(`<thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Monday</th>
                                <th scope="col">Tuesday</th>
                                <th scope="col">Wednesday</th>
                                <th scope="col">Thursday</th>
                                <th scope="col">Friday</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row"></th>
                                <td>${translateSchedule(schedule.Monday)}</td>
                                <td>${translateSchedule(schedule.Tuesday)}</td>
                                <td>${translateSchedule(schedule.Wednesday)}</td>
                                <td>${translateSchedule(schedule.Thursday)}</td>
                                <td>${translateSchedule(schedule.Friday)}</td>
                            </tr>
                            </tbody>`)
    }

    return (
        <>
        <section className="py-5">
            <div className="container py-5">
                <div className="container">
                    <h1>My Schedule</h1>
                    <table id="my-schedule-table" className="table">
                        <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Monday</th>
                            <th scope="col">Tuesday</th>
                            <th scope="col">Wednesday</th>
                            <th scope="col">Thursday</th>
                            <th scope="col">Friday</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row"></th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
            
        </>)
}

export default MySchedule;