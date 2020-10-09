const { User } = require("../model/user");
const _ = require("lodash");

  exports.products =  async (req, res) => {
    try {
      const body = _.pick(req.body, ["name", "price", "img_url"]);
      let user = await User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $push: {
            product: {
              name: body.name,
              price: body.price,
              img_url: body.img_url,
            },
          },
        }
      );
  
      if (!user) {
        return res.status(404).json({
          Error: "User not found",
        });
      }
  
      res.status(200).json({
        Message: "product has been saved.",
      });
    } catch (e) {
      res.status(400).json({
        Error: `Something went wrong. ${e}`,
      });
    }
  };

exports.getproduct = async (req, res) => {
  try {
    //await new Promise(resolve => setTimeout(resolve, 1000));
    let id = req.query.id;
    let user;
    if (id != undefined) {
      user = await User.findOne(
        { _id: req.user._id },
        { _id: 0, product: { $elemMatch: { _id: id } } }
      );
    } else {
      user = await User.findOne({ _id: req.user._id });
    }

    if (!user) {
      return res.status(404).json({
        Error: "User not found",
      });
    }

    res.status(200).send(user.product);
  } catch (e) {
    res.status(400).json({
      Error: `Something went wrong. ${e}`,
    });
  }
};

