import axios from "../config/axiosConfig";

export async function getUserById(userId) {
  const response = await axios.get(`/users/${userId}`);
  return response.data;
}