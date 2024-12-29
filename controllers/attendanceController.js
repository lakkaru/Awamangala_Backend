const Attendance = require('../models/attendance');

//create an attendance
const createAttendance = async (req, res) => {
  try {
    // console.log(req.body);
    const { date, subject, eventId, absent } = req.body.attendanceData;

    // Validate input
    if (!date || !subject || !eventId || !Array.isArray(absent)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Filter only members who are attending
    // const attendingMembers = attendance
    //   .filter(member => member.checked === true)
    //   .map(member => member.memberId);

    // if (attendingMembers.length === 0) {
    //   return res.status(400).json({ error: "No members marked as attending" });
    // }
    console.log(date,
      subject,
      eventId,
      absent,)
    // Create a new attendance document
    const attendanceDocument = new Attendance({
      date,
      subject,
      eventId,
      absent,
    });

    // Save the document to the database
    const savedAttendance = await attendanceDocument.save();

    res.status(201).json({
      message: "Funeral attendance created successfully",
      data: savedAttendance,
    });
  } catch (error) {
    console.error("Error creating funeral attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createAttendance };
