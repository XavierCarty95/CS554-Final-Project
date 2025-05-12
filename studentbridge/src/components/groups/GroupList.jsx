import axiosInstance from "../../config/axiosConfig";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const GroupList = () => {
  const [isStudent, setIsStudent] = useState(false);
  const [myGroups, setMyGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [userId, setUserId] = useState(null);
  const { universityId } = useParams();

  useEffect(() => {
    const checkIfStudent = async () => {
      try {
        const response = await axiosInstance.get(
          `/university/${universityId}/groups/isStudent`
        );
        setIsStudent(response.data.isStudent);
      } catch (error) {
        console.error("Error checking student status:", error);
      }
    };

    checkIfStudent();
  }, [universityId]);

  useEffect(() => {
    const fetchUserAndGroups = async () => {
      try {
        const userResponse = await axiosInstance.get("/verify");
        const userId = userResponse.data?._id;
        if (!userId) {
          console.error("User not found in response");
          return;
        }
        setUserId(userId);

        const groupsResponse = await axiosInstance.get(
          `/university/${universityId}/groups/getGroups`
        );
        let groups = groupsResponse.data;
        groups = groups.map((group) => {
          group.members = group.members.map((member) => member._id);
          return group;
        });

        setMyGroups(groups.filter((group) => group.createdBy._id === userId));
        setJoinedGroups(
          groups.filter(
            (group) =>
              group.members.includes(userId) && group.createdBy._id !== userId
          )
        );
        setGroupsList(
          groups.filter(
            (group) =>
              group.createdBy._id !== userId && !group.members.includes(userId)
          )
        );
      } catch (error) {
        console.error("Error fetching user or groups:", error);
      }
    };

    fetchUserAndGroups();
  }, [universityId]);

  const handlePostGroup = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const groupName = formData.get("groupName").trim();
    const description = formData.get("description").trim();
    if (!groupName || !description) {
      alert("Please fill in all fields");
      return;
    }
    if (groupName.length < 3 || groupName.length > 50) {
      alert("Group name must be between 3 and 50 characters");
      return;
    }
    if (description.length < 10 || description.length > 200) {
      alert("Description must be between 10 and 200 characters");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/university/${universityId}/groups/createGroup`,
        {
          groupName,
          universityId,
          description,
        }
      );
      setMyGroups((prevGroups) => [...prevGroups, response.data]);
      setShowAddGroup(false);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await axiosInstance.post(
        `/university/${universityId}/groups/joinGroup`,
        {
          groupId,
          userId,
        }
      );
      setJoinedGroups((prevGroups) => [...prevGroups, response.data]);
      setGroupsList((prevGroups) =>
        prevGroups.filter((group) => group._id !== groupId)
      );
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  return (
    <div className="p-6">
      {isStudent ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Welcome to the Student Group List
          </h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setShowAddGroup(!showAddGroup)}
          >
            Post a new group
          </button>
          {showAddGroup && (
            <div className="mt-6 p-4 border rounded shadow-md bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Create a new group</h2>
              <form className="space-y-4" onSubmit={handlePostGroup}>
                <input
                  type="text"
                  placeholder="Group Name"
                  name="groupName"
                  id="groupName"
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Group Description"
                  name="description"
                  id="description"
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Post Group
                </button>
              </form>
            </div>
          )}

          <h2 className="text-xl font-semibold mt-6 mb-4">My Groups</h2>
          <div>
            <div>
              {myGroups.length > 0 ? (
                <ul className="space-y-4">
                  {myGroups.map((group) => (
                    <li
                      key={group._id}
                      className="p-4 border rounded shadow-md"
                    >
                      <h3 className="text-lg font-semibold">
                        {group.groupName}
                      </h3>
                      <p className="text-gray-600">{group.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  You have not created any groups yet.
                </p>
              )}
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4">Joined Groups</h2>
            <div>
              {joinedGroups.length > 0 ? (
                <ul className="space-y-4">
                  {joinedGroups.map((group) => (
                    <Link
                      to={`/university/${universityId}/groups/${group._id}`}
                    >
                      <li
                        key={group._id}
                        className="p-4 border rounded shadow-md"
                      >
                        <h3 className="text-lg font-semibold">
                          {group.groupName}
                        </h3>
                        <p className="text-gray-600">{group.description}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  You have not joined any groups yet.
                </p>
              )}
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              Available Groups
            </h2>
            <div>
              {groupsList.length > 0 ? (
                <ul className="space-y-4">
                  {groupsList.map((group) => (
                    <li
                      key={group._id}
                      className="p-4 border rounded shadow-md"
                    >
                      <h3 className="text-lg font-semibold">
                        {group.groupName}
                      </h3>
                      <p className="text-gray-600">{group.description}</p>
                      <button
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        onClick={() => {
                          handleJoinGroup(group._id);
                          setGroupsList((prevGroups) =>
                            prevGroups.filter((g) => g._id !== group._id)
                          );
                        }}
                      >
                        Join Group
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No groups available to join.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            You are not a student at this university.
          </h1>
          <Link
            to={`/universities/${universityId}`}
            className="text-blue-500 underline hover:text-blue-700"
          >
            Go Back
          </Link>
        </div>
      )}
    </div>
  );
};

export default GroupList;
