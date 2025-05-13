import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../services/userServices";
import {
  getUserForumActivity,
  getUserPostActivity,
} from "../../services/userActivityServices";
import { getCoursesByProfessor } from "../../services/courseServices";
import axiosInstance from "../../config/axiosConfig";
import RequestChat from "../chats/RequestChat.jsx";
import Footer from "../Footer.jsx";

export default function ProfilePage() {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [showRequestChat, setShowRequestChat] = useState(false);
  const [message, setMessage] = useState("");
  const [forums, setForums] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [chatExists, setChatExists] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    major: "",
    year: "",
  });

  useEffect(() => {
    setIsLoading(true);
    getUserById(userId)
      .then((data) => {
        setProfileUser(data);
        setEditFormData({
          name: data.name || "",
          email: data.email || "",
          major: data.profile?.major || "",
          year: data.profile?.year || "",
        });
        setIsLoading(false);
      })
      // eslint-disable-next-line no-unused-vars
      .catch((err) => {
        setError("User not found");
        setIsLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    axiosInstance
      .get("/verify")
      .then((res) => setCurrentUser(res.data))
      .catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    if (profileUser?.universityId) {
      axiosInstance
        .get(`/universities/${profileUser.universityId}`)
        .then((res) => {
          setUniversityName(res.data.name);
        });
    }
    if (profileUser?.role === "professor") {
      getCoursesByProfessor(profileUser._id)
        .then((data) => setCourses(data))
        .catch((err) => console.error("Error loading courses:", err));
    }
  }, [profileUser]);

  useEffect(() => {
    if (profileUser) {
      setActivityLoading(true);
      getUserForumActivity(userId)
        .then((data) => {
          setForums(data);
        })
        .catch((err) => {
          console.error("Error loading forums:", err);
        });
      getUserPostActivity(userId)
        .then((data) => {
          setPosts(data);
          setActivityLoading(false);
        })
        .catch((err) => {
          console.error("Error loading posts:", err);
          setActivityLoading(false);
        });
    }
  }, [profileUser, userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/users/${userId}`,
        editFormData
      );
      setProfileUser(response.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response) {
        alert(
          `Failed to update profile: ${
            err.response.data.error || "Unknown server error"
          }`
        );
      } else if (err.request) {
        alert(
          "Failed to update profile: No response from server. Please check your connection."
        );
      } else {
        alert(`Failed to update profile: ${err.message}`);
      }
    }
  };

  if (isLoading)
    return <div className="p-4 text-center">Loading profile...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!profileUser) return null;

  const isOwnProfile = currentUser && currentUser._id === profileUser._id;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="relative px-6 pb-6">
            <div className="absolute -top-16 left-6">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                {profileUser.profilePicture ? (
                  <img
                    src={profileUser.profilePicture}
                    alt={profileUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">Profile</span>
                )}
              </div>
            </div>

            <div className="pt-20 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{profileUser.name}</h1>
                <div className="mt-1">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {profileUser.role}
                  </span>
                </div>
              </div>

              {isOwnProfile ? (
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  onClick={() => setShowRequestChat(true)}
                >
                  Message
                </button>
              )}
              {showRequestChat && (
                <RequestChat
                  senderId={currentUser._id}
                  receipentId={profileUser._id}
                  message={message}
                  setMessage={setMessage}
                  showRequestChat={showRequestChat}
                  onClose={() => setShowRequestChat(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - About */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              {isEditing && isOwnProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                      readOnly
                    />
                  </div>
                  {profileUser.role === "student" && (
                    <>
                      <div>
                        <label className="block text-sm text-gray-500 font-medium mb-1">
                          Major
                        </label>
                        <input
                          type="text"
                          name="major"
                          value={editFormData.major}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 font-medium mb-1">
                          Year
                        </label>
                        <input
                          type="text"
                          name="year"
                          value={editFormData.year}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-500 font-medium">Email</h3>
                    <p className="text-gray-800">{profileUser.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 font-medium">
                      University
                    </h3>
                    <p className="text-gray-800">{universityName || "N/A"}</p>
                  </div>
                  {profileUser.profile?.major && (
                    <div>
                      <h3 className="text-sm text-gray-500 font-medium">
                        Major
                      </h3>
                      <p className="text-gray-800">
                        {profileUser.profile.major}
                      </p>
                    </div>
                  )}
                  {profileUser.profile?.year && (
                    <div>
                      <h3 className="text-sm text-gray-500 font-medium">
                        Year
                      </h3>
                      <p className="text-gray-800">
                        {profileUser.profile.year}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Activity */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">User Activity</h2>

              {activityLoading ? (
                <div className="text-center p-4">Loading activity...</div>
              ) : forums.length === 0 && posts.length === 0 ? (
                <div className="text-gray-500 italic">
                  No recent activity to display.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Forums Created */}
                  {forums.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Discussion Threads Started
                      </h3>
                      <div className="space-y-3">
                        {forums.map((forum) => (
                          <div key={forum._id} className="border-b pb-3">
                            <Link
                              to={`/university/${forum.universityId}/forums/${forum._id}`}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              {forum.title}
                            </Link>
                            <div className="flex mt-1 text-sm">
                              <span className="text-gray-500">
                                Created on {formatDate(forum.createdAt)}
                              </span>
                              {forum.tags && forum.tags.length > 0 && (
                                <div className="ml-4 flex flex-wrap gap-1">
                                  {forum.tags.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Posts Created */}
                  {posts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Replies Posted
                      </h3>
                      <div className="space-y-3">
                        {posts.map((post) => (
                          <div key={post._id} className="border-b pb-3">
                            <div className="mb-1">
                              <Link
                                to={`/university/${post.universityId}/forums/${post.forumId}`}
                                className="text-blue-600 hover:underline"
                              >
                                {post.forumTitle}
                              </Link>
                            </div>
                            <p className="text-gray-700">{post.content}</p>
                            <div className="text-sm text-gray-500 mt-1">
                              Posted on {formatDate(post.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
