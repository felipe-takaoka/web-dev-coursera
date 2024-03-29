require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var passport = require("passport");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishRouter");
var leaderRouter = require("./routes/leaderRouter");
var uploadRouter = require("./routes/uploadRouter");
var promoRouter = require("./routes/promoRouter");
var favoritesRouter = require("./routes/favoritesRouter");

const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => console.log("Connected to the server"),
    (err) => console.log(err)
  );

var app = express();

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(307, `https://${req.hostname}:${app.get("secPort")}${req.url}`);
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(express.static(path.join(__dirname, "public")));

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorites", favoritesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
