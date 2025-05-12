import axiosInstance from "../../config/axiosConfig";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const GroupPage = () => {
  const { groupId } = useParams();
  const { universityId } = useParams();

  const [groupDetails, setGroupDetails] = useState(null);
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/university/${universityId}/groups/getGroupById?groupId=${groupId}`
        );
        setGroupDetails(response.data);
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    };

    fetchGroupDetails();
  }, [groupId, universityId]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>{groupDetails?.name || "Group Name"}</h1>
      <p>{groupDetails?.description || "No description available."}</p>
      <h2>Members</h2>
      <ul>
        {groupDetails?.members && groupDetails.members.length > 0 ? (
          groupDetails.members.map((member, index) => (
            <li key={index}>{member}</li>
          ))
        ) : (
          <p>No members in this group.</p>
        )}
      </ul>
    </div>
  );
};

export default GroupPage;
