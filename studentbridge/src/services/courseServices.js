import axiosInstance from "../config/axiosConfig";


export async function getCoursesByProfessor(professorId) {
  const res = await axiosInstance.get(`/courses/professor/${professorId}`);
  return res.data;
}


export async function createCourse({ title, description, professorId, universityId }) {
  const res = await axiosInstance.post("/courses", {
    title,
    description,
    professorId,
    universityId
  });
  return res.data;
}

export async function deleteCourseById(courseId) {
  const res = await axiosInstance.delete(`/courses/${courseId}`);
  return res.data;
}