
import axiosInstance from "../config/axiosConfig";

export async function getUserForumActivity(userId) {
  try {
    const response = await axiosInstance.get(`/users/${userId}/forums`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user forums:", error);
    throw error;
  }
}

export async function getUserPostActivity(userId) {
  try {
    const response = await axiosInstance.get(`/users/${userId}/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}
