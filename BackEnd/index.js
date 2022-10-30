const express = require('express');
const {urlencoded} = require('express')
const app = express();
require('dotenv').config()
const dbConnect = require('./config/dataBase.js');
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(urlencoded({extended:true}))

const infoCreateAsset = require('./router/createAssetRouter');
app.use('/createAsset',infoCreateAsset);

const infoSellAsset = require('./router/sellAssetRouter');
app.use('/sellAsset',infoSellAsset);


app.listen(process.env.PORT, (err, data) => {
    if (err) {
        console.log("port doesn't connected");
    } else {
        console.log(`port running on : ${process.env.PORT}`);
    }
});

dbConnect();
