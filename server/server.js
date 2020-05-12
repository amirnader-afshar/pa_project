process.env.NODE_CONFIG_DIR = __dirname + "/config";

const config = require("config");
const express = require("express");
const _ = require("lodash");

const { user } = require("./model/user");

console.log(config.get("level"));

//  let newUser = new user({
//     fullname : 'nader afshar',
//      email:'naderafshaaaaar@gmail.com',
//      password:'123'
//  })

const app = express();
app.use(express.json());

app.post("/api/users", async (req, res) => {
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

app.listen(config.get("PORT"), () => {
  console.log(`server is running on port ${config.get("PORT")}`);
});
