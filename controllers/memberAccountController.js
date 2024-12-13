const mongoose = require("mongoose");

const MembershipAccount = require("../models/membershipAccount");
const FinePaymentAccount = require("../models/finePaymentAccount");
// const membershipAccount = require("../models/membershipAccount");

//create new payment
exports.createMemberPayment = async (req, res) => {
  const { date, paymentsArray } = req.body;

  // Validate request body
  if (!date || !Array.isArray(paymentsArray)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  let membershipPayments = 0;
  let finePayments = 0;
  const errors = [];

  try {
    for (const val of paymentsArray) {
      const { member_Id, memPayment, fiPayment } = val;

      // Validate required fields
      if (!member_Id) {
        errors.push({ entry: val, error: "Missing member_Id" });
        continue; // Skip this entry
      }

      try {
        // Create MembershipAccount record
        if (memPayment) {
          const newMembershipPayment = new MembershipAccount({
            date,
            memberId: member_Id,
            amount: memPayment,
          });
          await newMembershipPayment.save();
          membershipPayments++;
        }

        // Create FinePaymentAccount record
        if (fiPayment) {
          const newFinePayment = new FinePaymentAccount({
            date,
            memberId: member_Id,
            amount: fiPayment,
          });
          await newFinePayment.save();
          finePayments++;
        }
      } catch (paymentError) {
        errors.push({ entry: val, error: paymentError.message });
      }
    }

    // Send final response
    res.status(200).json({
      message: "Payments processing completed",
      membershipPayments,
      finePayments,
      errors,
    });
  } catch (error) {
    console.error("Error creating payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMembershipPaymentsById = async (req, res) => {
  // console.log('req.:')
  const { memberId } = req.query;
  // console.log("memberId: ", memberId);

  //Validate memberId
  // if (!mongoose.Types.ObjectId.isValid(memberId)) {
  //   return res.status(400).json({ error: "Invalid member ID format" });
  // }

  try {
    // Fetch membership payments
    const membershipPayments = await MembershipAccount.find({
      memberId: memberId,
    });

    // Check if payments exist
    if (!membershipPayments || membershipPayments.length === 0) {
      return res
        .status(404)
        .json({ message: "No membership payments found for this member" });
    }

    // Calculate the total amount
    const totalAmount = membershipPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Respond with the data and total
    res.status(200).json({
    //   payments: membershipPayments,
      totalAmount,
    });
  } catch (error) {
    console.error("Error fetching membership payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFinesByMemberId = async (req, res) => {
  const { memberId } = req.params;
  //   console.log("memberId: ", memberId);

  // Validate memberId
  if (!memberId) {
    return res.status(400).json({ error: "Member ID is required" });
  }

  try {
    // Fetch fine payments
    const finePayments = await FinePaymentAccount.find({ memberId });

    // Check if fines exist
    if (!finePayments || finePayments.length === 0) {
      return res
        .status(404)
        .json({ message: "No fines found for this member" });
    }

    // Respond with the data
    res.status(200).json(finePayments);
  } catch (error) {
    console.error("Error fetching fines:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPaymentsByPeriod = async (req, res) => {
  try {
  } catch (error) {}
};
