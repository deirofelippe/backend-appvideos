const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const routes = require("./routes");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

module.exports = app;
