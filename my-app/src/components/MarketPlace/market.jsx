/* global AlgoSigner */
import React, { useState, useEffect } from 'react'
import '../creatAsset/createAsset.css'
import { APPID, CONTRACT_ADDRESS } from '../../contract/constants'
import { Button, Form, Card } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import FormData from 'form-data'
import Swal from 'sweetalert2'
import './market.css'
import { set } from 'mongoose'
const algosdk = require("algosdk")


const MarketPlace = () => {
    const { userAddress } = useParams()
    const location = useLocation()
    const [sellOrders, setSellOrders] = useState("")
    let [getSellOrders, setGetSellOrders] = useState([])
    const [state, setState] = useState({
        sellerAssetId: "", sellerTokenName: "", sellerAskingAmount: ""
    })

    useEffect(async () => {
        if (location.state != null) {
            setState({
                sellerAssetId: await location.state.param.tokenId,
                sellerTokenName: await location.state.param.tokenName,
            })
        }
    }, [])

    useEffect(async () => {
        await axios.get(`http://localhost:9966/sellAsset/getSellOrders`)
            .then(async (resp) => {
                console.log(resp.data)
                await setGetSellOrders(resp.data)
                console.log(resp.data)
            }).catch((err) => {
                setGetSellOrders(err.response.status)
            })
    }, [sellOrders])


    const testServer = "https://testnet-algorand.api.purestake.io/ps2";
    const token = {
        'x-API-key': "tzV5ZpDgtqaBUzskSO6Ly8TyYVlguUyt75iqYpsa"
    }
    const port = 443

    const EncodeBytes = (utf8String) => {
        let encoder = new TextEncoder()
        return encoder.encode(utf8String)
    }

    const TextDecoderr = (data) => {
        let decoder = new TextDecoder()
        return decoder.decode(data)
    }

    const getData = (e) => {
        console.log(e.target.value);
        const newData = { ...state };
        newData[e.target.id] = e.target.value;
        setState(newData);
        // console.log(state);
    }

    const SetData = () => {

    }

    const ClearData = () => {

    }

    const sellAssetFunc = async (e) => {
        let algoClient = new algosdk.Algodv2(token, testServer, port);
        const params = await algoClient.getTransactionParams().do();
        const AppId = APPID;
        const AppArgs = [EncodeBytes("sellNFT")];
        const accounts = undefined;

        const foreignApps = undefined;
        console.log(state.sellerAssetId);

        const foreignAssets = [Number(state.sellerAssetId)];
        const note = new Uint8Array();
        const buffer = new ArrayBuffer(34);
        const lease = new Uint8Array(buffer, 2);
        const rekeyTo = await CONTRACT_ADDRESS;
        const assetInde = Number(state.sellerAssetId);

        const closeRemainderTo = undefined;
        const revocationTarget = undefined;
        const amount = 1;

        const appCall = algosdk.makeApplicationNoOpTxn(
            userAddress,
            params,
            AppId,
            AppArgs,
            accounts,
            foreignApps,
            foreignAssets,
        )

        const transferASA = algosdk.makeAssetTransferTxnWithSuggestedParams(
            userAddress,
            CONTRACT_ADDRESS,
            closeRemainderTo,
            revocationTarget,
            amount,
            note,
            assetInde,
            params,
        );

        algosdk.assignGroupID([appCall, transferASA]);

        const binaryTxs = [appCall.toByte(), transferASA.toByte()];
        const base64Txs = binaryTxs.map((binary) => AlgoSigner.encoding.msgpackToBase64(binary));

        const signedTxs = await AlgoSigner.signTxn([
            {
                txn: base64Txs[0],
            },
            {
                txn: base64Txs[1],
            },
        ]);
        // The signed transaction array can then be sent using the SDK.
        const binarySignedTxs = signedTxs.map((tx) => AlgoSigner.encoding.base64ToMsgpack(tx.blob));
        await algoClient.sendRawTransaction(binarySignedTxs).do()
            .then(async (resp) => {
                console.log(resp.txId);
                // var Data = new FormData();
                // Data.append('assetInde', assetInde);
                // Data.append('assetName', state.tokenName);
                var body = await state;
                await axios.post(`http://localhost:9966/sellAsset/sellOrder/${userAddress}`, body)
                    .then((resp) => {
                        setSellOrders(resp.data)
                        return Swal.fire({
                            title: "SellOrder Created",
                            icon: 'success',
                            text: `${resp.data}`,
                        });
                    }).catch((err) => {
                        console.log(err);
                        return Swal.fire({
                            title: "Error",
                            icon: 'err',
                            text: `Error occured with ${err}`,
                        });
                    })
            }).catch((err) => {
                return Swal.fire({
                    title: "Error",
                    icon: 'err',
                    text: `Token already deposited for selling on the marketplace`,
                });
            })
    }

    const check = async () => {
        var body = await state;
        console.log(body);
        await axios.post(`http://localhost:9966/sellAsset/sellOrder/${userAddress}`, body)
            .then((resp) => {
                return Swal.fire({
                    title: "SellOrder Created",
                    icon: 'success',
                    text: `${resp.data}`,
                });
            }).catch((err) => {
                return Swal.fire({
                    title: "Error",
                    icon: 'err',
                    text: `Error occured`,
                });
            })
    }

    const buyNFT = async (event, data) => {
        console.log(data);
        let algoClient = new algosdk.Algodv2(token, testServer, port);
        const params = await algoClient.getTransactionParams().do();
        const Appid = await APPID;
        const AppArgs = [];
        await AppArgs.push(EncodeBytes("GRP"))
        const accounts = [];
        await accounts.push(data.userAddress)

        const foreignApps = undefined;
        const foreignAssets = [];
        const buffer = new ArrayBuffer(34);
        const lease = new Uint8Array(buffer, 2);
        const note = new Uint8Array()
        const rekeyTo = await CONTRACT_ADDRESS

        const txn = algosdk.makeApplicationNoOpTxn(
            userAddress,
            params,
            Appid,
            AppArgs,
            accounts,
            foreignApps,
            foreignAssets,
            note,
            lease,
            rekeyTo
        )

        const params1 = await algoClient.getTransactionParams().do();
        const Appid1 = await APPID;
        const AppArgs1 = [];
        await AppArgs1.push(EncodeBytes("GRP1"))
        const accounts1 = [];
        const foreignApps1 = undefined;
        const foreignAssets1 = [];
        foreignAssets1.push(Number(data.sellerAssetId))

        const txn1 = algosdk.makeApplicationNoOpTxn(
            userAddress,
            params1,
            Appid1,
            AppArgs1,
            accounts1,
            foreignApps1,
            foreignAssets1,
            note,
            lease,
        )

        algosdk.assignGroupID([txn, txn1]);

        const binaryTxs = [txn.toByte(), txn1.toByte()];
        const base64Txs = binaryTxs.map((binary) => AlgoSigner.encoding.msgpackToBase64(binary));

        const signedTxs = await AlgoSigner.signTxn([
            {
                txn: base64Txs[0],
            },
            {
                txn: base64Txs[1],
            },
        ]);
        // The signed transaction array can then be sent using the SDK.

        const binarySignedTxs = signedTxs.map((tx) => AlgoSigner.encoding.base64ToMsgpack(tx.blob));
        const id = await algoClient.sendRawTransaction(binarySignedTxs).do();
        console.log(id);
      
    }

    return (
        <div className='ty'>
            <div className='container' id='container'>
                <Link to="/"><Button className='d my-1'>Back</Button></Link>
                <div className='col-md-10 d-flex mx-5 text-white'>
                    <h1>Top collections</h1>
                    <p className='text-white mx-2 my-3 d'>{userAddress}</p>
                </div>
                <div className='row mx-1' id='q'>
                    <div className='col'>
                        <div className='col-3'>
                            <img className='img1' alt='Loaded Lions' src='https://d2vi0z68k5oxnr.cloudfront.net/273dc24c-5b5f-45d9-83d3-5db578bdce79/original.gif'></img>

                            <div className='yy my-3' >
                                <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2.72727L25.2727 0L28.5455 5.09091L34.7273 5.27273L34.9091 11.4545L40 14.7273L37.2727 20L40 25.2727L34.9091 28.5455L34.7273 34.7273L28.5455 34.9091L25.2727 40L20 37.2727L14.7273 40L11.4545 34.9091L5.27273 34.7273L5.09091 28.5455L0 25.2727L2.72727 20L0 14.7273L5.09091 11.4545L5.27273 5.27273L11.4545 5.09091L14.7273 0L20 2.72727Z" fill="url(#8b00049f-bd2b-41d4-9bb0-c905d9d08e96)"></path><path d="M17.4988 25.4956L11.9995 20.5876L14.445 18.4051L17.4988 21.1382L26.052 13.4971L28.4975 15.6796L17.4988 25.4956Z" fill="white"></path><defs><linearGradient id="8b00049f-bd2b-41d4-9bb0-c905d9d08e96" x1="0" y1="20" x2="40" y2="20" gradientUnits="userSpaceOnUse"><stop stop-color="#1199FA"></stop><stop offset="1" stop-color="#11D0FA"></stop></linearGradient></defs></svg>
                                <h5 className='text-white mx-1'>Loaded Lions</h5>
                            </div>
                        </div>
                        <div className='col-3'>
                            <img className='img1' alt='kcittyCubs' src='https://d2vi0z68k5oxnr.cloudfront.net/3b55fd06-9bbb-42a9-94ba-4c4b8f47dd6f/original.gif'></img>
                            <div className='yy my-3'>
                                <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2.72727L25.2727 0L28.5455 5.09091L34.7273 5.27273L34.9091 11.4545L40 14.7273L37.2727 20L40 25.2727L34.9091 28.5455L34.7273 34.7273L28.5455 34.9091L25.2727 40L20 37.2727L14.7273 40L11.4545 34.9091L5.27273 34.7273L5.09091 28.5455L0 25.2727L2.72727 20L0 14.7273L5.09091 11.4545L5.27273 5.27273L11.4545 5.09091L14.7273 0L20 2.72727Z" fill="url(#8b00049f-bd2b-41d4-9bb0-c905d9d08e96)"></path><path d="M17.4988 25.4956L11.9995 20.5876L14.445 18.4051L17.4988 21.1382L26.052 13.4971L28.4975 15.6796L17.4988 25.4956Z" fill="white"></path><defs><linearGradient id="8b00049f-bd2b-41d4-9bb0-c905d9d08e96" x1="0" y1="20" x2="40" y2="20" gradientUnits="userSpaceOnUse"><stop stop-color="#1199FA"></stop><stop offset="1" stop-color="#11D0FA"></stop></linearGradient></defs></svg>
                                <h5 className='text-white mx-1'>KcittyCubs</h5>
                            </div>
                        </div>
                        <div className='col-3 align-items-center'>
                            <img className='img1' alt='WriggedTigers' src='https://d2vi0z68k5oxnr.cloudfront.net/8bdc24af-5341-4701-af67-47a921b6b8b4/original.gif'></img>
                            <div className='yy justify-content-center my-3'>
                                <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2.72727L25.2727 0L28.5455 5.09091L34.7273 5.27273L34.9091 11.4545L40 14.7273L37.2727 20L40 25.2727L34.9091 28.5455L34.7273 34.7273L28.5455 34.9091L25.2727 40L20 37.2727L14.7273 40L11.4545 34.9091L5.27273 34.7273L5.09091 28.5455L0 25.2727L2.72727 20L0 14.7273L5.09091 11.4545L5.27273 5.27273L11.4545 5.09091L14.7273 0L20 2.72727Z" fill="url(#8b00049f-bd2b-41d4-9bb0-c905d9d08e96)"></path><path d="M17.4988 25.4956L11.9995 20.5876L14.445 18.4051L17.4988 21.1382L26.052 13.4971L28.4975 15.6796L17.4988 25.4956Z" fill="white"></path><defs><linearGradient id="8b00049f-bd2b-41d4-9bb0-c905d9d08e96" x1="0" y1="20" x2="40" y2="20" gradientUnits="userSpaceOnUse"><stop stop-color="#1199FA"></stop><stop offset="1" stop-color="#11D0FA"></stop></linearGradient></defs></svg>
                                <h5 className='text-white mx-1'>WriggedTiger</h5>
                            </div>
                        </div>
                        <div className='col-3'>
                            <img className='img1' alt='PsychoKitties' src='https://d2vi0z68k5oxnr.cloudfront.net/f51698c0-5545-4f4f-91c3-ac748e141d90/original.gif'></img>
                            <div className='yy my-3'>
                                <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2.72727L25.2727 0L28.5455 5.09091L34.7273 5.27273L34.9091 11.4545L40 14.7273L37.2727 20L40 25.2727L34.9091 28.5455L34.7273 34.7273L28.5455 34.9091L25.2727 40L20 37.2727L14.7273 40L11.4545 34.9091L5.27273 34.7273L5.09091 28.5455L0 25.2727L2.72727 20L0 14.7273L5.09091 11.4545L5.27273 5.27273L11.4545 5.09091L14.7273 0L20 2.72727Z" fill="url(#8b00049f-bd2b-41d4-9bb0-c905d9d08e96)"></path><path d="M17.4988 25.4956L11.9995 20.5876L14.445 18.4051L17.4988 21.1382L26.052 13.4971L28.4975 15.6796L17.4988 25.4956Z" fill="white"></path><defs><linearGradient id="8b00049f-bd2b-41d4-9bb0-c905d9d08e96" x1="0" y1="20" x2="40" y2="20" gradientUnits="userSpaceOnUse"><stop stop-color="#1199FA"></stop><stop offset="1" stop-color="#11D0FA"></stop></linearGradient></defs></svg>
                                <h5 className='text-white mx-1'>PsychoKitties</h5>
                            </div>
                        </div>
                    </div>
                    <div className='text-white my-3'>
                        <h1>
                            The Marketplace
                        </h1>
                    </div>
                    <div className='content col-md-6'>
                        <Form className='text-white' enctype="multipart/form-data" method="post">
                            <Form.Group className="mb-3">
                                <Form.Label><strong>TokenName</strong></Form.Label>
                                <Form.Control className='text-white' id='sellerTokenName' type="name" name='sellerTokenName' placeholder="Enter token name" autoComplete='off' defaultValue={state.sellerTokenName == "" ? "" : state.sellerTokenName} value={state.sellerTokenName} onChange={getData} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label><strong>Token ID</strong></Form.Label>
                                <Form.Control className='text-white' id='sellerAssetId' type="number" name='sellerAssetId' placeholder="sellerAssetId" defaultValue={state.sellerAssetId == "" ? "" : state.sellerAssetId} value={state.sellerAssetId} onChange={getData} required />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label><strong>Asking Amount</strong></Form.Label>
                                <Form.Control className='text-white' id='sellerAskingAmount' type="number" name='sellerAskingAmount' placeholder="sellerAskingAmount" value={state.sellerAskingAmount} onChange={getData} required={true} />
                            </Form.Group>
                            {/* 
                            <Form.Group className="mb-3 d-none">
                                <Form.Label><strong>sellerAddress</strong></Form.Label>
                                <Form.Control className='text-white' id='sellerAddress' type="number" name='sellerAddress' placeholder="sellerAddress" defaultValue={userAddress} value={userAddress} onChange={getData} required={true} />
                            </Form.Group> */}
                            <div className='mx-2'>
                                {
                                    state.sellerTokenName == "" ? <Button variant="primary" type="button" required onClick={ClearData} className="mx-2">
                                        clear
                                    </Button> : ""
                                }
                                <Button variant="primary" type="button" required onClick={sellAssetFunc} className="mx-2">
                                    Sell
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className='col-md-12 text-white'>
                    {getSellOrders == 401 ?
                        <div className='text-white'>
                            <h2>No data found</h2>
                        </div> :
                        getSellOrders.map((orders) => {
                            return (
                                <div className='grid my-5 text-center text-success'>
                                    <Card className="box" key={orders.userAddress} style={{ width: '18rem' }} >
                                        <Card.Img className='d-flex' key={orders.sellerFileURL} id="img" variant="top" src={orders.sellerFileURL} />
                                        <Card.Body>
                                            <Card.Text className='text-decoration-underline'>Owner Address : {orders.userAddress}</Card.Text>
                                            <Card.Text>
                                                Asset ID : {orders.sellerAssetId}
                                            </Card.Text>

                                            <Card.Text>
                                                TokenName : {orders.sellerTokenName}
                                                <Card.Text>
                                                    Amount : {orders.sellerAskingAmount}Algo's
                                                </Card.Text>
                                                <Button className="d" onClick={event => buyNFT(event, orders)}>Buy</Button>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default MarketPlace