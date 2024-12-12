const Dependent = require("../models/dependent");

// Create a new dependent
exports.createDependent = async (req, res) => {
  try {
    const { id, member_id, name, relationship, birthday, nic } = req.body;

    const newDependent = new Dependent({
      id,
      member_id,
      name,
      relationship,
      birthday,
      nic,
    });

    const savedDependent = await newDependent.save();
    res
      .status(201)
      .json({
        message: "Dependent created successfully",
        data: savedDependent,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating dependent", error: error.message });
  }
};

// Get all dependents
exports.getAllDependents = async (req, res) => {
  console.log("dependents");
  try {
    const dependents = await Dependent.find();
    // console.log(dependents)
    res
      .status(200)
      .json({ message: "Dependents retrieved successfully", data: dependents });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving dependents", error: error.message });
  }
};

// Get a single dependent by ID
exports.getDependentsById = async (req, res) => {
  try {
    console.log(req.params)
    const { member_id } = req.params;
    console.log(member_id)
    const dependents = await Dependent.find({ member_id: member_id });

    if (!dependents) {
      return res.status(404).json({ message: "Dependent not found" });
    }

    res
      .status(200)
      .json({ message: "Dependent retrieved successfully", dependents });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving dependent", error: error.message });
  }
};

// Update a dependent by ID
exports.updateDependentById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedDependent = await Dependent.findOneAndUpdate({ id }, updates, {
      new: true,
      runValidators: true, // Ensure validation rules are applied to updates
    });

    if (!updatedDependent) {
      return res.status(404).json({ message: "Dependent not found" });
    }

    res
      .status(200)
      .json({
        message: "Dependent updated successfully",
        data: updatedDependent,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating dependent", error: error.message });
  }
};

// Delete a dependent by ID
exports.deleteDependentById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDependent = await Dependent.findOneAndDelete({ id });

    if (!deletedDependent) {
      return res.status(404).json({ message: "Dependent not found" });
    }

    res
      .status(200)
      .json({
        message: "Dependent deleted successfully",
        data: deletedDependent,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting dependent", error: error.message });
  }
};
