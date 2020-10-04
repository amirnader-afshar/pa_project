const { User } = require("../model/user");
const _ = require("lodash");

  exports.login = async (req, res) => {
    try {
      const body = _.pick(req.body, ["email", "password"]);
      console.log(body);
      let user = await User.findByCredentials(body.email, body.password);
      let token = await user.generateAuthToken();
      res.header("x-auth", token).status(200).send(token);
    } catch (e) {
      res.status(400).json({
        Error: `Something went wrong. ${e}`,
      });
    }
  };

  exports.users= async (req, res) => {
      try {
        const body = _.pick(req.body, ["fullname", "email", "password"]);
        let user = new User(body);
    
        await user.save();
        res.status(200).send(user);
      } catch (e) {
        res.status(400).json({
          Error: `Something went wrong. ${e}`,
        });
      }
    };

    exports.logout = async (req, res) => {
        try {
          await req.user.removeToken(req.token);
          res.status(200).json({
            Message: "Logout successfull.",
          });
        } catch (e) {
          res.status(400).json({
            Error: `Something went wrong. ${e}`,
          });
        }
      };  