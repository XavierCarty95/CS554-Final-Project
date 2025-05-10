import axiosInstance from "../config/axiosConfig";

export async function getUserById(userId) {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
}
