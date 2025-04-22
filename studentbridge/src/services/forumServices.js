import axios from "../config/axiosConfig";

const BASE_URL = "/university";

export async function getForums(universityId) {
  try {
    const response = await axios.get(`${BASE_URL}/${universityId}/forums`);
    return response.data;
  } catch (error) {
    console.error("Error fetching forums:", error);
    throw error;
  }
}

export async function getPosts(forumId, universityId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/${universityId}/forums/${forumId}/posts`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function getForumById(forumId, universityId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/${universityId}/forums/${forumId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching forum details:", error);
    throw error;
  }
}

export async function createForum({ title, universityId, tags }) {
  try {
    const response = await axios.post(`${BASE_URL}/${universityId}/forums`, {
      title,
      tags,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating forum:", error);
    throw error;
  }
}

export async function createPost({ forumId, content, universityId }) {
  try {
    const response = await axios.post(
      `${BASE_URL}/${universityId}/forums/${forumId}/posts`,
      {
        content,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function votePost(postId, voteType, universityId) {
  try {
    const response = await axios.post(
      `${BASE_URL}/${universityId}/forums/posts/${postId}/vote`,
      {
        voteType,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error voting on post:", error);
    throw error;
  }
}
