const express = require("express");
const router = express.Router();
// app.use(express.urlencoded({ extended: true }));


// const userController = require("./controllers/userController");
const memberController=require("./controllers/memberController")
const dependantController=require("./controllers/dependentController")
const paymentController = require('./controllers/paymentController');
const loanController = require('./controllers/loanController');
const loanPaymentController = require('./controllers/loanPaymentController');
const loanInterestPaymentController = require("./controllers/loanInterestPaymentController");


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
router.get('/loan/:id', loanController.getLoanById);
router.put('/loan/:id', loanController.updateLoan);
router.delete('/loan/:id', loanController.deleteLoan);

router.post('/loan-payment', loanPaymentController.createLoanPayment);
router.get('/loan-payments', loanPaymentController.getAllLoanPayments);
router.get('/loan-payments/loan/:loanId', loanPaymentController.getPaymentsByLoanId);
router.put('/loan-payment/:id', loanPaymentController.updateLoanPayment);
router.delete('/loan-payment/:id', loanPaymentController.deleteLoanPayment);



// Routes for loan interest payments
router.post("/loan-interest-payment", loanInterestPaymentController.createLoanInterestPayment);
router.get("/loan-interest-payment", loanInterestPaymentController.getAllLoanInterestPayments);
router.get("/loan-interest-payment/loan/:loanId", loanInterestPaymentController.getPaymentsByLoanId);
router.get("/loan-interest-payment/last/:loanId", loanInterestPaymentController.getLastLoanInterestPaymentDate);
router.put("/loan-interest-payment/:id", loanInterestPaymentController.updateLoanInterestPayment);
router.delete("/loan-interest-payment/:id", loanInterestPaymentController.deleteLoanInterestPayment);


module.exports = router;
