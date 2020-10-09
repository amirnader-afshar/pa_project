//---Config
process.env.NODE_CONFIG_DIR = __dirname + "/config";

const config = require("config");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const winston = require("winston");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const persianDate = require("persian-date");
const cors = require("cors");


const adminRoutes = require("./routes/adminRout");
const commentRoutes = require("./routes/commentRoute");
const  productRoute= require("./routes/productRoute");


const { logger } = require("./utils/winstonOptions");

printRunLevel(config.get("Level"));

const app = express();
const requestLogger = fs.createWriteStream(
  path.join(__dirname, "log/requests.log")
);

persianDate.toLocale("en");
const date = new persianDate().format("YYYY/M/DD");

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(
  morgan("combined", {
    stream: requestLogger,
  })
);

app.use("/api/admin", adminRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/product", productRoute);

app.listen(config.get("PORT"), () => {
  logger.info(`Server running on port ${config.get("PORT")}`);
});



