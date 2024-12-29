const Member = require("../models/member");
const Dependent = require("../models/dependent");
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
      funeralAssignment,
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
      funeralAssignment,
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

//getLastAssignment member for next duty assignments
exports.getLastAssignment = async (req, res) => {
  try {
    const lastAssignment = await Funeral.find().sort({ _id: -1 }).limit(1);
// console.log(lastAssignment)
const lastMember_id = lastAssignment[0].cemeteryAssignments[14];
console.log(lastMember_id)
const lastMember=await Member.findOne({_id:lastMember_id}).select("member_id");
    res.status(200).json(lastMember);
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
