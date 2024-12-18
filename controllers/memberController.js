const mongoose = require("mongoose");

// const { response } = require("../app");
const Member = require("../models/member"); // Import the Member model
const Dependent = require("../models/dependent");

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
      return res.status(400).json({
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
    res.status(201).json({
      success: true,
      message: "Member created successfully.",
      data: newMember,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating member.",
      error: error.message,
    });
  }
};

// Retrieve all members without sending the password field
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().select("-password"); // Excludes the password field
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching members.",
      error: error.message,
    });
  }
};

exports.getAllMembersBasicInfo = async (req, res) => {
  try {
    const membersBasicInfo = await Member.find().select(
      "name area member_id mob_tel res_tel "
    ); // Excludes the password field and include required
    res.status(200).json({ success: true, membersBasicInfo: membersBasicInfo });
  } catch (error) {
    res.status(500).json({
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
    const member = await Member.findOne({ member_id: member_id }).select(
      "member_id name area mob_tel res_tel"
    ); // Find by `member_id`
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found." });
    }

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching member.",
      error: error.message,
    });
  }
};


//Get member full details
exports.getMemberAllById = async (req, res) => {
  const { member_id } = req.query;
  // console.log(member_id)
  try {
    // console.log('Get Dependents')

    const member = await Member.find({ member_id: member_id }).select('member_id name area mob_tel res_tel');
    // console.log(member[0]._id)
    if (member) {
      const dependents = await Dependent.find({ member_id: member[0]._id }).select('name relationship');
      res.status(200).json({ success: true,  member:member, dependents: dependents });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dependents.",
      error: error.message,
    });
  }
};

//get family register
exports.getFamilyRegisterById = async (req, res) => {
  const { member_id } = req.query;

  try {
    // Fetch the member details
    const member = await Member.find({ member_id }).select("name _id dateOfDeath");

    // If no member is found, return an appropriate error response
    if (!member || member.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    // Add "relationship: 'member'" to the first member object
    member[0] = { ...member[0]._doc, relationship: "සාමාජික" };

    // Fetch dependents for the member
    const dependents = await Dependent.find({ member_id: member[0]._id }).select("name relationship _id dateOfDeath");

    // Add the member to the beginning of the dependents array
    dependents.unshift(member[0]);

    // Return the response with member and dependents
    res.status(200).json({
      success: true,
      FamilyRegister: dependents,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({
      success: false,
      message: "Error fetching member details.",
      error: error.message,
    });
  }
};


//Get area full details
exports.getMemberAllByArea = async (req, res) => {
  const { area } = req.query;
  // console.log(area)
  try {
    // console.log('Get Dependents')

    const members = await Member.find({ area: area }).select('member_id name area mob_tel res_tel').sort('member_id');
    // console.log(members)
    
      res.status(200).json({ success: true,  members:members });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching members.",
      error: error.message,
    });
  }
};



//update the member date of death
exports.updateDiedStatus = async (req, res) => {
  const { _id, dateOfDeath } = req.body;
console.log(req.body)
  // Input validation
  // if (typeof member_id !== "number") {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Invalid or missing member_id. It must be a number.",
  //   });
  // }

 // Convert dateOfDeath to a Date object
const parsedDateOfDeath = new Date(dateOfDeath);

// Check if the conversion results in a valid Date object
if (!(parsedDateOfDeath instanceof Date) || isNaN(parsedDateOfDeath.getTime())) {
  return res.status(400).json({
    success: false,
    message: "Invalid or missing 'dateOfDeath'. It must be a valid Date object.",
  });
}
  

  try {
    // Use Mongoose's `findOneAndUpdate` to update the died status
    const updatedMember = await Member.findOneAndUpdate(
      { _id }, // Filter condition
      { $set: { dateOfDeath } }, // Update the `died` field
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    // If no member is found, return a 404 error
    if (!updatedMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    // Respond with the updated member
    res.status(200).json({
      success: true,
      message: "Died status updated successfully.",
      member: updatedMember,
    });
  } catch (error) {
    // Handle any server or database errors
    res.status(500).json({
      success: false,
      message: "Error updating died status.",
      error: error.message,
    });
  }
};

//update the Dependent death
exports.updateDependentDiedStatus = async (req, res) => {
  const { _id, dateOfDeath } = req.body;
console.log(req.body)
  // Input validation
  // if (typeof member_id !== "number") {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Invalid or missing member_id. It must be a number.",
  //   });
  // }

  // Convert dateOfDeath to a Date object
const parsedDateOfDeath = new Date(dateOfDeath);

// Check if the conversion results in a valid Date object
if (!(parsedDateOfDeath instanceof Date) || isNaN(parsedDateOfDeath.getTime())) {
  return res.status(400).json({
    success: false,
    message: "Invalid or missing 'dateOfDeath'. It must be a valid Date object.",
  });
}

  try {
    // Use Mongoose's `findOneAndUpdate` to update the died status
    const updatedDependent = await Dependent.findOneAndUpdate(
      { _id }, // Filter condition
      { $set: { dateOfDeath } }, // Update the `died` field
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    // If no dependent is found, return a 404 error
    if (!updatedDependent) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    // Respond with the updated dependent
    res.status(200).json({
      success: true,
      message: "Died status updated successfully.",
      dependent: updatedDependent,
    });
  } catch (error) {
    // Handle any server or database errors
    res.status(500).json({
      success: false,
      message: "Error updating died status.",
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

    res.status(200).json({
      success: true,
      message: "Member updated successfully.",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
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
    res.status(500).json({
      success: false,
      message: "Error deleting member.",
      error: error.message,
    });
  }
};
