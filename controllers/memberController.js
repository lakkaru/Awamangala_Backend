// const { response } = require("../app");
const Member = require("../models/member"); // Import the Member model

// Create a new member
exports.createMember = async (req, res) => {
  try {
    const {
      member_id,
      password,
      name,
      area,
      res_tel,
      mob_tel,
      address,
      email,
      nic,
      birthday,
    } = req.body;

    // Validate required fields
    if (!member_id || !password || !name) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Member ID, password, and name are required.",
        });
    }

    // Create and save the new member
    const newMember = new Member({
      member_id,
      password,
      name,
      area,
      res_tel,
      mob_tel,
      address,
      email,
      nic,
      birthday,
    });

    await newMember.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Member created successfully.",
        data: newMember,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating member.",
        error: error.message,
      });
  }
};

// Retrieve all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching members.",
        error: error.message,
      });
  }
};

// Retrieve a single member by `member_id`
exports.getMemberById = async (req, res) => {
  // console.log(req.body)
  try {
    const { member_id } = req.query;
    // console.log(member_id);
    const member = await Member.findOne({ member_id: member_id}); // Find by `member_id`
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found." });
    }

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching member.",
        error: error.message,
      });
  }
};

// Update a member
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const member = await Member.findByIdAndUpdate(id, updates, { new: true });
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found." });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Member updated successfully.",
        data: member,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating member.",
        error: error.message,
      });
  }
};

// Delete a member
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Member deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting member.",
        error: error.message,
      });
  }
};
