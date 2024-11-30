const { response } = require("../appp");
const User = require("../models/userModel");


// const getUsers = (cb) => {
//   cb(users);
// };

const getUsers = (req, res, next) => {
  User.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

const addUser = (req, res, next) => {
  const user = new User({
    'id': req.body.id,
    'name': req.body.name,
  });
  // console.log(user);
  user
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

const updateUser = (req, res, next) => {
  const { id, name } = req.body;
  User.updateOne({ id: id }, { $set: { name: name } })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

const deleteUser = (req, res, next) => {
  const id = req.body.id;
  User.deleteOne({ id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

// const getUserById = (id, cb) => {
//   const user = users.find((user) => user.id == id);
//   cb(user);
// };

exports.getUsers = getUsers;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
