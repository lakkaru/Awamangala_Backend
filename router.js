const express = require("express");
const router = express.Router();
// app.use(express.urlencoded({ extended: true }));

// const userController = require("./controllers/userController");
const memberController = require("./controllers/memberController");
const dependantController = require("./controllers/dependentController");
// const paymentController = require("./controllers/paymentController");
const memberAccountController = require("./controllers/memberAccountController");
const loanController = require("./controllers/loanController");
const loanPaymentController = require("./controllers/loanPaymentController");
const loanInterestPaymentController = require("./controllers/loanInterestPaymentController");
const penaltyInterestPayment = require("./controllers/penaltyInterestPaymentController");
const fullPayments = require("./controllers/fullPaymentController");

router.get("/getAllMembers", memberController.getAllMembers);
router.get("/getMembersInfo", memberController.getAllMembersBasicInfo);

router.get("/getMemberById", memberController.getMemberById);

router.get("/getMemberAllById", memberController.getMemberAllById);
router.get("/getFamilyRegister", memberController.getFamilyRegisterById);

router.get("/getMemberAllByArea", memberController.getMemberAllByArea);

router.get("/member/getNextId", memberController.getNextId);
// router.get("/member/removeFields", memberController.removeFields);
router.post("/createMember", memberController.createMember);
router.post("/updateMember", memberController.updateMember);

router.post("/updateDiedStatus", memberController.updateDiedStatus);
router.post("/updateDependentDiedStatus", memberController.updateDependentDiedStatus);
router.post("/deleteMember", memberController.deleteMember);
// router.get("/updateDep", memberController.updateDependants);

router.post("/dependent", dependantController.createDependent);
router.get("/dependents", dependantController.getAllDependents);
router.get("/dependents/:member_id", dependantController.getDependentsById);
router.put("/dependent/:id", dependantController.updateDependentById);
router.delete("/dependent/:id", dependantController.deleteDependentById);

router.post("/account-payments", memberAccountController.createMemberPayment);
router.get(
    "/getMembershipPaymentsById",
    memberAccountController.getMembershipPaymentsById
  );
  


//loans
router.post("/loan", loanController.createLoan);
router.get("/loans", loanController.getAllLoans);
router.get("/loans/member/:memberId", loanController.getLoansByMemberId);
router.get("/loan/:id", loanController.getLoanById);
router.put("/loan/:id", loanController.updateLoan);
router.get("/due-loans", loanController.getDueLoans);
router.delete("/loan/:id", loanController.deleteLoan);

//loan principle payment
router.post("/loan-payment", loanPaymentController.createLoanPayment);
router.get("/loan-payments", loanPaymentController.getAllLoanPayments);
router.get(
  "/loan-payments/loan/:loanId",
  loanPaymentController.getPaymentsByLoanId
);
router.put("/loan-payment/:id", loanPaymentController.updateLoanPayment);
router.delete("/loan-payment/:id", loanPaymentController.deleteLoanPayment);

// Routes for loan interest payments
router.post(
  "/loan-interest-payment",
  loanInterestPaymentController.createLoanInterestPayment
);
router.get(
  "/loan-interest-payment",
  loanInterestPaymentController.getAllLoanInterestPayments
);
router.get(
  "/loan-interest-payment/loan/:loanId",
  loanInterestPaymentController.getPaymentsByLoanId
);
router.get(
  "/loan-interest-payment/last/:loanId",
  loanInterestPaymentController.getLastLoanInterestPaymentDate
);
router.put(
  "/loan-interest-payment/:id",
  loanInterestPaymentController.updateLoanInterestPayment
);
router.delete(
  "/loan-interest-payment/:id",
  loanInterestPaymentController.deleteLoanInterestPayment
);

// Routes for penalty interest payments
router.post(
  "/penalty-interest-payment",
  penaltyInterestPayment.createPenaltyInterestPayment
);
router.get(
  "/penalty-interest-payment",
  penaltyInterestPayment.getAllPenaltyInterestPayment
);
router.get(
  "/penalty-interest-payment/loan/:loanId",
  penaltyInterestPayment.getPenaltyInterestPaymentByLoanId
);
router.get(
  "/penalty-interest-payment/last/:loanId",
  penaltyInterestPayment.getLastPenaltyInterestPaymentDate
);
router.put(
  "/penalty-interest-payment/:id",
  penaltyInterestPayment.updatePenaltyInterestPayment
);
router.delete(
  "/penalty-interest-payment/:id",
  penaltyInterestPayment.deletePenaltyInterestPayment
);

router.get("/loan-all-payments/:loanId", fullPayments.getLoanAllPayments);
router.get("/period-all-payments", fullPayments.getPaymentsByPeriod);
router.get("/period-all-loans", fullPayments.getAllExpenses);

module.exports = router;
