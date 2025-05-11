import axiosInstance from "../config/axiosConfig";

// Get all courses taught by a specific professor
export async function getCoursesByProfessor(professorId) {
  const res = await axiosInstance.get(`/courses/professor/${professorId}`);
  return res.data;
}

// Create a new course
export async function createCourse({ title, description, professorId, universityId }) {
  const res = await axiosInstance.post("/courses", {
    title,
    description,
    professorId,
    universityId
  });
  return res.data;
}

// Delete a course by ID
export async function deleteCourseById(courseId) {
  const res = await axiosInstance.delete(`/courses/${courseId}`);
  return res.data;
}