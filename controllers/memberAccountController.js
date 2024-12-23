const mongoose = require("mongoose");

const MembershipAccount = require("../models/membershipAccount");
const FinePaymentAccount = require("../models/finePaymentAccount");
const Member = require("../models/member");

//create new payment
exports.createMemberPayment = async (req, res) => {
  const { date, paymentsArray } = req.body;
// console.log(paymentsArray)
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
      // console.log('member_Id: ', member_Id)
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

// Get all payments by a member
exports.getMembershipPaymentsById = async (req, res) => {
  const { member_id } = req.query;
// console.log(memberId)
  try {
    // Find the member with member_id
    const member = await Member.findOne({ _id: member_id }).select(
      "_id name mob_tel area"
    );
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Fetch membership payments
    const membershipPayments = await MembershipAccount.find({
      memberId: member._id,
    }).select("date amount _id");

    // Calculate the total for membership payments
    const membershipTotalAmount = membershipPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    // Map membership payments to the required structure
    const membershipFormatted = membershipPayments.map(payment => ({
      date: new Date(payment.date).toISOString(),
      mem_id: payment._id,
      memAmount: payment.amount || 0,
      fine_id: null,
      fineAmount: 0,
    }));

    // Fetch fine payments
    const finePayments = await FinePaymentAccount.find({
      memberId: member._id,
    }).select("date amount _id");

     // Calculate the total for fine payments
     const fineTotalAmount = finePayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    // Map fine payments to the required structure
    const fineFormatted = finePayments.map(payment => ({
      date: new Date(payment.date).toISOString(),
      mem_id: null,
      memAmount: 0,
      fine_id: payment._id,
      fineAmount: payment.amount || 0,
    }));

    // Combine both payment arrays
    const allPayments = [...membershipFormatted, ...fineFormatted];

    // Sort by date in descending order (nearest date first)
    allPayments.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Respond with the combined payments
    res.status(200).json({
      message: "Payments fetched successfully",
      member,
      payments: allPayments,
      membershipTotalAmount,
      fineTotalAmount,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//get all fine payments by member
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
