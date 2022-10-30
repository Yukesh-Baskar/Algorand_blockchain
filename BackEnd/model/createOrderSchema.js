const mongoose = require('mongoose');

const createOrderSchema = mongoose.Schema({
    sellerAddress : {
        type : String,
        required : true
    },
    sellerAssetId : {
        type : Number,
        required : true
    },
    sellerAskingAmount : {
        type : Number,
        required : true
    }
})

module.exports = mongoose.model('createOrderSchema',createOrderSchema);