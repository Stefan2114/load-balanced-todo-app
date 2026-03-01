import { useState } from "react";
import api from "../api";
import type { Task } from "./TaskBoard";

interface Props {
  task: Task;
  onClose: () => void;
  onRefresh: () => void;
}

const TaskModal = ({ task, onClose, onRefresh }: Props) => {
  const [title, setTitle] = useState(task.title);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (title.length < 3 || title.length > 100) {
      return setError("Title must be between 3 and 100 characters");
    }
    await api.put(`/tasks/${task.ID}`, { title: title, status: task.status });
    onRefresh();
    onClose();
  };

  const handleDelete = async () => {
    await api.delete(`/tasks/${task.ID}`);
    onRefresh();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Task</h3>
        {error && <p className="error">{error}</p>}
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={4}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button onClick={handleSave}>Save</button>
          <button
            onClick={handleDelete}
            style={{ background: "red", color: "white" }}
          >
            Delete
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
