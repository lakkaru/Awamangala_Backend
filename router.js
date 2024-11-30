const express = require("express");
const router = express.Router();
// app.use(express.urlencoded({ extended: true }));


// const userController = require("./controllers/userController");
const memberController=require("./controllers/memberController")
const dependantController=require("./controllers/dependantController")

// router.get("/users", userController.getUsers);
// router.post("/createuser", userController.addUser);
// router.post("/updateuser", userController.updateUser);
// router.post("/deleteuser", userController.deleteUser);

router.get("/getAllMembers", memberController.getAllMembers);
router.post("/createMember", memberController.createMember);
router.get("/getMemberById", memberController.getMemberById);
router.post("/updateMember", memberController.updateMember);
router.post("/deleteMember", memberController.deleteMember);
// router.post("/clearPasswords", memberController.clearPasswords);

router.post("/dependent", dependantController.createDependent);
router.get("/dependents", dependantController.getAllDependents);
router.get("/dependent/:id", dependantController.getDependentById);
router.put("/dependent/:id", dependantController.updateDependentById);
router.delete("/dependent/:id", dependantController.deleteDependentById);

module.exports = router;
