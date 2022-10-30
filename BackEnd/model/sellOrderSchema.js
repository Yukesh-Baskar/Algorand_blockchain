const mongoose = require('mongoose');

const sellOrderSchema = mongoose.Schema({
    userAddress : {
        type : String,
        required : true
    },
    sellerAssetId : {
        type : String,
        required : true
    },
    sellerTokenName : {
        type : String,
        required : true
    },
    sellerAskingAmount : {
        type : String,
        required : true
    },
    sellerFileURL : {
        type : String,
        required : true
    }

})
module.exports = mongoose.model('sellOrderSchema',sellOrderSchema);