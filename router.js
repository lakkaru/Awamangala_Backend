const express = require("express");
const router = express.Router();
// app.use(express.urlencoded({ extended: true }));


// const userController = require("./controllers/userController");
const memberController=require("./controllers/memberController")
const dependantController=require("./controllers/dependentController")
const paymentController = require('./controllers/paymentController');
const loanController = require('./controllers/loanController');
const loanPaymentController = require('./controllers/loanPaymentController');

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
router.get("/dependents/:member_id", dependantController.getDependentsById);
router.put("/dependent/:id", dependantController.updateDependentById);
router.delete("/dependent/:id", dependantController.deleteDependentById);


router.post('/payments', paymentController.createPayment);
router.get('/payments/member/:memberId', paymentController.getPaymentsByMemberId);
router.get('/payments/:id', paymentController.getPaymentById);
router.put('/payments/:id', paymentController.updatePayment);
router.delete('/payments/:id', paymentController.deletePayment);

router.post('/loan', loanController.createLoan);
router.get('/loans', loanController.getAllLoans);
router.get('/loans/member/:memberId', loanController.getLoansByMemberId);
router.get('/loans/:id', loanController.getLoanById);
router.put('/loans/:id', loanController.updateLoan);
router.delete('/loans/:id', loanController.deleteLoan);

router.post('/loan-payment', loanPaymentController.createLoanPayment);
router.get('/loan-payments', loanPaymentController.getAllLoanPayments);
router.get('/loan-payments/loan/:loanNumber', loanPaymentController.getPaymentsByLoanNumber);
router.put('/loan-payments/:id', loanPaymentController.updateLoanPayment);
router.delete('/loan-payments/:id', loanPaymentController.deleteLoanPayment);

module.exports = router;
