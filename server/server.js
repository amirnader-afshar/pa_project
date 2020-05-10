process.env.NODE_CONFIG_DIR = __dirname+'/config';

 const config = require('config');

const {user} = require('./model/user');



 console.log(config.get('level'));

 let newUser = new user({
    fullname : 'nader afshar',
     email:'naderafshaaaaar@gmail.com',
     password:'123'
 })

 newUser.save().then((usr)=>{
    console.log('user addef',usr)
 });