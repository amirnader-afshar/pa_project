process.env.NODE_CONFIG_DIR = __dirname+'/config';

 const config = require('config');
const express = require('express');
const _ = require('lodash');
const {user} = require('./model/user');



 console.log(config.get('level'));

//  let newUser = new user({
//     fullname : 'nader afshar',
//      email:'naderafshaaaaar@gmail.com',
//      password:'123'
//  })


const app = express();
app.use(express.json());

app.post('/api/users',(req,res)=>{
   const body = _.pick(req.body,['fullname','email','password']);
   console.log(req.body);
   let newuser = new user(body);
   newuser.save().then((usr)=>{
        console.log('user added',usr);
        res.status(200).json(usr);
    },(err)=>{req.body
        res.status(400).json({error:`somthings went wrong . ${err}`});
    });   
});

app.listen(config.get('PORT'),()=>{
        console.log(`server is running on port ${config.get('PORT')}`)
});