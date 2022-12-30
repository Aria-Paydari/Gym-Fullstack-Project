import React from 'react';
import '../App.css';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();

    const redirect = (event, path) => {
        navigate(path);
    }
    return (
        <div>
            <div id="home-div">
                <h1 id="home-slogan">Fitness for all.</h1>
                {/*<section id="home-banner">*/}
                {/*    <div id="home-banner-text">*/}
                {/*        <h1>Welcome to the Toronto Fitness Club!</h1>*/}
                {/*        <img id = "mot" className="gallery-image" src={require(`../assets/images/motivational.png`)} alt=""/>*/}

                {/*    </div>*/}
                {/*</section>*/}
                {/*<h2 id = "sub-paragraph"> Options for all</h2>*/}
                {/*<h4 id="sub-text"> We offer a wide variety of subscriptions for all sorts, with different payment installments*/}
                {/*    as according to your needs.<br/>*/}
                {/*    And with all of our choices, you have access to:*/}
                {/*    <ul>*/}
                {/*        <li> All of our pools</li>*/}
                {/*        <li> All of our machines</li>*/}
                {/*        <li> Access to all locations</li>*/}
                {/*        ... and many more!*/}
                {/*        <br/>*/}
                {/*        <button id ="sub-button" onClick={(event) => redirect(event,"/subscriptions")}>Explore our memberships</button>*/}


                {/*    </ul>*/}
                {/*</h4>*/}

                {/*<h2 id = "class-paragraph" > Classes</h2>*/}
                {/*<img id = "mot" className="gallery-image" src={require(`../assets/images/motivational.png`)} alt=""/>*/}
            </div>
            <br></br>
            <section>
                <div id="home-info-container" className="container">
                    <h1>Options for all</h1>
                    <p>We offer a wide variety of subscriptions for all sorts, with different payment installments according to your needs.</p>
                    <p>With all of our choice, you have access to:</p>
                    <ui>
                        <li>All of our pools</li>
                        <li>All of our machines</li>
                        <li>Access to all locations</li>
                        <li>... and much more</li>
                    </ui>
                    <br></br>
                    <br></br>
                    <button className="btn btn-primary d-block w-100" id ="sub-button" onClick={(event) => redirect(event,"/studios")}>Studios for all</button>
                    <br></br>
                    <button className="btn btn-primary d-block w-100" id ="sub-button" onClick={(event) => redirect(event,"/subscriptions")}>Memberships for all</button>
                </div>
            </section>
        </div>
    );
};

export default Home;