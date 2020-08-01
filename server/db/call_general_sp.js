var Connection = require("tedious").Connection,
  Request = require("tedious").Request,
  TYPES = require("tedious").TYPES;
let call_sp = () => {
  var connection = new Connection({
    server: ".\sql2019",
    authentication: {
      type: "default",
      options: {
        userName: "sa",
        password: "170681",
      },
    },
  });

  connection.on("requestCompleted", function (err) {
    var request = new Request("countChar", function (err) {
      if (err) {
        console.log(err);
      }

      connection.close();
    });

   
    request.addParameter("inputVal", TYPES.VarChar, "hello world");
    request.addOutputParameter("outputCount", TYPES.Int);

    request.on("returnValue", function (paramName, value, metadata) {
      console.log(paramName + " : " + value);
    });

    connection.callProcedure(request);
  });
};

module.exports = {
  call_sp,
};
