import axiosInstance from "../../config/axiosConfig";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const GroupPage = () => {
  const { groupId } = useParams();
  const { universityId } = useParams();
  const navigate = useNavigate();

  const [groupDetails, setGroupDetails] = useState(null);
  const [owner, setOwner] = useState(false);
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
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    fetchGroupDetails();
  }, [groupId, universityId]);

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

  return (
    <div className="p-5 font-sans">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          {groupDetails?.groupName || "Group Name"}
        </h1>
        <p className="text-gray-700 mb-6">
          {groupDetails?.description || "No description available."}
        </p>
        <h2 className="text-xl font-semibold mb-3">Members</h2>
        <ul className="list-disc pl-5">
          {groupDetails?.members && groupDetails.members.length > 0 ? (
            groupDetails.members.map((member, index) => (
              <Link to={`/profile/${member._id}`} key={index}>
                <li key={index} className="text-gray-800">
                  {member.name}
                </li>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No members in this group.</p>
          )}
        </ul>
      </div>
      <div className="mt-4">
        <Link
          to={`/university/${universityId}/groups`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Groups
        </Link>
        <button
          onClick={handleLeaveGroup}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
        >
          {owner ? <p>Delete Group</p> : <p>Leave Group</p>}
        </button>
      </div>
    </div>
  );
};

export default GroupPage;
