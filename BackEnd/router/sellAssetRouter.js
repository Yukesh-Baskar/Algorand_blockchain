var express = require("express");
const urlencoded = require('express')
const app = express()
var root = express.Router();
var cors = require("cors")
var sellOrderSchema = require('../model/sellOrderSchema')
var createAssetSchema = require('../model/createAssetSchema');
const { response } = require("express");
const e = require("express");
app.use(urlencoded({ extended: true }))
root.use(cors())

root.post("/sellOrder/:userAddress", async (req, res) => {
    const tokenId = req.body.sellerAssetId;
    const sellerAssetId = req.body.sellerAssetId;
    var File_URLL;
    // console.log(req.params); 
    if (req.params.userAddress == "" && req.body.sellerAssetId == "" && req.body.sellerTokenName == "" && req.body.sellerAskingAmount == "") return res.sendStatus(401).send("Empty fields detucted!!!");
    createAssetSchema.find({ tokenId }, async (err, dataa) => {
        if (err) {
            console.log("err");
            return res.json(err)
        } else {
            if (dataa != "") {
                File_URLL = await dataa[0].File_URL
            }
            sellOrderSchema.findOne({ sellerAssetId }, async (err, data) => {
                // console.log(data);
                console.log(await data);
                if (data != null) {
                    return res.status(400).send("Token already on marketplace for selling!!!");
                }
            })
        }
        try {
            var sellOrderr = new sellOrderSchema({
                userAddress: req.params.userAddress,
                sellerAssetId: req.body.sellerAssetId,
                sellerTokenName: req.body.sellerTokenName,
                sellerAskingAmount: req.body.sellerAskingAmount,
                sellerFileURL: File_URLL
            })
            sellOrderr.save().then((resp) => {
                console.log(resp);
                res.json("SellOrder created successfully");
            }).catch((err) => {
                console.log("hi", err);
                res.status(400).send("NFT not created on our platform to sell!!!")
            })
        } catch (error) {
            res.status(400).send(err)
        }
    })
})

root.get('/getSellOrders', async (req, res) => {
    await sellOrderSchema.find({}, (err, response) => {
        // return res.status(401).send("No data found or error occured");
        if (err) {
            console.log(err);
            return res.status(401).send("No data found or error occured");
        } else {
            console.log(response);
            res.json(response)
        }
    })
})

module.exports = root;