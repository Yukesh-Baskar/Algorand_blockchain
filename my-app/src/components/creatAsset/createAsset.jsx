/*global AlgoSigner*/
import React, { useState, useEffect } from 'react'
import './createAsset.css'
import { Navbar, Container, Nav, NavDropdown, Button, Col, Form, Spinner } from 'react-bootstrap'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import crypto from 'crypto'
import Swal from 'sweetalert2'
import axios from 'axios'
import algosdk from 'algosdk'
import { CirclesWithBar } from 'react-loader-spinner'

function CreateAsset() {
  const [data, setData] = useState({
    tokenName: "", tokenId: "", totalsupply: "", NFT_URL: ""
  })
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState('')
  const [img, setImage] = useState()
  const [url, setUrl] = useState('');
  const [txnHash, setTrxnHash] = useState(null)

  useEffect(() => {
    setLoading()
  }, [])

  let location = useLocation()
  const userAddress = location.state
  const getData = (e) => {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }

  const getFileData = (e) => {
    const file = e.target.files[0];
    const file1 = e.target.files[0];
    setImage(URL.createObjectURL(file1))
    setFile(file)
  }

  const SetData = async (e) => {
    setLoading(true)
    var a = [document.getElementById('tokenName').value, document.getElementById('totalsupply').value]
    for (let i = 0; i < a.length; i++) {
      if (a[i] === '') {
        setLoading(false)
        return Swal.fire({
          title: "error",
          icon: 'error',
          text: `Empty field cant be accepted ${a[i]}`,
        })
      }
    }

    const Data1 = new FormData();
    Data1.append('file-upload', file)

    var URL;

    await axios.post('http://localhost:9966/createAsset/uploadImage', Data1)
      .then(async resp => {
        await setUrl(resp.data)
        URL = await resp.data
        console.log(URL);
    })

    e.preventDefault();
    const Data = new FormData()
    // const File = { file }
    let tokenId = data.tokeId;
    await tokenId++

    const testServer = "https://testnet-algorand.api.purestake.io/ps2";
    const token = {
      'x-API-key': "tzV5ZpDgtqaBUzskSO6Ly8TyYVlguUyt75iqYpsa"
    }

    const port = 443
    let algoClient = new algosdk.Algodv2(token, testServer, port)
    const startingAmount = algoClient.amount;
    let params = await algoClient.getTransactionParams().do();
    const defaultFrozen = false;
    const unitName = "AlgoNFT";
    const assetName = data.tokenName;
    const managerAddr = userAddress;
    const reserveAddr = undefined;
    const freezeAddr = undefined;
    const clawbackAddr = undefined;
    const decimals = 0;
    const total = 1;
    const hash = await crypto.createHash('sha256');
    hash.update("metadatafile");
    const metadata = new Uint8Array(hash.digest());
    console.log("hello");

    setTimeout(async () => {
      console.log("__", await URL);
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: userAddress,
        total,
        decimals,
        assetName,
        unitName,
        assetURL: "https://ipfs.io/ipfs/QmdVnZvDPneyL5bRcsjABCAJeZoF1ABAAYgJyuT1RAQvx6",
        assetMetadataHash: metadata,
        defaultFrozen,
        freeze: freezeAddr,
        manager: managerAddr,
        clawback: clawbackAddr,
        reserve: reserveAddr,
        suggestedParams: params,
      })

      const txn_b64 = await AlgoSigner.encoding.msgpackToBase64(txn.toByte());

      let signedTxs = await AlgoSigner.signTxn([{ txn: txn_b64 }])
      console.log(signedTxs)

      // Get the base64 encoded signed transaction and convert it to binary
      let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);

      console.log("hererere");

      // Send the transaction through the SDK client
      let tx = await algoClient.sendRawTransaction(binarySignedTx).do()
      console.log(tx);

      let assetID = null;
      // wait for transaction to be confirmed
      const ptx = await algosdk.waitForConfirmation(algoClient, tx.txId, 4);
      // Get the new asset's information from the creator account
      assetID = ptx["asset-index"];
      //Get the completed Transaction
      console.log(assetID);
      console.log("Transaction " + tx.txId + " confirmed in round " + ptx["confirmed-round"] + "assetId" + assetID);

      Data.append('userAccountAddress', userAddress)
      Data.append('tokenName', data.tokenName);
      Data.append('tokenId', assetID);
      Data.append('totalSupply', data.totalsupply);
      await Data.append('File_URL', URL)

      await axios.post('http://localhost:9966/createAsset/upload', Data)
        .then(resp => {
          if (resp.status === 204) {
            setLoading(false)
            return Swal.fire({
              title: "Error",
              icon: 'error',
              text: `${resp.statusText}`,
            })
          }
          setTrxnHash(tx.txId)
          setLoading(false)
          Swal.fire({
            title: "NFT created",
            icon: 'success',
            text: `Successfully created NFT`,
          })
        })
        .catch(err => {
          setLoading(false)

          Swal.fire({
            title: "error",
            icon: 'error',
            text: `${err}`,
          })
        })
    }, 6000);
  }

  const ClearData = () => {
    const value = "";
    setData({
      tokenName: value,
      totalsupply: value,
    })
    setImage('')
    // document.getElementsByClassName("image").value = ''

  }

  return (
    <div className='u'>
      <div className='container'>
        <div className='row'>
          <div className='t'>
            <nav>
              <Navbar variant="dark">
                <Container>
                  <Navbar.Brand href="#home" ><strong>MarketBucket</strong></Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                    <p className='text-white my-3 d'>{userAddress}</p>
                    <div className='d-block'>
                      <Link to="/"><Button className='d'>Back</Button></Link>
                    </div>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </nav>
          </div>
        </div>
        <div className='col-md-6 my-5 mx-5 text-white'>
          <h1>Explore</h1>
        </div>
        <div className='row'>
          <div className='col-md-6 text-center text-white'>
            <Form className='text-white' action='/createAsset/upload' enctype="multipart/form-data" method="post">
              <Form.Group className="mb-3">
                <Form.Label><strong>Token Name</strong></Form.Label>
                <Form.Control className='text-white' id='tokenName' type="name" name='tokenName' placeholder="Enter token name" autoComplete='off' value={data.tokenName} onChange={getData} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>TotalSupply</strong></Form.Label>
                <Form.Control className='text-white' id='totalsupply' type="number" name='totalsupply' placeholder="Totalsupply" value={data.totalsupply} onChange={getData} required />
              </Form.Group>

              <Form.Group className="mb-3 ">
                <Form.Label><strong>Choose Image</strong></Form.Label>
                <Form.Control className='text-white' id='image' type="file" name='file-upload' onChange={getFileData} required />
              </Form.Group>

              <div className='mx-2'>
                <Button variant="primary" type="button" required onClick={ClearData} className="mx-2">
                  clear
                </Button>

                <Button variant="primary" type="button" required onClick={SetData} className="mx-2">
                  submit
                </Button>
              </div>
            </Form>
          </div>

          <div className='col-6 text-primary' id='uuu'>
            <h3>Selected Image Will Apper here :</h3>
            <div className='image'>
              <img src={img} alt="" />
            </div>
          </div>
          <div className='col-md-10 my-3 ' id="">
            {!isLoading ? txnHash === null ? '' : <a href={`https://testnet.algoexplorer.io/tx/${txnHash}`} target="blank" className='col-md-6'><Button className='d'>View txn on Block Explorer</Button></a> :
              <div id='spinnerr' className='col-md-12 '>
                {/* {document.getElementsByClassName('u').style.color = "blue"} */}
                <center><CirclesWithBar color="blue" innerCircleColor='red' barColor='green' ariaLabel="circles-with-indicator" className="justify-content-center" /></center>
              </div>}
          </div>
        </div>
      </div>

    </div>
  )
}

export default CreateAsset

{/* <Button onClick={Navigate("/")}>Back</Button> */ }
{/* <Link to="/"><Button>Back</Button></Link> */ }
{/* <div className='tx col-12'>
          <div className='spline '>
            <Spline  md={{ span: 3, offset: 3 }} scene={SCENE_OBJECT}  />
          </div>
        </div> */}



          // function CreateAsset() {
  //   const [data, setData] = useState({
  //     tokenName: "", tokenId: "", totalsupply: "", NFT_URL: ""
  //   })

  //   const [isLoading, setLoading] = useState(true);

  //   const [file, setFile] = useState('')

  //   const [img, setImage] = useState()
  //   // const Navigate = useNavigate()

  //   let location = useLocation()
  //   // console.log(location,"____")
  //   const userAddress = location.state



  //   const getData = (e) => {
  //     const newData = { ...data };
  //     newData[e.target.id] = e.target.value;
  //     setData(newData);
  //   }

  //   const getFileData = (e) => {
  //     const file = e.target.files[0];
  //     const file1 = e.target.files[0];
  //     setImage(URL.createObjectURL(file1))
  //     setFile(file)
  //     // console.log(file1);
  //     // console.log(URL.createObjectURL(file1));
  //   }

  //   const SetData = async (e) => {

  //     var a = [document.getElementById('tokenName').value, document.getElementById('totalsupply').value]
  //     for (let i = 0; i < a.length; i++) {
  //       if (a[i] === '') {
  //         return Swal.fire({
  //           title: "error",
  //           icon: 'error',
  //           text: `Empty field cant be accepted ${a[i]}`,
  //         })
  //       }
  //     }



  //     e.preventDefault();
  //     const Data = new FormData()
  //     // const File = { file }
  //     let tokenId = data.tokeId;
  //     await tokenId++

  //     Data.append('userAccountAddress', userAddress)
  //     Data.append('tokenName', data.tokenName);
  //     Data.append('tokenId', Number(tokenId));
  //     Data.append('totalSupply', data.totalsupply);
  //     Data.append('file-upload', url)
  //     var url;

  //     axios.post('http://localhost:9966/createAsset/upload')


  //     const testServer = "https://testnet-algorand.api.purestake.io/ps2";
  //     const token = {
  //       'x-API-key': "tzV5ZpDgtqaBUzskSO6Ly8TyYVlguUyt75iqYpsa"
  //     }

  //     const port = 443
  //     let algoClient = new algosdk.Algodv2(token, testServer, port)
  //     const startingAmount = algoClient.amount;
  //     let params = await algoClient.getTransactionParams().do();
  //     const defaultFrozen = false;
  //     const unitName = "AlgoNFT";
  //     const assetName = data.tokenName;
  //     const managerAddr = userAddress;
  //     const reserveAddr = undefined;
  //     const freezeAddr = undefined;
  //     const clawbackAddr = undefined;
  //     const decimals = 0;
  //     const total = 1;
  //     const hash = await crypto.createHash('sha256');
  //     hash.update("metadatafile");
  //     const metadata = new Uint8Array(hash.digest());


  //     // signing and sending "txn" allows "addr" to create an asset
  //     const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
  //       from: userAddress,
  //       total,
  //       decimals,
  //       assetName,
  //       unitName,
  //       assetURL: url,
  //       assetMetadataHash: metadata,
  //       defaultFrozen,
  //       freeze: freezeAddr,
  //       manager: managerAddr,
  //       clawback: clawbackAddr,
  //       reserve: reserveAddr,
  //       suggestedParams: params,
  //     });

  //     const txn_b64 = await AlgoSigner.encoding.msgpackToBase64(txn.toByte());

  //     let signedTxs = await AlgoSigner.signTxn([{ txn: txn_b64 }])
  //     console.log(signedTxs)

  //     // Get the base64 encoded signed transaction and convert it to binary
  //     let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);

  //     // Send the transaction through the SDK client
  //     let id = await algoClient.sendRawTransaction(binarySignedTx).do();
  //     console.log(id);

  //     await axios.post('http://localhost:9966/createAsset/upload', Data)
  //       .then(resp => {
  //         if (resp.status === 204) {
  //           return Swal.fire({
  //             title: "Error",
  //             icon: 'error',
  //             text: `${resp.statusText}`,
  //           })
  //         }
  //         setLoading(true);
  //         console.log(resp);
  //         url = resp.data
  //         // Swal.fire({
  //         //   title: "NFT created",
  //         //   icon: 'success',
  //         //   text: `Successfully created NFT`,
  //         // })
  //       })
  //       .catch(err => {
  //         Swal.fire({
  //           title: "error",
  //           icon: 'error',
  //           text: `${err}`,
  //         })
  //       })



  //     Swal.fire({
  //       title: "NFT created",
  //       icon: 'success',
  //       text: `Txn id : ${id.txId}`,
  //     })

  //   }