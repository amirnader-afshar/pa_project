process.env.NODE_CONFIG_DIR = __dirname + "/config";

const config = require("config");
const express = require("express");
const _ = require("lodash");
const morgan = require("morgan");
const helmet = require("helmet");
const winston = require("winston");
const fs = require('fs');
const path = require('path');
const persianDate=require('persian-date')

const { user } = require("./model/user");
const {authenticate} = require('./middleware/authenticate')

console.log(config.get("level"));

//  let newUser = new user({
//     fullname : 'nader afshar',
//      email:'naderafshaaaaar@gmail.com',
//      password:'123'
//  })

const app = express();
const requestLogger = fs.createWriteStream(path.join(__dirname, 'log/requests.log'));
const logger = winston.createLogger({
    transports:[
    new winston.transports.Console(),
    new winston.transports.File({filename:path.join(__dirname,'log/server-status.log')})
    ]


});
persianDate.toLocale('en');
const date =new persianDate().format('YYYY/MM/DD');

app.use(express.json());
app.use(helmet());
app.use(morgan('combined',{stream:requestLogger}));


app.post("/api/users",  async (req, res) => {
  try {
    const body = _.pick(req.body, ["fullname", "email", "password"]);
    console.log(req.body);
    let newuser = new user(body);

    await newuser.save();
    res.status(200).json(newuser);

  } catch (e) {
    res.status(400).json({ error: `somthings went wrong . ${e}` });
  }
});

app.post("/api/login", async(req, res) => {

    try{
        const body = _.pick(req.body, ["email", "password"]);
        let usr = await user.findByCredentials(body.email, body.password)
        let token = await  usr.generateAuthToken();
        res.header("x-auth", token).status(200).send(token);
    }
    catch(e)
    {
        res.status(400).json({ error: `something went wrong${e}` });
    }


});

app.post('/api/payment',authenticate, async (req,res)=>{
  try{
    const body = _.pick(req.body,['info','amount']);
    let usr = await user.findOneAndUpdate({
      _id:req.user._id
    },{$push:{
      payment:{
        info:body.info,
        amount:body.amount,
        date
      }
    }
    })

    if(!user)
      {
        return res.status(404).json({message:'Payment has been saved.'});
      }

    return res.status(200).json({message:'payment has been saved'});
    }
  catch(e){
    res.status(400).json({ error: `something went wrong${e}` });
  }
});

app.listen(config.get("PORT"), () => {
//   console.log(`server is running on port ${config.get("PORT")}`);
    logger.info(`Server running on port ${config.get('PORT')}`);
});
