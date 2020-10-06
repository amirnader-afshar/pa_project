const { User } = require("../model/user");
const _ = require("lodash");

exports.comment = async (req, res) => {    
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const body = _.pick(req.body, ["name", "email", "content", "id"]);
        let user = await User.findOneAndUpdate(
          { _id: req.user._id, "product._id": body.id },
          {
            $push: {
              "product.$.comment": {
                name: body.name,
                email: body.email,
                content: body.content,
              },
            },
          }
        );
    if (!user) {
      return res.status(404).json({
        Error: "product not found",
      });
    }

    res.status(200).json({ Message: "comment has been saved." });
  } catch (e) {
    res.status(400).json({
      Error: `Something went wrong. ${e}`,
    });
  }
};

exports.getcomment = async (req, res) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        let id = req.params.productid;
        let page = req.params.page;
        page = (page-1)*10;
        let user;
        user = await User.findOne(
          { _id: req.user._id },
          {
            _id: 0,
            product: {
              $elemMatch: { _id: id },      
            },
            'product.comment':{$slice:[page,10]}
          }
        );
        
        if (!user) {
          return res.status(404).json({
            Error: "product not found",
          });
        }
        
        res.status(200).json(user.product[0].comment);
      } catch (e) {
        res.status(400).json({
          Error: `Something went wrong. ${e}`,
        });
      }
    };
