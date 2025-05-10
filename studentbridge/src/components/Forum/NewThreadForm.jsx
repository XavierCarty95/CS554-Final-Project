// src/components/Forum/NewThreadForm.jsx
import React, { useState } from "react";

// Predefined list of tags that users can choose from
const AVAILABLE_TAGS = [
  "Academics",
  "Advice",
  "Campus Life",
  "Courses",
  "Events",
  "Financial Aid",
  "Housing",
  "Internships",
  "Jobs",
  "Professors",
  "Research",
  "Social",
  "Sports",
  "Study Abroad",
  "Technology",
  "Textbooks",
];

export default function NewThreadForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    console.log(
      "Creating new thread with title:",
      title,
      "and tags:",
      selectedTags
    );

    onSubmit(title, selectedTags);
    setTitle("");
    setSelectedTags([]);
    setSearchTerm("");
    setIsExpanded(false);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredTags = AVAILABLE_TAGS.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
      >
        + Start a New Discussion
      </button>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Create a New Thread</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Thread Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="What would you like to discuss?"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags (select up to 5)
          </label>

          {/* Search box for tags */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
            placeholder="Search for tags..."
          />

          {/* Selected tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Available tags */}
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {filteredTags.map((tag) => (
                <div
                  key={tag}
                  onClick={() => {
                    if (selectedTags.length < 5 || selectedTags.includes(tag)) {
                      toggleTag(tag);
                    }
                  }}
                  className={`
                    px-3 py-1 rounded text-sm cursor-pointer transition-colors
                    ${
                      selectedTags.includes(tag)
                        ? "bg-blue-500 text-white"
                        : selectedTags.length >= 5
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {tag}
                </div>
              ))}

              {filteredTags.length === 0 && (
                <div className="col-span-full text-center py-2 text-gray-500">
                  No matching tags found
                </div>
              )}
            </div>
          </div>

          {selectedTags.length >= 5 && (
            <p className="text-xs text-orange-500 mt-1">
              Maximum of 5 tags reached
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Thread
          </button>
        </div>
      </form>
    </div>
  );
}
