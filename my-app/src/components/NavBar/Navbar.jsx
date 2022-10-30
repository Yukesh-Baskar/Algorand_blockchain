/*global AlgoSigner*/
import React, { useState, useEffect } from 'react'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import CarouselPage from '../carousel/carousel'
import './Nav.css'
import {
    BrowserRouter as Router,
    useNavigate
} from "react-router-dom";
import Swal from 'sweetalert2'
import HomePage from '../homePage/HomePage';
import PopUp from '../popup/popup';




const NavBar = () => {
    const [state, setState] = useState('');
    const [isTriggered, setTriggered] = useState(false);
    const Navigate = useNavigate();
    const [userAddress, setUserAdresses] = useState([])
    // var userAddress = [];

    useEffect(() => {
        setTriggered()
        setState()
    }, []);


    const HideElements = () => {
        document.getElementsByClassName("HomePage").innerHTML = null;
    }

    const ConnectFunc = async () => {
        // console.log(userAddress);
        if (typeof AlgoSigner !== 'object') {
            return Swal.fire({
                title: "Wallet not found!!!",
                icon: 'error',
                text: `Install AlgoSigner wallet for connecting the wallet.`,
            });
        }

        const response = AlgoSigner.connect()
            .then((resp) => {
                // console.log(resp);
            }).catch((err) => {
                throw err;
            })
        const accounts = AlgoSigner.accounts({
            ledger: 'TestNet'
        })
            .then(async (res) => {
                await setUserAdresses(res)
                // console.log(userAddress);
                console.log(res)
                if (res.length > 1) {
                    setTriggered(true);
                    document.getElementById("wallet").style.display = "block"
                } else {
                    console.log("odjv");
                    setState(res[0].address)
                    document.getElementById("wallet").style.display = "block"
                }
            }).catch((err) => {
                throw err;
            })
        // console.log(userAddress);
        // triggerFunc()
    }

    // const triggerFunc = () => {
    //     setTriggered(true);
    // }

    return (
        <div>
            <main>
                <Navbar collapseOnSelect expand="lg" variant="dark" className='my-0'>
                    <Container >
                        <Navbar.Brand href="#home"><strong>MarketBucket</strong></Navbar.Brand>
                        <Navbar.Toggle onClick={() => HideElements()} aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="#features">Features</Nav.Link>
                                <Nav.Link href="#pricing">Pricing</Nav.Link>
                            </Nav>
                            <Nav>

                                <Nav.Link href={`/market/${state}`}>MarketPlace</Nav.Link>
                                <Nav.Link state href={`/dashBoard/${state}`}>
                                    DashBoard
                                </Nav.Link>

                                {/* <Nav.Link href="/SignUp">SignUp</Nav.Link> */}

                                <div className='my-0'>
                                    <Button onClick={ConnectFunc} className={"mx-2"} id="bt" >Connect Wallet</Button>
                                    <Button className='d' onClick={(props) => {
                                        props = { state }
                                        state === '' ? Swal.fire({
                                            title: "Connect wallet!!!",
                                            icon: 'error',
                                            text: `Connect wallet to create asset`,
                                        }) : Navigate("/createAsset", { state })
                                    }}>Create</Button>
                                    <p id='wallet' className='mx-2 my-1'>{state}</p>
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                {console.log(userAddress)}
                <div className='justify-content-center'>
                    <PopUp triggerStatus={isTriggered} usersAddress={userAddress} setTrigger={setTriggered} selectAddress={setState} />
                </div>
                <HomePage />
            </main>

        </div>
    )
}



export default NavBar;













// const NavBar = () => {
//     var [user,setData] = useState({
//         name : ""
//     })

//     let name;

//     const getState = async (e) => {
//         name = e.target.name
//     }

//     const setState = () => {
//         setData({
//             name : "hello"
//         })
//     }

//     return (
//         <div>
//             <input name='name' value={user.name} onChange={getState}></input>
//             <h1>{user.name}</h1>
//             <button onClick={setState}>ClickMe</button>
//         </div>
//     )
// }

