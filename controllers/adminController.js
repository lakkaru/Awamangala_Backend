const Admin = require("../models/admin");

exports.createAdmins = async (req, res) => {
  // console.log(req.body)
  try {
    // Validate the input data
    const {
      chairman,
      secretary,
      viceChairman,
      viceSecretary,
      treasurer,
      loanTreasurer,
      speakerHandler,
      areaAdmins,
    } = req.body;

    // Ensure required fields are provided
    if (!chairman || !secretary || !treasurer || !Array.isArray(areaAdmins)) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    // Create the new admin document
    const newAdmin = new Admin({
      chairman,
      secretary,
      viceChairman,
      viceSecretary,
      treasurer,
      loanTreasurer,
      speakerHandler,
      areaAdmins,
    });

    // Save to the database
    const savedAdmin = await newAdmin.save();

    // Respond with success
    res.status(200).json({
      message: "Admins created successfully",
      data: savedAdmin,
    });
  } catch (error) {
    console.error("Error creating admins:", error);

    // Respond with error
    res.status(500).json({
      message: "An error occurred while creating admins",
      error: error.message,
    });
  }
};

exports.getAdminsForFuneral = async (req, res) => {
  try {
    const { area } = req.query;
    // console.log("area from create admins: ", area);
    // Generalize the area for matching
    const baseArea = area.replace(/\s*\d+$/, "").trim();

    const result = await Admin.findOne(
      { "areaAdmins.area": { $regex: `^${baseArea}`, $options: "i" } }, // Match the area admin
      {
        chairman: 1,
        secretary: 1,
        viceChairman: 1,
        viceSecretary: 1,
        treasurer: 1,
        loanTreasurer: 1,
        "areaAdmins.$": 1, // Return only the matching areaAdmin
      }
    ).lean();

    if (result) {
      // Collect all member IDs from main admins
      const memberIds = [
        result.chairman?.memberId,
        result.secretary?.memberId,
        result.viceChairman?.memberId,
        result.viceSecretary?.memberId,
        result.treasurer?.memberId,
        result.loanTreasurer?.memberId,
      ];

      // If an areaAdmin is found, add its memberId and helpers' memberIds
      if (result.areaAdmins && result.areaAdmins.length > 0) {
        const { memberId, helper1, helper2 } = result.areaAdmins[0];
        memberIds.push(memberId, helper1?.memberId, helper2?.memberId);
      }

      // Filter out null/undefined values
      const uniqueMemberIds = [...new Set(memberIds.filter(Boolean))].sort((a, b) => a - b);


      res.status(200).json(uniqueMemberIds);
    } else {
      res.status(404).json({ message: "No matching data found." });
    }
  } catch (error) {
    console.error("Error getting Admin IDs:", error.message);
    res
      .status(500)
      .json({ message: "Error getting Admin IDs", error: error.message });
  }
};
