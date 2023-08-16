var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var mlogger = require('morgan');
const dotenv = require("dotenv");
dotenv.config();
const { sequelize } = require("./config/db");

var cors = require('cors')
const allRoutes = require("./routes/index");
const { logError, returnError } = require("./errors");
const { logger } = require("./logger");

var app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(mlogger("dev", { stream: { write: (msg) => logger.info(msg) } }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/v1", allRoutes);



// error handler
app.use(logError);
app.use(returnError);

module.exports = app;
