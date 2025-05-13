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
    <div className="p-8 max-w-4xl mx-auto">
      {isStudent ? (
        <>
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold mb-2 text-blue-800">
              Student Groups
            </h1>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => setShowAddGroup(!showAddGroup)}
            >
              {showAddGroup ? "Cancel" : "Post a New Group"}
            </button>
          </header>

          {showAddGroup && (
            <section className="mb-8 bg-white p-6 rounded-lg shadow border">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Create a New Group
              </h2>
              <form className="space-y-4" onSubmit={handlePostGroup}>
                <input
                  type="text"
                  placeholder="Group Name"
                  name="groupName"
                  id="groupName"
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                  placeholder="Group Description"
                  name="description"
                  id="description"
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3}
                ></textarea>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Post Group
                </button>
              </form>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-700">My Groups</h2>
            {myGroups.length > 0 ? (
              <ul className="grid gap-4 md:grid-cols-2">
                {myGroups.map((group) => (
                  <li key={group._id}>
                    <Link
                      to={`/university/${universityId}/groups/${group._id}`}
                      className="block bg-white p-5 rounded-lg shadow hover:shadow-lg border hover:border-blue-400 transition"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {group.groupName}
                      </h3>
                      <p className="text-gray-600 mt-1">{group.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You have not created any groups yet.</p>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Joined Groups</h2>
            {joinedGroups.length > 0 ? (
              <ul className="grid gap-4 md:grid-cols-2">
                {joinedGroups.map((group) => (
                  <li key={group._id}>
                    <Link
                      to={`/university/${universityId}/groups/${group._id}`}
                      className="block bg-white p-5 rounded-lg shadow hover:shadow-lg border hover:border-blue-400 transition"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {group.groupName}
                      </h3>
                      <p className="text-gray-600 mt-1">{group.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You have not joined any groups yet.</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Available Groups</h2>
            {groupsList.length > 0 ? (
              <ul className="grid gap-4 md:grid-cols-2">
                {groupsList.map((group) => (
                  <li
                    key={group._id}
                    className="bg-white p-5 rounded-lg shadow border hover:border-blue-400 transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {group.groupName}
                    </h3>
                    <p className="text-gray-600 mt-1">{group.description}</p>
                    <button
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      onClick={() => handleJoinGroup(group._id)}
                    >
                      Join Group
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No groups available to join.</p>
            )}
          </section>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            You are not a student at this university.
          </h1>
          <Link
            to={`/universities/${universityId}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Go Back
          </Link>
        </div>
      )}
    </div>
  );
};

export default GroupList;
