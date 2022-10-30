import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Navbar, Container, Card } from "react-bootstrap";
import { Link, useParams,useNavigate} from 'react-router-dom'
// import Swal from "sweetalert2";
import './dashBoard.css'
import FormData from 'form-data'
// import MarketPlace from '../MarketPlace/market.jsx'

const DashBoard = () => {
  const { userAddress } = useParams()
  let [userAssets, setUserAssets] = useState([])
  var [sellStatus ,setSellStatus] = useState(false)
  const navigate = useNavigate()

  // if (userAddress === '') {
  //   alert("empty")
  // }

  const Data = new FormData()

  Data.append('userAccountAddress', userAddress)

  useEffect(async () => {
    await axios.get(`http://localhost:9966/createAsset/getAssets/${userAddress}`)
      .then(async resp => {
        await setUserAssets(resp.data)
      }).catch(err => {
        setUserAssets(err.response.status)
      })
  }, [])

  const onClickFun = (event,param) => {
    setSellStatus(true)
    navigate(`/market/${userAddress}`, {state: {param}})
  }  
  return (
    <div className="container y ">
      <nav>
        <Navbar variant="dark">
          <Container>
            <Navbar.Brand href="#home" ><strong>MarketBucket</strong></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Navbar.Brand className="text-primary"><strong>User Address</strong></Navbar.Brand>
              <p className='text-white my-3 d'>{userAddress}</p>
              <div className='d-block'>
                <Link to="/"><Button className='d'>Back</Button></Link>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </nav>
      <div>
        {/* {console.log(userAssets)} */}
        {userAssets === 401 ?
          <div className="text-white my-4 justify-content-center">
            <center><h5>The user doesn't created any NFT's yet</h5></center>
            <center><button className="bg-primary d text-white">Create</button></center>
          </div> :
          userAssets.map((users) => {
            // console.log(users);
            return (
              <div className='grid my-5 text-center text-success'>
                <Card className="box" key={users.tokenName} style={{ width: '18rem' }} >
                  {console.log(users.File_URL)}
                  <Card.Img  key={users.File_URL}   id="img" variant="top" src={users.File_URL} />
                  <Card.Body>
                    <Card.Title>Token Name : {users.tokenName}</Card.Title>
                    <Card.Text>
                      Asset ID : {users.tokenId}
                    </Card.Text>
                    <Card.Text>
                      TotalSupply : {users.totalSupply}
                      {
                        sellStatus ? "" : <Button className="d" onClick={event => onClickFun(event,users)}>Sell</Button>
                      }
                    </Card.Text>
                    {/* <Link to="/market"><Button variant="primary" className="d" onClick={sendData}>Sell</Button></Link> */}
                  </Card.Body>
                </Card>
              </div>)
          })}
      </div>
    </div>
  )
}

export default DashBoard;