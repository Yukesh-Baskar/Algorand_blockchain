const mongoose = require('mongoose')
const CreateAsset = mongoose.Schema({
   userAccountAddress : {
      type : String,
      required : true
   },
    tokenName : {
       type : String,
       required : true
    },
    tokenId : {
      type : String,
      required : true
   },
    totalSupply : {
       type : Number,
       required : true
    },
    File_URL : {
       type : String,
       required : true
    }
})
module.exports = mongoose.model('CreateAsset',CreateAsset)

