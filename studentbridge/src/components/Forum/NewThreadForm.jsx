import React, { useState } from "react";

export default function NewThreadForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !tags) return;
    onSubmit(
      title,
      tags.split(",").map((tag) => tag.trim())
    );
    setTitle("");
    setTags("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Thread Title"
        required
      />
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />
      <button type="submit">Post Thread</button>
    </form>
  );
}
