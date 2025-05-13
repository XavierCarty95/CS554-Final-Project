import axiosInstance from "../../config/axiosConfig";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const GroupPage = () => {
  const { groupId, universityId } = useParams();
  const navigate = useNavigate();

  const [groupDetails, setGroupDetails] = useState(null);
  const [owner, setOwner] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetingLink, setMeetingLink] = useState("");
  const [message, setMessage] = useState("");
  const [meets, setMeets] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/university/${universityId}/groups/getGroupById?groupId=${groupId}`
        );
        setGroupDetails(response.data);
        const userInfo = await axiosInstance.get("/verify");
        const userId = userInfo.data._id;
        setOwner(userId === response.data.createdBy._id);
        if (response.data.meetings && response.data.meetings.length > 0) {
          let meetings = response.data.meetings;
          meetings.sort((a, b) => new Date(a.date) - new Date(b.date));
          const currentDate = new Date();
          const upcomingMeetings = meetings.filter((meeting) => {
            const meetingDate = new Date(meeting.date);
            return meetingDate > currentDate;
          });
          console.log(upcomingMeetings);
          setMeets(upcomingMeetings);
        }
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    fetchGroupDetails();
  }, [groupId, universityId, meets]);

  const handleLeaveGroup = async () => {
    try {
      await axiosInstance.get(
        `/university/${universityId}/groups/leaveGroup/${groupId}`
      );
      navigate(`/university/${universityId}/groups`);
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    const time = e.target.time.value;
    const date = new Date(selectedDate);
    date.setHours(time.split(":")[0]);
    date.setMinutes(time.split(":")[1]);
    date.setSeconds(0);
    if (!meetingLink.trim()) {
      alert("Meeting link is required.");
      return;
    }
    if (!/^https?:\/\/.+/.test(meetingLink.trim())) {
      alert(
        "Please enter a valid meeting link (must start with http:// or https://)."
      );
      return;
    }
    if (!e.target.time.value) {
      alert("Please select a time for the meeting.");
      return;
    }

    const meetingDetails = {
      groupId: groupId,
      date: date,
      emails: groupDetails.members.map((member) => member.email),
      meetingLink,
      message,
    };

    try {
      await axiosInstance.post(`/api/schedule-meeting`, meetingDetails);
      setMeets((prev) => [
        ...prev,
        {
          date: date,
          meetingLink: meetingLink,
          message: message,
        },
      ]);

      alert("Meeting scheduled and invites sent!");
    } catch (error) {
      console.error("Error scheduling meeting:", error);
    }
  };

  return (
    <div className="p-5 bg-blue-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-700 flex-1">
            {groupDetails?.groupName || "Group Name"}
          </h1>
          <span className="text-xs text-gray-400">
            {owner ? "You are the owner" : ""}
          </span>
        </div>
        <p className="text-gray-600 mb-4 italic">
          {groupDetails?.description || "No description available."}
        </p>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-blue-600 mb-1">Members</h2>
          <div className="flex flex-wrap gap-2">
            {groupDetails?.members && groupDetails.members.length > 0 ? (
              groupDetails.members.map((member, index) => (
                <Link
                  to={`/profile/${member._id}`}
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                >
                  {member.name}
                </Link>
              ))
            ) : (
              <span className="text-gray-400">No members in this group.</span>
            )}
          </div>
        </div>
        {meets && Array.isArray(meets) && meets.length > 0 && (
          <div className="bg-blue-50 border rounded p-3 mb-4">
            <h2 className="text-base font-semibold text-blue-700 mb-1">
              Upcoming Meetings
            </h2>
            <ul className="space-y-2">
              {meets.map((meeting, idx) => (
                <li key={idx} className="border-b pb-2 last:border-b-0">
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(meeting.date).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Link:</span>{" "}
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {meeting.meetingLink}
                    </a>
                  </div>
                  {meeting.message && (
                    <div>
                      <span className="font-medium">Message:</span>{" "}
                      {meeting.message}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex gap-3 mt-3">
          <Link
            to={`/university/${universityId}/groups`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Groups
          </Link>
          <button
            onClick={handleLeaveGroup}
            className={`${
              owner
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-500 hover:bg-red-600"
            } text-white px-4 py-2 rounded`}
          >
            {owner ? "Delete Group" : "Leave Group"}
          </button>
        </div>
        {owner && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Schedule a Meeting
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  minDate={new Date()}
                  className="rounded border"
                  calendarType="gregory"
                />
              </div>
              <form
                onSubmit={handleSchedule}
                className="flex-1 flex flex-col gap-2"
              >
                <label className="font-medium text-gray-700">
                  Time
                  <input
                    type="time"
                    name="time"
                    className="w-full border rounded px-2 py-1 mt-1"
                    required
                    min={
                      selectedDate &&
                      new Date(selectedDate).toDateString() ===
                        new Date().toDateString()
                        ? new Date().toTimeString().slice(0, 5)
                        : undefined
                    }
                  />
                </label>
                <label className="font-medium text-gray-700">
                  Meeting Link
                  <input
                    type="text"
                    placeholder="Meeting link"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1"
                    required
                  />
                </label>
                <label className="font-medium text-gray-700">
                  Message (optional)
                  <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
                >
                  Schedule &amp; Send Invites
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
