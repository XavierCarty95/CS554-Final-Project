
import React from "react";
import { Link } from "react-router-dom";

export default function SearchResults({ results }) {
  const { universities, professors, courses } = results;
  const hasResults =
    universities.length > 0 || professors.length > 0 || courses.length > 0;

  if (!hasResults) {
    return <p className="text-center text-gray-500 my-8">No results found</p>;
  }

  return (
    <div className="space-y-8">
      {universities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Universities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map((uni) => (
              <Link
                key={uni.id}
                to={`/university/${uni.id}`}
                className="block p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-blue-600">
                  {uni.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {professors.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Professors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professors.map((prof) => (
              <Link
                key={prof.id}
                to={`/university/${prof.universityId}/professors/${prof.id}`}
                className="block p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-blue-600">
                  {prof.name}
                </h3>
                <p className="text-gray-600">{prof.department}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {courses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="block p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-blue-600">
                  {course.title}
                </h3>
                <p className="text-gray-600 line-clamp-2">
                  {course.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
