import React, { useState, useEffect } from "react";

import { getForums, createForum } from "../../services/forumServices";
import { useParams } from "react-router-dom";

import ForumThread from "./ForumThread";
import NewThreadForm from "./NewThreadForm";

export default function ForumPage({ currentUser }) {
  const { universityId } = useParams();

  const [forums, setForums] = useState([]);

  useEffect(() => {
    getForums(universityId).then(setForums);
  }, [universityId]);

  const handleNewThread = async (title, tags) => {
    let _id = "userId1"; // hardcoded for testing ( Will be replaced with the actual userId the user who is logged In)

    const newForum = await createForum({
      title,
      universityId,
      tags,
      createdBy: _id,
      createdAt: new Date().toISOString(),
    });

    setForums((prev) => [newForum, ...prev]);
  };

  return (
    <div>
      <h2>Forum</h2>
      <NewThreadForm onSubmit={handleNewThread} />
      <div>
        {forums.map(
          (forum) => (
            console.log("forum", forum),
            (
              <ForumThread
                key={forum._id}
                forum={forum}
                currentUser={currentUser}
              />
            )
          )
        )}
      </div>
    </div>
  );
}
