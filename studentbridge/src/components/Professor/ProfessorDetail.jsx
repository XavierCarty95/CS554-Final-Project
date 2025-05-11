/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

function ProfessorDetailPage() {
  const { universityId, professorId } = useParams();
  const [professor, setProfessor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [professorCourses, setProfessorCourses] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/professors/byUniversity/${universityId}`)
      .then((res) => {
        const found = res.data.find((p) => p._id === professorId);
        setProfessor(found || null);
      })
      .catch(() => setError("Failed to load professor data"));

    axiosInstance
      .get(`/courses/professor/${professorId}`)
      .then((res) => setProfessorCourses(res.data))
      .catch(() => console.warn("Could not load professor's courses"));

    axiosInstance
      .get(`/reviews/${professorId}`)
      .then((res) => setReviews(res.data))
      .catch(() => setError("Could not load reviews"));

    axiosInstance
      .get("/verify")
      .then((res) => {
        setUserId(res.data._id);
        setUserName(res.data.name);
      })
      .catch(() => console.warn("No user session found"));
  }, [universityId, professorId]);

  const handleDelete = async (reviewId) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("Failed to delete review");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userId === professorId) {
      setError("You cannot review your own profile.");
      return;
    }
    const userReviews = reviews.filter((r) => r.userId === userId);
    if (userReviews.length >= 2) {
      setError("You can only post up to 2 reviews.");
      return;
    }

    try {
      const res = await axiosInstance.post("/reviews", {
        professorId,
        userId,
        rating: Number(rating),
        comment,
      });
      setRating(5);
      setComment("");
      setReviews((prev) => [...prev, res.data]);
    } catch (err) {
      setError("Failed to submit review");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/reviews/${editingReviewId}`, {
        rating: Number(editRating),
        comment: editComment,
      });
      setReviews((prev) =>
        prev.map((r) =>
          r._id === editingReviewId ? { ...r, rating: editRating, comment: editComment } : r
        )
      );
      setEditingReviewId(null);
      setEditRating(5);
      setEditComment("");
    } catch {
      setError("Failed to edit review");
    }
  };

  if (!professor) return <p className="p-4 text-gray-500">Professor not found</p>;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const isProfessor = userId === professorId;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold">{professor.name}</h2>
      <p className="text-gray-600 mb-1">{professor.department}</p>
      {averageRating && (
        <p className="text-yellow-600 mb-4 font-medium">
          ⭐ Average Rating: {averageRating} / 5
        </p>
      )}

      {/* Reviews */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Submit a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="border p-2 rounded">
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <textarea
          className="w-full border p-2 rounded"
          value={comment}
          placeholder="Write your comment..."
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      <h3 className="text-xl font-semibold mt-8 mb-2">Reviews</h3>
      <ul className="space-y-4">
        {reviews.map((rev) => (
          <li key={rev._id} className="border p-3 rounded bg-gray-50">
            <p className="font-semibold text-yellow-700">⭐ {rev.rating} / 5</p>
            {editingReviewId === rev._id ? (
              <form onSubmit={handleEditSubmit} className="space-y-2 mt-2">
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value)}
                  className="border p-1 rounded"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <textarea
                  className="w-full border p-1 rounded"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="text-green-600 hover:underline text-sm">Save</button>
                  <button type="button" onClick={() => setEditingReviewId(null)} className="text-gray-500 hover:underline text-sm">Cancel</button>
                </div>
              </form>
            ) : (
              <p>{rev.comment}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {rev.userName ? rev.userName + " • " : ""}
              {new Date(rev.createdAt).toLocaleDateString()}
            </p>
            {rev.userId === userId && (
              <div className="mt-2 flex gap-4">
                <button onClick={() => handleDelete(rev._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                <button onClick={() => {
                  setEditingReviewId(rev._id);
                  setEditRating(rev.rating);
                  setEditComment(rev.comment);
                }} className="text-blue-500 hover:underline text-sm">Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Courses taught by this professor */}
      <h3 className="text-xl font-semibold mt-8 mb-2">Courses Taught by {professor.name}</h3>
      <ul className="space-y-4 mb-4">
        {professorCourses.map((course) => (
          <li key={course._id} className="border p-3 rounded bg-gray-100">
            <h4 className="font-semibold">{course.title}</h4>
            <p className="text-sm text-gray-700">{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfessorDetailPage;