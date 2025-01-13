const MeetingAttendance = require("../models/meetingAttendance");
const Members = require("../models/member");

// Create a meeting attendance with absent members
const createMeetingAttendance = async (req, res) => {
  try {
    const fineAmount = 500; // Fine amount for three consecutive absences
    const { date, absentMemberIds } = req.body;

    // Validate input
    if (!date || !Array.isArray(absentMemberIds)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Save the new attendance record
    const meetingAbsents = new MeetingAttendance({
      date,
      absents: absentMemberIds,
    });
    const savedAttendance = await meetingAbsents.save();

    // Create bulk updates for members
    const bulkOperations = [];
    const allMembers = await Members.find(); // Retrieve all members from the database

    allMembers.forEach((member) => {
      const isAbsent = absentMemberIds.includes(member.member_id);
      const currentAbsents = member.meetingAbsents || 0; // Get the current meetingAbsents count

      let update = {};

      if (isAbsent) {
        const newAbsents = currentAbsents + 1; // Increment if absent
        update.meetingAbsents = newAbsents;

        if (newAbsents === 3) {
          // Add fine if absent for three consecutive meetings
          update.$push = {
            fines: {
              eventId: savedAttendance._id,
              eventType: "meeting",
              amount: fineAmount,
            },
          };
        }
      } else {
        // Reset meetingAbsents if the member attended
        update.meetingAbsents = 0;
      }

      bulkOperations.push({
        updateOne: {
          filter: { member_id: member.member_id },
          update: update,
        },
      });
    });

    // Execute the bulk write operation
    const result = await Members.bulkWrite(bulkOperations);

    console.log("Attendance and fines updated successfully:", result);

    res.status(201).json({
      message: "Meeting attendance created successfully",
      data: savedAttendance,
    });
  } catch (error) {
    console.error("Error creating meeting attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createMeetingAttendance };
