const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");

const router = require("./router");

app.use(cors()); // allow cross origin access
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Mongodb connection uri
const uri =
//   "mongodb+srv://lakkaru:Mo61633583@societies.idzobxr.mongodb.net/?retryWrites=true&w=majority&appName=societies";
"mongodb+srv://lakkaru:Mo61633583@societies.idzobxr.mongodb.net/awamangala?retryWrites=true&w=majority&appName=societies"

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MondoDB error ".error);
  }
};

connect();

const server = app.listen(3001, "127.0.0.1", () => {
  console.log(`Node Server is listening to ${server.address().port}`);
});
app.use("/api", router);
