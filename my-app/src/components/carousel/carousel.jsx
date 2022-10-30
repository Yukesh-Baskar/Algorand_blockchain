import React from "react"
import { Navbar, Carousel, Row, Col, Nav, NavDropdown, Button } from 'react-bootstrap'
import './carosel.css'



const CarouselPage = () => {
    return (
        <div className="mmy-5 ">
            <Carousel fade className="d-block">
                <Carousel.Item className="im" >
                    <img className="d-block "
                        src="https://d2vi0z68k5oxnr.cloudfront.net/195dfb70-4a11-4427-aee5-32dfc4929bd8/original.jpeg?d=lg-cover"
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item className="d-block" >
                    <div className="d-block">
                        <img
                            className="d-block images"
                            src="https://d2vi0z68k5oxnr.cloudfront.net/e09562c2-5b3a-4370-abdc-67ac372e5d2d/original.jpeg?d=md-cover"
                            alt="Second slide"
                        />
                        <Carousel.Caption >
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "500px", color: 'white' }}>
                                <center><h1>The City Of Crypto's</h1></center>
                            </div>
                        </Carousel.Caption>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block"
                        src="https://d2vi0z68k5oxnr.cloudfront.net/90d5d97f-9165-480c-9839-537102212140/original.jpeg?d=md-cover"
                        alt="Third slide"
                    />
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default CarouselPage;
