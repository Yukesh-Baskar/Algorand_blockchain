import React, { useState } from 'react'
import { Navbar, Carousel, Row, Col, Nav, NavDropdown } from 'react-bootstrap'
import NavBar from '../NavBar/Navbar'
import CarouselPage from '../carousel/carousel'
import ImageArray from './img.jsx'
import './homepage.css'
import 'bootstrap/dist/css/bootstrap.min.css';



const HomePage = (props) => {
    return (
        <div>
            {/* <NavBar /> */}
            <div className='HomePage'>
                <div className='d-flex my-5 justify-content-center'>
                    <div className='justify-content-center'>
                        <h1 className='leads justify-content-center text-center'>Buy,sell, and <span style={{color : "blue"}}> showcase </span> NFTs  </h1>
                        <p className='p d-flex justify-content-center'>from leading creators and brands</p>
                    </div>

                </div>
                <div className='Div2'>
                    <Col xs={8} md={{ span: 8, offset: 2 }}   >
                        <div className='justify-content-center d-block align-items-center text-center '>
                            <CarouselPage />
                        </div>
                    </Col>
                </div>
            </div>

        </div>
    )

}

export default HomePage;
