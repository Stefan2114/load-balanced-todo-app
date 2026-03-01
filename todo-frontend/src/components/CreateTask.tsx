import React, { useState } from "react";
import api from "../api";

const CreateTask = ({ onRefresh }: { onRefresh: () => void }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 3 || title.length > 100) {
      return setError("Title must be 3-100 characters");
    }

    try {
      // Default status is 'To Do' as required by your Go model
      await api.post("/tasks", { title, status: "To Do" });
      setTitle("");
      setError("");
      onRefresh(); // Refresh the board
    } catch (err) {
      setError("Failed to create task");
    }
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "10px",
        border: "1px solid #ccc",
      }}
    >
      <form onSubmit={handleAdd}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title..."
        />
        <button type="submit">Add Task</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default CreateTask;
