const Payment = require('../models/payment');

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const { memberId, reason, amount, date } = req.body;

    // Check if all required fields are provided
    if (!memberId || !reason || !amount) {
      return res.status(400).json({ message: 'MemberId, reason, and amount are required' });
    }

    const newPayment = new Payment({
      memberId,
      reason,
      amount,
      date: date || new Date(), // If no date is provided, set current date
    });

    await newPayment.save();
    res.status(201).json(newPayment); // Return the created payment
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating payment', error });
  }
};

// Get all payments for a specific member by memberId
const getPaymentsByMemberId = async (req, res) => {
  try {
    const { memberId } = req.params; // Get memberId from URL parameters

    const payments = await Payment.find({ memberId }).populate('memberId', 'name'); // Populate memberId with name field

    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this member' });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

// Get a payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('memberId', 'name');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payment', error });
  }
};

// Update a payment by ID
const updatePayment = async (req, res) => {
  try {
    const { memberId, reason, amount, date } = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { memberId, reason, amount, date },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating payment', error });
  }
};

// Delete a payment by ID
const deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting payment', error });
  }
};

module.exports = {
  createPayment,
  getPaymentsByMemberId,
  getPaymentById,
  updatePayment,
  deletePayment,
};
