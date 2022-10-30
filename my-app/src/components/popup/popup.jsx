/*global AlgoSigner */
import React from 'react'
import { useState } from 'react';
import { Button, InputGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2'
import './popup.css'


const PopUp = (props) => {
    const [selectedAddress, setSelectedAddrrss] = useState(null);
    if (!props.triggerStatus) return null;

    function setUserAddress(e) {
        console.log(e.target.value);
        setSelectedAddrrss(e.target.value)
    }

    function chooseAndClose() {
        if (selectedAddress === null) {
            return Swal.fire({
                title: "No Accounts choosed yet!!!",
                icon: 'error',
                text: `Kindly choose any of the acccounts.`,
            });
        } else {
            // console.log(selectedAddress);
            props.selectAddress(selectedAddress)
            props.setTrigger(false);
        }
    }

    return props.triggerStatus ? (
        <div className="container overlay text-white" id='con'>
            <form onChange={setUserAddress} className="form col-12">
                <div className="radio align-items-center d-absolute">
                    <center className='text-primary'>Select Account</center>
                    {props.usersAddress.map((user) => {
                        return (
                            <div key={user.address} id='inputDiv' >
                                <input type="radio" value={user.address} name="address" /><label style={{ padding: "10px" }}>{user.address}</label>
                            </div>
                        )
                    })}
                </div>
                <center><Button className='d' id='bttttn' onClick={chooseAndClose} >Submit</Button></center>
            </form>
        </div>) : ""
}

export default PopUp