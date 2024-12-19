const mongoose = require("mongoose");

// const { response } = require("../app");
const Member = require("../models/member"); // Import the Member model
const Dependent = require("../models/dependent");

// Get next member ID
exports.getNextId = async (req, res) => {
  try {
    // Find the member with the highest member_id
    const highestMember = await Member.findOne({})
      .sort({ member_id: -1 }) // Sort by member_id in descending order
      .select("member_id"); // Only select the member_id field

    // Determine the next member_id
    const nextMemberId = highestMember ? highestMember.member_id + 1 : 1;

    res.status(200).json({
      success: true,
      nextMemberId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting next memberId.",
      error: error.message,
    });
  }
};



// Create a new member and dependents
exports.createMember = async (req, res) => {
  console.log(req.body);
  let newlyAddedMember = {};
  try {
    const {
      member_id,
      name,
      area,
      password,
      res_tel,
      mob_tel,
      address,
      email,
      nic,
      birthday,
    } = req.body;
    const { dependents } = req.body;

    // Validate required fields
    if (!member_id || !area || !name) {
      return res.status(400).json({
        success: false,
        message: "Member ID, area, and name are required.",
      });
    }

    // Create and save the new member
    const newMember = new Member({
      member_id,
      name,
      area,
      password,
      res_tel,
      mob_tel,
      address,
      email,
      nic,
      birthday,
    });

    await newMember.save()
      .then((member) => {
        newlyAddedMember = member;
      })
      .catch((error) => {
        console.error("Error saving member:", error);
        return res.status(500).json({
          success: false,
          message: "Error saving member.",
          error: error.message,
        });
      });

    // Collect the IDs of saved dependents
    const dependentIds = [];

    // Create and save dependents
    if (dependents && dependents.length > 0) {
      for (const dependent of dependents) {
        if (dependent.name !== "") {
          const newDependent = new Dependent({
            name: dependent.name,
            relationship: dependent.relationship,
            nic: dependent.nic,
            birthday: dependent.birthday,
            member_id: newlyAddedMember._id, // Link dependent to the newly added member
          });

          await newDependent.save()
            .then((savedDependent) => {
              console.log("Dependent saved successfully:", savedDependent);
              dependentIds.push(savedDependent._id); // Collect dependent IDs
            })
            .catch((error) => {
              console.error("Error saving dependent:", error);
              return res.status(500).json({
                success: false,
                message: "Error saving dependent.",
                error: error.message,
              });
            });
        }
      }
    }

    // Update the member document with the dependents' IDs
    newlyAddedMember.dependents = dependentIds;
    await newlyAddedMember.save()
      .then(() => {
        console.log("Member updated with dependents successfully.");
      })
      .catch((error) => {
        console.error("Error updating member with dependents:", error);
        return res.status(500).json({
          success: false,
          message: "Error updating member with dependents.",
          error: error.message,
        });
      });


    res.status(200).json({
      success: true,
      message: "Member and dependents created successfully.",
      member: newlyAddedMember,
    });
  } catch (error) {
    console.error("Error in createMember:", error);
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

    const member = await Member.findOne({ member_id: member_id }).select('-password').populate('dependents');
    // const member = await Member.findOne({ member_id: member_id });  // Populate dependents
    // console.log(member[0]._id)
    if (member) {
      // console.log(member)
      // console.log(member.dependents)
      // const dependents = await Dependent.find({
      //   member_id: member[0]._id,
      // }).select("name relationship");
      res
        .status(200)
        .json({ success: true, member: member, dependents: member.dependents });
      
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
//     // Fetch the member details
//     const member = await Member.findOne({ member_id: member_id }).select(
//       "name _id dateOfDeath"
//     ).populate('dependents');
// // console.log(member)

//     // If no member is found, return an appropriate error response
//     if (!member ) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found.",
//       });
//     }
const member = await Member.findOne({ member_id: member_id })
  .select("name _id dateOfDeath")
  .populate("dependents");

if (!member) {
  throw new Error("Member not found");
}

// Add "relationship": "member" to the member object
const memberWithRelationship = {
  ...member.toObject(), // Convert Mongoose document to plain JS object
  relationship: "සාමාජික",
};

// // Create a new array with the member object and dependents
// const dependentsWithRelationship = member.dependents.map((dependent) => ({
//   ...dependent.toObject(),
//   relationship: "dependent",
// }));

const FamilyRegister = [memberWithRelationship, ...member.dependents];

console.log(FamilyRegister);

    // Add "relationship: 'member'" to the first member object
    // member = { ...member, relationship: "සාමාජික" };
    // console.log(member)

    // Fetch dependents for the member
    // const dependents = await Dependent.find({
    //   member_id: member._id,
    // }).select("name relationship _id dateOfDeath");
// const dependents=member._doc.dependents
    // Add the member to the beginning of the dependents array
    // dependents.unshift(member);

    // Return the response with member and dependents
    res.status(200).json({
      success: true,
      FamilyRegister,
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
  // console.log("first");
  const { area } = req.query; // Extract the query parameter
  console.log(area); // Log the area to check the value

  try {
    const members = await Member.find({ area: area })
      .select("member_id name area mob_tel res_tel")
      .sort("member_id");

    res.status(200).json({ success: true, members: members });
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
  // console.log(req.body)
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
  if (
    !(parsedDateOfDeath instanceof Date) ||
    isNaN(parsedDateOfDeath.getTime())
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid or missing 'dateOfDeath'. It must be a valid Date object.",
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
  // console.log(req.body)
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
  if (
    !(parsedDateOfDeath instanceof Date) ||
    isNaN(parsedDateOfDeath.getTime())
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid or missing 'dateOfDeath'. It must be a valid Date object.",
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

//update member and dependents
exports.updateMember = async (req, res) => {
  try {
    const MemberNewData = req.body;
    const _id = MemberNewData._id;
    const dependents = MemberNewData.dependents;

    // First, update the member's data (excluding dependents)
    // const member = await Member.findByIdAndUpdate(_id, MemberNewData, { new: true });
    const member = await Member.findById(_id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }
console.log(member)
    // Handle dependents update
    if (dependents && dependents.length > 0) {
      // First, delete the existing dependents for this member
      await Dependent.deleteMany({ _id: { $in: member.dependents } });

      // Create and save new dependents
      const dependentIds = [];
      for (const dependent of dependents) {
        if (dependent.name !== "") {
          const newDependent = new Dependent({
            name: dependent.name,
            relationship: dependent.relationship,
            nic: dependent.nic,
            birthday: dependent.birthday,
          });

          const savedDependent = await newDependent.save();
          dependentIds.push(savedDependent._id); // Collect dependent ObjectId
        }
      }

      // Update the member's dependents list with new dependent IDs (only ObjectId)
      member.dependents = dependentIds;

      // Save the member with the updated dependents
      await member.save()
        .then(() => {
          console.log("Member updated with new dependents successfully.");
        })
        .catch((error) => {
          console.error("Error updating member with dependents:", error);
          return res.status(500).json({
            success: false,
            message: "Error updating member with dependents.",
            error: error.message,
          });
        });
    }

    res.status(200).json({
      success: true,
      message: "Member and dependents updated successfully.",
      data: member,
    });
  } catch (error) {
    console.error("Error updating member:", error);
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
