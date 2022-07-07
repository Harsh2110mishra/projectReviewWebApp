require("dotenv").config();
const { urlencoded } = require("express");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");




// regular middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// cookies & file middlewares
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));


//imported all routes
const home = require("./routes/home");
const user = require("./routes/user");
const project = require("./routes/project");

//imported router middleware
app.use("/", home);
app.use("/api/", user);
app.use("/api/", project);
//app.use(express.static(path.join(__dirname, "client", "build")));

/*app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});*/
// Add Access Control Allow Origin headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// export app.js
module.exports = app;
