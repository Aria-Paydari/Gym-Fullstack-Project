import React, {useEffect, useState} from "react";
import $ from 'jquery';
import {useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// useEffect is used at beginning, can also make dependent on variable
// this is a new comment.

function StudioPage(props) {

    //const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [studioInfo, setStudioInfo] = useState({});
    const [schedule, setSchedule] = useState([]);
    const [location, setLocation] = useState([]);


    const {studio_name} = useParams();

    function setAmenities(amenities){
        $('#amenities-table').empty();
        $('#amenities-table').append(`<thead>
                            <tr>
                                <th class="studio-table-heading" scope="col"></th>
                                <th class="studio-table-heading" scope="col">Type</th>
                                <th class="studio-table-heading" scope="col">Quantity</th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>`)

        amenities = amenities.split(',');
        amenities.forEach(item => {
            item = item.split(':');
            let key = item[0];
            let value = item[1];
            $('#amenities-table').append(`<tr>
                                            <th class="studio-table-heading" scope="row"></th>
                                                <td class="studio-table-value">${key}</td>
                                                <td class="studio-table-value">${value}</td>
                                          </tr>`)
        });
    }

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
        $('#schedule-table').empty();
        $('#schedule-table').append(`<thead>
                            <tr>
                                <th class="studio-table-heading" scope="col"></th>
                                <th class="studio-table-heading" scope="col">Monday</th>
                                <th class="studio-table-heading" scope="col">Tuesday</th>
                                <th class="studio-table-heading" scope="col">Wednesday</th>
                                <th class="studio-table-heading" scope="col">Thursday</th>
                                <th class="studio-table-heading" scope="col">Friday</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th class="studio-table-heading" scope="row"></th>
                                <td class="studio-table-value">${translateSchedule(schedule.Monday)}</td>
                                <td class="studio-table-value">${translateSchedule(schedule.Tuesday)}</td>
                                <td class="studio-table-value">${translateSchedule(schedule.Wednesday)}</td>
                                <td class="studio-table-value">${translateSchedule(schedule.Thursday)}</td>
                                <td class="studio-table-value">${translateSchedule(schedule.Friday)}</td>
                            </tr>
                            </tbody>`)
    }

    function addImages(images){
        $('#images').empty();
        let arr = images.split(',');
        arr.forEach(image => {
            $('#images').append(`<div class="col-md-6 col-lg-4">
                                    <div class="card">
                                        <img class="gallery-image" src=${require(`../../assets/studios/${image}`)} alt="">
                                    </div>
                                </div>`)
        })
    }

    useEffect(() => {
        let settings = {
            "url": "http://localhost:8000/places/studio/" + studio_name + "/",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({}),
            error: function (xhr) {
                alert(xhr.responseText);
            }
        };

        $.ajax(settings).done(function (response) {
            setLoaded(true);
            setStudioInfo(response);
            let locationText = response['location'];
            locationText = locationText.replace(' ', '').split(',');
            setLocation(`${locationText[1]},${locationText[0]}`);
            setAmenities(response['amenities'])
            addImages(response['images'])
        });

        const settings2 = {
            "url": "http://localhost:8000/places/studio_schedule/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "studio_name": studio_name
            }),
        };

        $.ajax(settings2).done(function (response) {
            setSchedule(response);
            setScheduleInfo(response);
        });

    }, []);

    return (
        <div>
            <br></br>
            <h1 className="studio-heading">{studioInfo.name}</h1>

            <section>
                <div className="container">

                    <div className="heading">
                        <h2>Amenities</h2>
                        <table id="amenities-table" className="table">
                            <thead>
                            <tr>
                                <th className="studio-table-heading" scope="col"></th>
                                <th className="studio-table-heading" scope="col">Type</th>
                                <th className="studio-table-heading" scope="col">Quantity</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th className="studio-table-heading" scope="row"></th>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="heading">
                        <h2>Schedule</h2>
                        <table id="schedule-table" className="table">
                            <thead>
                            <tr>
                                <th className="studio-table-heading" scope="col"></th>
                                <th className="studio-table-heading" scope="col">Monday</th>
                                <th className="studio-table-heading" scope="col">Tuesday</th>
                                <th className="studio-table-heading" scope="col">Wednesday</th>
                                <th className="studio-table-heading" scope="col">Thursday</th>
                                <th className="studio-table-heading" scope="col">Friday</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th className="studio-table-heading" scope="row"></th>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="heading">
                        <h2>Gallery</h2>
                    </div>
                    <div id="images" className="row">
                    </div>
                    <div id='location' className="heading">
                        <h2>Location</h2>
                        <p>Address: {studioInfo.address}</p>
                        <p>Postal Code: {studioInfo.postal_code}</p>
                        <p><a href={studioInfo.directions}>Directions</a></p>
                        <iframe id="map-image" src={`https://api.mapbox.com/STYLE_HERE/static/url-https%3A%2F%2Fdummyimage.com%2F20x20%2F1a00ff%2F1a00ff.png(${location})/auto/1200x1200?access_token=API_KEY_HERE`}></iframe>
                    </div>
                </div>
            </section>


        </div>
    );
}

export default StudioPage;