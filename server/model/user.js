const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {mongoose}= require('./../db/mongoose');
const config = require('config');
const tokenOptions = {
    type:String,
    required:true            
}
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
    ,tokens:[{
        _id:false,
        access:tokenOptions,
        token:tokenOptions
    }]
    ,payment:[{
        info:{
            type:String,
            trim:true,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        date:{
            type:String,
            required:true
        }
    }]
});
userschema.methods.toJSON = function(){
    let user= this;
    let userObject = user.toObject();
    return _.pick(userObject,['_id','fullname','email'])
}

userschema.statics.findByCredentials = function (email, password) {
    let User = this;

    return User.findOne({
        email
    }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
}

userschema.statics.findByToken = function(token){
    let user = this;
    let decoded;

    try {
        decoded = jwt.verify(token,config.get('JWT_SECRET'));
    }
    catch (e){
        return Promise.reject();
    }

    return user.findOne({
        _id:decoded.id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}

userschema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';

    let token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, config.get('JWT_SECRET')).toString();

    user.tokens.push({
        access,
        token
    });

    return user.save().then(() => {
        return token;
    });
}


userschema.pre('save',function(next){
    let user = this ;
    if (user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password= hash;
                next();
            });
        });
    }
    else{
        next();
    }
    
});

let user = mongoose.model ('user',userschema);

module.exports={
    user
}