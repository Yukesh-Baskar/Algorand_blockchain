const express = require('express');
const urlencoded = require('express')
const app = express()
const root = express.Router();
const multer = require('multer');
const client = require('ipfs-api');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const algosdk = require('algosdk');
const crypto = require('crypto');
const infoCreateAsset = require('../model/createAssetSchema')
const cors = require('cors')
app.use(urlencoded({extended:true}))
root.use(cors())

var ipfs = client({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https"
})
var fileStorageEngine = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: fileStorageEngine });

function getResult() {
    return 5 + 5;
}

root.get('/getCipher',(req,res) => {
    var a = getResult()
    res.json(a)
})


root.post('/uploadImage', upload.single('file-upload'), (req, res) => {
    console.log("hello");
    if (req.file == null) {
        res.json("Image not found")
    } else {
        let testFile = fs.readFileSync(req.file.path);
        let testBuffer = new Buffer.from(testFile);
        ipfs.files.add(testBuffer, async (err, file) => {
            if (err) {
                console.log("err");
                console.log(err);
                
                res.json(err)
            } else {
                console.log(`https://ipfs.io/ipfs/${file[0].path}`);
                await res.json(`https://ipfs.io/ipfs/${file[0].path}`);
            }
        })
    }
})

root.post('/upload', upload.single('file-upload'),async (req, res) => {
    // console.log("k");
    console.log("___",req.body);

    let token = await uuidv4();
    if (req.body.tokenName == 0 && req.body.totalSupply == 0) {
        // console.log("came");
        return res.status(204).send("Can't accept empty fields");
    } else {
        try {
            // console.log("came");
            var userCreateAsset = new infoCreateAsset({
                userAccountAddress: req.body.userAccountAddress,
                tokenName: req.body.tokenName,
                tokenId: req.body.tokenId,
                totalSupply: req.body.totalSupply,
                File_URL: req.body.File_URL
            })
            try {
                await userCreateAsset.save();
                console.log("hello");
                res.json("success");// ${req.body.tokenId}
            } catch (error) {
                console.log("tryCtach");
                res.status(400).send('Error while fetching details kindly check if any details were missed');
            }
        } catch (error) {
            res.status(403).send('Error while uploading NFT details kindly check the fields!!!');
        }
    }
})

root.get('/getAssets/:userAddress', async (req, res) => {
    const userAccountAddress = await req.params.userAddress;
    console.log(req.params);
    await infoCreateAsset.find({ userAccountAddress: userAccountAddress }, (err, userDetails) => {
        if (userDetails.length === 0 || err) {
            res.status(401).send("User not found");
        } else {
            res.json(userDetails);
        }
    })
})

root.delete('/deleteAsset',async(req,res) => {
    console.log(req.body);
    const tokenId = req.body.sellerAssetId
    await infoCreateAsset.deleteOne({tokenId},(err,ress) => {
        if (err) throw err;
        res.json(ress)
    })
})

root.post('/sellOrder',(req,res) => {
    res.json(req.body)
   // if(req.body.sellerAddress == "" && req.body.sellerAssetId == "" && req.body.sellerAskingAmount == "") return res.json("Empty fields can't be accepted!!!");
    
})

module.exports = root;