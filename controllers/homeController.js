const BigPromise = require("../middlewares/bigPromise");

/*
exports.home = BigPromise((req, res) => {
  res.status(200).json({
    success: true,
    greetings: "hello from backend",
  });
}); 
*/
///Users/harshmishra/Desktop/BackendApp/react-auth-template/src/App.js
exports.home = BigPromise((req, res) => {
  res
    .status(200)
    .render(
      "../client/public/index.html"
    );
});

exports.dummyCheck = (req, res) => {
  res.status(200).json({
    success: true,
  });
};
