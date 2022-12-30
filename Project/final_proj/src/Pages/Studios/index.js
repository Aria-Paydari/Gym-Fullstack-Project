import React, {useState, useEffect, useRef} from "react";
import $ from 'jquery';
import {Link} from "react-router-dom";
import Cookies from 'universal-cookie';
import './index.css';
import Map, { GeolocateControl } from "react-map-gl";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from 'mapbox-gl';
import geoJson from "./studio-locations.json";

const cookies = new Cookies();


// useEffect is used at beginning, can also make dependent on variable

function Studios(props) {

    //const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [studios, setStudios] = useState([]);
    const [studio_name, set_studio_name] = useState("");
    const [amenity, setAmenity] = useState("");
    const [className, setClassName] = useState("");
    const [coach, setCoach] = useState("");
    const [latitude, setLatitude] = useState(43.659619796669716 );
    const [longitude, setLongitude] = useState(-79.3969221250516);


// Taken from mapbox documentation
    // At https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder-accept-coordinates/
    function callMap(){

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [longitude, latitude],
            zoom: 10,
        });
        
        map.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            localGeocoder: coordinatesGeocoder,
            zoom: 4,
            placeholder: 'Try: -40, 170',
            mapboxgl: mapboxgl,
            reverseGeocode: true
        }))

        geoJson.features.map((feature) =>
            new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).addTo(map)
        );
    }

    const coordinatesGeocoder = function (query) {
// Match anything which looks like
// decimal degrees coordinate pair.
        
        const matches = query.match(
            /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
        );
        if (!matches) {
            return null;
        }

        function coordinateFeature(lng, lat) {
            
            return {
                center: [lat, lng],
                geometry: {
                    type: 'Point',
                    coordinates: [lat, lng]
                },
                place_name: 'Lat: ' + lat + ' Lng: ' + lng,
                place_type: ['coordinate'],
                properties: {},
                type: 'Feature'
            };
        }

        const coord1 = Number(matches[1]);
        const coord2 = Number(matches[2]);
        setLongitude(coord1);
        setLatitude(coord2);
        set_studio_name('');
        setAmenity('');
        setClassName('');
        setCoach('');
        allStudios();
        const geocodes = [];

        if (coord1 < -90 || coord1 > 90) {
// must be lng, lat
            geocodes.push(coordinateFeature(coord1, coord2));
        }

        if (coord2 < -90 || coord2 > 90) {
// must be lat, lng
            geocodes.push(coordinateFeature(coord2, coord1));
        }

        if (geocodes.length === 0) {
// else could be either lng, lat or lat, lng
            geocodes.push(coordinateFeature(coord1, coord2));
            geocodes.push(coordinateFeature(coord2, coord1));
        }

        return geocodes;
    };

    useEffect(() => {
        allStudios();

        callMap();

        // new mapboxgl.Marker().setLngLat([-79.39692, 43.65962]).addTo(map)
    }, []);



    const allStudios = () => {
        let settings = {
            "url": "http://localhost:8000/places/nearby_studios/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                // "Authorization": "Token " + cookies.get('token'),
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "latitude": latitude,
                "longitude": longitude
            }),
            error: function (xhr) {
                // alert(xhr.responseText);
                $("#latitude-error").text(xhr.responseText["latitude"]);
            }
        };

        $.ajax(settings).done(function (response) {
            setLoaded(true);
            setStudios(response);

        });

    }

    const getLocation = (evt) => {
        let search = $("#location").val();
        search = search.replace(' ', '%20').replace(',', '');

        const settings = {
            "url": `https://api.geoapify.com/v1/geocode/search?text=${search}&format=json&apiKey=API_KEY_HERE`,
            "method": "GET",
            "timeout": 0,
            async: false
        };

        return $.ajax(settings).done(function (response) {
            let latNum = response['results'][0]['lat'];
            let lonNum = response['results'][0]['lon'];


            setLatitude(latNum);
            setLongitude(lonNum);


            
            set_studio_name('');
            setAmenity('');
            setClassName('');
            setCoach('');
            allStudios();

            callMap();
            

        });
    }

    const filterSubmit = (evt) => {
        evt.preventDefault();

        let requests = Array();

        if (studio_name !== "") {

            const settings2 = {
                "url": "http://localhost:8000/places/filter_studios/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "type": "name",
                    "value": studio_name

                }),
                error: function (xhr) {
                }
            };

            requests.push($.ajax(settings2));
        }
        if (amenity !== "") {

            const settings3 = {
                "url": "http://localhost:8000/places/filter_studios/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "type": "amenities",
                    "value": amenity

                }),
                error: function (xhr) {
                }
            };

            requests.push($.ajax(settings3));
        }
        if (className !== "") {

            const settings4 = {
                "url": "http://localhost:8000/places/filter_studios/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "type": "class_name",
                    "value": className

                }),
                error: function (xhr) {
                }
            };
            requests.push($.ajax(settings4));
        }
        if (coach !== "") {

            const settings4 = {
                "url": "http://localhost:8000/places/filter_studios/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "type": "coach",
                    "value": coach

                }),
                error: function (xhr) {
                }
            };
            requests.push($.ajax(settings4));
        }

        let wait = $.when.apply($, requests);
        wait.done(function () {

            if (requests.length === 0) {
                allStudios();
                return;
            } else if (requests.length === 1) {
                setStudios(arguments[0]);
            } else {
                let filteredArray = arguments[0][0];
                for (let i = 1; i < requests.length; i++) {
                    filteredArray = filteredArray.filter(studio => arguments[i][0].some(studio2 => studio.name === studio2.name));
                    setStudios(filteredArray);

                }
            }
        });
    }

    mapboxgl.accessToken = 'API_KEY_HERE';

    const mapContainer = useRef(null);
    // const map = useRef(null);
    const [lng, setLng] = useState(-79.3969221250516);
    const [lat, setLat] = useState(43.659619796669716);
    const [zoom, setZoom] = useState(9);

    const setLocation = (evt) => {
        let latText = $('#latitude').val();
        let lonText = $('#longitude').val();

        let latNum = parseFloat(latText);
        if (!isNaN(latNum)){
            if (-90 <= latNum && latNum <= 90){
                $('#latitude-error').text("");
                setLatitude(latNum);
            }

            else{
                $('#latitude-error').text("Latitude must be an integer or float in [-90, 90]");
            }
        }

        let lonNum = parseFloat(lonText);
        if (!isNaN(lonNum)){
            if (-180 <= lonNum && lonNum <= 180){
                $('#longitude-error').text("");
                setLongitude(lonNum);
            }

            else{
                $('#longitude-error').text("Latitude must be an integer or float in [-180, 180]");
            }
        }
    }


    return (
        <div>

            <section>
                <div className="container">
                    <div className="heading">
                        <h2>Map</h2>
                        
                        <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css" type="text/css"/>
                        <div>
                            <div ref={mapContainer} className="map-container" />
                        </div>
                        <br></br>
                        <p>Enter your location (address or postal code):</p>
                        <form id="filterForm" onSubmit={filterSubmit}>
                            <div className="mb-3"><input className="form-control" id="location" type="text" name="location" placeholder="Location"/></div>
                            <div className="mb-3">
                                <button id="location-button" className="btn btn-primary d-block w-100" type="submit" onClick={(event) => getLocation(event)}>Find</button>
                                <button id="location-button2" className="btn btn-primary d-block w-100" type="submit" onClick={(event) => getLocation(event)}>Apply</button>

                            </div>
                        </form>
                    </div>
                    <div className="heading">
                        <h2>Filter</h2>
                        <p>Note: Leaving filters empty will get all studios.</p>
                        <form id="filterForm" onSubmit={filterSubmit}>
                            <div className="mb-3"><input className="form-control" value={studio_name} onChange={u => set_studio_name(u.target.value)} id="username" type="username" name="username" placeholder="Name"/></div>
                            <div className="mb-3"><input className="form-control" value={amenity} onChange={u => setAmenity(u.target.value)} id="amenity" type="amenity" name="amenity" placeholder="Amenity"/></div>
                            <div className="mb-3"><input className="form-control" value={className} onChange={u => setClassName(u.target.value)} id="className" type="className" name="className" placeholder="Class Name"/></div>
                            <div className="mb-3"><input className="form-control" value={coach} onChange={u => setCoach(u.target.value)} id="coach" type="coach" name="coach" placeholder="Coach"/></div>
                            <div className="mb-3">
                                <button id="filter_button" className="btn btn-primary d-block w-100" type="submit">Continue</button>
                            </div>
                        </form>
                    </div>
                    <div className="heading">
                        <h2>Studios</h2>
                        <table id="amenities-table" className="table">
                            <thead>
                            <tr>
                                <th className="studio-table-heading" scope="col"></th>
                                <th className="studio-table-heading" scope="col">Name</th>
                                <th className="studio-table-heading" scope="col">Address</th>
                                <th className="studio-table-heading" scope="col">Location</th>
                                <th className="studio-table-heading" scope="col">Postal Code</th>
                                <th className="studio-table-heading" scope="col">Phone Number</th>
                                <th className="studio-table-heading" scope="col">Amenities</th>
                                <th className="studio-table-heading" scope="col">Distance</th>
                                <th className="studio-table-heading" scope="col">Directions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {studios.map((stu, index) => (
                                <tr>
                                    <th className="studio-table-heading" scope="row"></th>
                                    <td className="studio-table-heading" scope="row">
                                        <Link to={"/studios/" + stu.name + "/"}>{stu.name}</Link>
                                    </td>
                                    <td className="studio-table-heading" scope="row">{stu.address}</td>
                                    <td className="studio-table-heading" scope="row">{stu.location}</td>
                                    <td className="studio-table-heading" scope="row">{stu.postal_code}</td>
                                    <td className="studio-table-heading" scope="row">{stu.phone_number}</td>
                                    <td className="studio-table-heading" scope="row">{stu.amenities}</td>
                                    <td className="studio-table-heading" scope="row">{stu.distance}</td>
                                    <td className="studio-table-heading" scope="row">
                                        <a href={stu.directions}>Directions</a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </div>
            </section>

        </div>);
}

export default Studios;