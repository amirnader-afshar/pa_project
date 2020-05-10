const validator = require('validator');

const {mongoose}= require('./../db/mongoose');

let userschema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        minlenght:3,
        trim:true
    },
    email:{
        type:String,
        required:true,
        minlenght:6,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message : '{value} is not valid email'
        }
    }
    ,
    password:{
        type:String,
        minlength:6,
        required:true
    }
});

let user = mongoose.model ('user',userschema);

module.exports={
    user
}