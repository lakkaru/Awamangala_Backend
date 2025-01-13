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

// Get all membership payments by a member
exports.getMembershipPaymentsById = async (req, res) => {
  const { member_id } = req.query;
  // console.log(member_id)
  try {
    // Find the member with member_id
    const member = await Member.findOne({ member_id: member_id }).select(
      "_id name mob_tel area"
    );
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    // console.log(member)
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
    const membershipFormatted = membershipPayments.map((payment) => ({
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
    const fineFormatted = finePayments.map((payment) => ({
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

//get all account  payments by member
exports.getPaymentsById = async (req, res) => {
  const { member_id } = req.query;

  try {
    // Find the member with member_id
    const member = await Member.findOne({ member_id: member_id }).select(
      "_id name mob_tel area"
    );
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Fetch membership payments
    const membershipPayments = await MembershipAccount.find({
      memberId: member._id,
    }).select("date amount _id");

    // Fetch fine payments
    const finePayments = await FinePaymentAccount.find({
      memberId: member._id,
    }).select("date amount _id");

    // Combine and group payments by date
    const paymentMap = {};

    membershipPayments.forEach((payment) => {
      const date = new Date(payment.date).toISOString().split("T")[0]; // Normalize date
      if (!paymentMap[date]) {
        paymentMap[date] = {
          date,
          mem_id: null,
          memAmount: 0,
          fine_id: null,
          fineAmount: 0,
        };
      }
      paymentMap[date].mem_id = payment._id;
      paymentMap[date].memAmount += payment.amount || 0;
    });

    finePayments.forEach((payment) => {
      const date = new Date(payment.date).toISOString().split("T")[0]; // Normalize date
      if (!paymentMap[date]) {
        paymentMap[date] = {
          date,
          mem_id: null,
          memAmount: 0,
          fine_id: null,
          fineAmount: 0,
        };
      }
      paymentMap[date].fine_id = payment._id;
      paymentMap[date].fineAmount += payment.amount || 0;
    });

    // Convert the map to an array and sort by date
    const allPayments = Object.values(paymentMap).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Calculate totals
    const membershipTotalAmount = allPayments.reduce(
      (sum, payment) => sum + payment.memAmount,
      0
    );
    const fineTotalAmount = allPayments.reduce(
      (sum, payment) => sum + payment.fineAmount,
      0
    );

    // Respond with the merged and grouped payments
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

//getting all payments on a particular day
exports.getPaymentsByDay = async (req, res) => {
  const { date } = req.query; // Expecting date in 'YYYY-MM-DD' format
  // console.log("date: ", date);

  try {
    // Parse the date to get the exact day (start of the day, midnight)
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0); // Start of the day (midnight)
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999); // End of the day (just before midnight)

    // Query for membership payments on that date
    const membershipPayments = await MembershipAccount.find({
      date: { $gte: selectedDate, $lte: endOfDay },
    }).select("memberId amount createdAt");

    // Query for fine payments on that date
    const finePayments = await FinePaymentAccount.find({
      date: { $gte: selectedDate, $lte: endOfDay },
    }).select("memberId amount createdAt");

    // Combine both payment arrays into one
    const allPayments = [...membershipPayments, ...finePayments];

    // Group payments by memberId and type (membership vs fine)
    const groupedPayments = allPayments.reduce((group, payment) => {
      const { memberId, amount, createdAt } = payment;

      // Ensure the memberId is in the group
      if (!group[memberId]) {
        group[memberId] = { membershipPayments: [], finePayments: [] };
      }

      // Group by payment type
      if (membershipPayments.includes(payment)) {
        group[memberId].membershipPayments.push({ amount, createdAt });
      } else {
        group[memberId].finePayments.push({ amount, createdAt });
      }

      return group;
    }, {});

    // Fetch member details for all memberIds
    const memberIds = Object.keys(groupedPayments);
    const members = await Member.find({ _id: { $in: memberIds } }).select(
      "_id member_id name"
    );

    // Prepare the final response structure with totals and member details
    let response = members.map((member) => {
      const memberPayments = groupedPayments[member._id.toString()] || {
        membershipPayments: [],
        finePayments: [],
      };

      const membershipTotal = memberPayments.membershipPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const fineTotal = memberPayments.finePayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      return {
        member_id: member.member_id, // Use member_id here
        name: member.name,
        payments: {
          membershipPayments: memberPayments.membershipPayments.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
          finePayments: memberPayments.finePayments.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        },
        membershipTotal,
        fineTotal,
      };
    });

    // Sort the response by member_id in ascending order
    response.sort((a, b) => {
      if (typeof a.member_id === "string" && typeof b.member_id === "string") {
        return a.member_id.localeCompare(b.member_id); // String comparison
      }
      return a.member_id - b.member_id; // Numeric comparison
    });

    res.status(200).json({
      message: "Payments retrieved successfully",
      paymentsByMember: response,
    });
  } catch (error) {
    console.error("Error fetching payments by day:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get payments by period
exports.getPaymentsByPeriod = async (req, res) => {
  try {
  } catch (error) {}
};

//get all fines and due of member
exports.getAllDueOfMember = async (req, res) => {
  const { member_id } = req.query;

  // Validate member_id
  if (!member_id) {
    return res.status(400).json({ error: "Member ID is required." });
  }

  try {
    // Find the member's dues
    const memberDue = await Member.findOne({ member_id }).select(
      "member_id previousDue fines"
    );

    // If no member is found, return a 404 response
    if (!memberDue) {
      return res.status(404).json({ error: "Member not found." });
    }

    // Respond with the member's dues
    res.status(200).json({ success: true, due: memberDue });
  } catch (error) {
    console.error("Error fetching member dues:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

