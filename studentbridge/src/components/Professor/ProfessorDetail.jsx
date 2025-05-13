import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import Footer from "../Footer";

function ProfessorDetailPage() {
  // eslint-disable-next-line no-unused-vars
  const { universityId, professorId } = useParams();
  const [professor, setProfessor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [userName, setUserName] = useState("");
  const [university, setUniversity] = useState(null);
  const [averageRating, setAverageRating] = useState(null);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [professorCourses, setProfessorCourses] = useState([]);

  const calculateAverageRating = (reviewsArray) => {
    if (!reviewsArray || reviewsArray.length === 0) return null;
    return (
      reviewsArray.reduce((sum, r) => sum + r.rating, 0) / reviewsArray.length
    ).toFixed(1);
  };

  useEffect(() => {
    axiosInstance
      .get(`/professors/${professorId}`)
      .then((res) => {
        setProfessor(res.data);

        return axiosInstance.get(`/universities/${res.data.universityId}`);
      })
      .then((res) => {
        setUniversity(res.data);
      })
      .catch(() => setError("Failed to load professor data"));

    axiosInstance
      .get(`/courses/professor/${professorId}`)
      .then((res) => setProfessorCourses(res.data))
      .catch(() => console.warn("Could not load professor's courses"));

    axiosInstance
      .get(`/reviews/${professorId}`)
      .then((res) => {
        setReviews(res.data);
        setAverageRating(calculateAverageRating(res.data));
      })
      .catch(() => setError("Could not load reviews"));

    axiosInstance
      .get("/verify")
      .then((res) => {
        setUserId(res.data._id);
        setUserName(res.data.name);
      })
      .catch(() => console.warn("No user session found"));
  }, [professorId]);

  const handleDelete = async (reviewId) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      const updatedReviews = reviews.filter((r) => r._id !== reviewId);
      setReviews(updatedReviews);
      setAverageRating(calculateAverageRating(updatedReviews));
      // eslint-disable-next-line no-unused-vars
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
      const updatedReviews = [...reviews, res.data];
      setReviews(updatedReviews);
      setAverageRating(calculateAverageRating(updatedReviews));
      setRating(5);
      setComment("");
      // eslint-disable-next-line no-unused-vars
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
      const updatedReviews = reviews.map((r) =>
        r._id === editingReviewId
          ? { ...r, rating: Number(editRating), comment: editComment }
          : r
      );
      setReviews(updatedReviews);
      setAverageRating(calculateAverageRating(updatedReviews));
      setEditingReviewId(null);
      setEditRating(5);
      setEditComment("");
    } catch {
      setError("Failed to edit review");
    }
  };

  if (!professor)
    return (
      <p className="p-4 text-gray-500">Loading professor information...</p>
    );

  // eslint-disable-next-line no-unused-vars
  const isProfessor = userId === professorId;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-4">
        <div className="mb-4">
          <Link
            to={`/university/${professor.universityId}/professors`}
            className="text-blue-600 hover:underline flex items-center"
          >
            ← Back to Professors
          </Link>
        </div>

        <h2 className="text-2xl font-bold">{professor.name}</h2>
        <p className="text-gray-600 mb-1">{professor.department}</p>
        {university && (
          <p className="text-gray-600 mb-4">
            <Link
              to={`/university/${university._id}`}
              className="text-blue-600 hover:underline"
            >
              {university.name}
            </Link>
          </p>
        )}
        {averageRating && (
          <p className="text-yellow-600 mb-4 font-medium">
            ⭐ Average Rating: {averageRating} / 5
          </p>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-2">
          Courses Taught by {professor.name}
        </h3>
        {professorCourses.length === 0 ? (
          <p className="text-gray-500 italic">
            No courses assigned to this professor yet.
          </p>
        ) : (
          <ul className="space-y-4 mb-8">
            {professorCourses.map((course) => (
              <li key={course._id} className="border p-3 rounded bg-gray-100">
                <Link
                  to={`/courses/${course._id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {course.title}
                </Link>
                <p className="text-sm text-gray-700">{course.description}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Reviews */}
        <h3 className="text-xl font-semibold mt-6 mb-2">Submit a Review</h3>
        {userId ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center">
              <label className="mr-2">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border p-2 rounded"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} ⭐
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className="w-full border p-2 rounded"
              value={comment}
              placeholder="Write your comment..."
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Review
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        ) : (
          <p className="text-gray-500 italic">
            You must be logged in to submit a review.
          </p>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-2">
          Reviews ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((rev) => (
              <li key={rev._id} className="border p-3 rounded bg-gray-50">
                <p className="font-semibold text-yellow-700">
                  ⭐ {rev.rating} / 5
                </p>
                {editingReviewId === rev._id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-2 mt-2">
                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(e.target.value)}
                      className="border p-1 rounded"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} ⭐
                        </option>
                      ))}
                    </select>
                    <textarea
                      className="w-full border p-1 rounded"
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="text-green-600 hover:underline text-sm"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingReviewId(null)}
                        className="text-gray-500 hover:underline text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <p>{rev.comment}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {rev.userName ? (
                    <>
                      <Link
                        to={`/profile/${rev.userId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {rev.userName}
                      </Link>
                      {" • "}
                    </>
                  ) : (
                    ""
                  )}
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
                {rev.userId === userId && (
                  <div className="mt-2 flex gap-4">
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setEditingReviewId(rev._id);
                        setEditRating(rev.rating);
                        setEditComment(rev.comment);
                      }}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProfessorDetailPage;
