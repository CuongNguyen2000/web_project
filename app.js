var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var methodOverride = require("method-override");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
var guestsRouter = require("./routes/guests");
var managersRouter = require("./routes/managers");
var coordinatorsRouter = require("./routes/coordinators");
var studentsRouter = require("./routes/students");

var app = express();
var mongoose = require("mongoose");

// connect to Database
const uri =
  "mongodb+srv://cn1122000:ncuong1212@cluster0.oqk40.mongodb.net/websiteDB?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connection to DB ...."))
  .catch((err) => console.log(`Connect to Db failed. Error: ${err}`));

// using Session to verify User Login.
app.use(
  session({
    secret: "mySecretSession",
    resave: true,
    saveUninitialized: false,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/guests", guestsRouter);
app.use("/managers", managersRouter);
app.use("/coordinators", coordinatorsRouter);
app.use("/students", studentsRouter);

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
