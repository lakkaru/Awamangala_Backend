const Member = require("../models/member");
// const Dependent = require("../models/dependent");
const Funeral = require("../models/funeral");

//create a funeral event
exports.createFuneral = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    let {
      date,
      member_id,
      deceased_id,
      cemeteryAssignments,
      funeralAssignments,
      removedMembers
    } = req.body;

    //   console.log("Extracted data:", { date, member_id, deceased_id, cemetery, funeral });
    // Assign member_id to deceased_id if deceased_id is "member"
    
    if (deceased_id === "member") {
      deceased_id = member_id;
    }

    const newFuneral = new Funeral({
      date,
      member_id,
      deceased_id,
      cemeteryAssignments,
      funeralAssignments,
      removedMembers
    });

    console.log("New funeral object:", newFuneral);

    const savedFuneral = await newFuneral.save();

    res.status(201).json(savedFuneral);
  } catch (error) {
    console.error("Error creating funeral:", error.message);
    res
      .status(500)
      .json({ message: "Error creating funeral", error: error.message });
  }
};

//getLast cemetery Assignment member and removed members for next duty assignments
exports.getLastAssignmentInfo = async (req, res) => {
  try {
    const lastAssignment = await Funeral.find().sort({ _id: -1 }).limit(1);
// console.log(lastAssignment)
const lastMember_id = lastAssignment[0].cemeteryAssignments[14].member_id;
const removedMembers=lastAssignment[0].removedMembers
const removedMembers_ids=removedMembers.map(member=>member.member_id)
// console.log(removedMembers_ids)
// const lastMember=await Member.findOne({_id:lastMember_id}).select("member_id");


    res.status(200).json({lastMember_id, removedMembers_ids});
  } catch (error) {
    console.error("Error getting last assignment:", error.message);
    res
      .status(500)
      .json({ message: "Error getting last assignment", error: error.message });
  }
};
//get funeral id by deceased id
exports.getFuneralByDeceasedId = async (req, res) => {
  try {
    // console.log(req.query)
    const { deceased_id } = req.query;

   
    const funeral_id = await Funeral.findOne({
      deceased_id: deceased_id,
    }).select("_id"); // Find the funeral by deceased_id
    //   console.log(funeral_id)
    return res.status(200).json(funeral_id);
  } catch (error) {
    console.error("Error getting funeral by deceased_id:", error.message);
    res.status(500).json({
      message: "Error getting funeral by deceased_id",
      error: error.message,
    });
  }
};
//get funeral attendance by deceased id
exports.getFuneralAssignmentsByDeceasedId = async (req, res) => {
  try {
    // console.log(req.query)
    const { deceased_id } = req.query;
 
    const funeralAttendance = await Funeral.findOne({
      deceased_id: deceased_id,
    }).select("cemeteryAssignments funeralAssignments _id"); // Find the funeral by deceased_id
    //   console.log(funeralAttendance._id)
    return res.status(200).json(funeralAttendance);
  } catch (error) {
    console.error("Error getting funeral attendance by deceased_id:", error.message);
    res.status(500).json({
      message: "Error getting funeral attendance by deceased_id",
      error: error.message,
    });
  }
};
