// const express = require("express");
// const app = express();
// const cors = require("cors");
// const userController = require("./controllers/userController");
// const memberController = require("./controllers/memberController");

// app.use(cors()); // allow cross origin access
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.get("/users", (req, res) => {
//   // var resObj=[];
//   userController.getUsers(req, res, (next) => {
//     res.send();
//   });
// });

// // app.get("/getAllMembers", (req, res) => {
// //   // var resObj=[];
// //   memberController.getAllMembers(req, res, (next) => {
// //     res.send();
// //   });
// // });

// // app.get("/getMemberById", (req, res) => {
// //   // var resObj=[];
// //   memberController.getMemberById(req, res, (next) => {
// //     res.send();
// //   });
// // });

// app.post("/createuser", (req, res) => {
//   const id = req.query.id;
//   userController.addUser(req.body, (callback) => {
//     res.send();
//   });
// });
// app.post("/updateuser", (req, res) => {
//   const id = req.query.id;
//   userController.updateUser(req.body, (callback) => {
//     res.send(callback);
//   });
// });
// app.post("/deleteuser", (req, res) => {
//   const id = req.query.id;
//   userController.deleteUser(req.body, (callback) => {
//     res.send(callback);
//   });
// });

// module.exports = app;
