import { useEffect, useState } from "react";
import api from "../api";
import TaskModal from "./TaskModal";
import CreateTask from "./CreateTask";

export interface Task {
  ID: number;
  title: string;
  status: "To Do" | "In Progress" | "Done";
}

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const statuses: Task["status"][] = ["To Do", "In Progress", "Done"];

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const moveTask = async (task: Task, direction: "left" | "right") => {
    const currentIndex = statuses.indexOf(task.status);
    const newIndex =
      direction === "right" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < statuses.length) {
      await api.put(`/tasks/${task.ID}`, {
        title: task.title,
        status: statuses[newIndex],
      });
      fetchTasks();
    }
  };

  return (
    <div className="container">
      <CreateTask onRefresh={fetchTasks} />

      <div className="board">
        {statuses.map((status) => (
          <div key={status} className="column">
            <h3>{status}</h3>

            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <div key={task.ID} className="task-card">
                  {status !== "To Do" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task, "left");
                      }}
                    >
                      &larr;
                    </button>
                  )}

                  <div
                    className="task-text"
                    onClick={() => setSelectedTask(task)}
                  >
                    {task.title.length > 20
                      ? task.title.substring(0, 20) + "..."
                      : task.title}
                  </div>

                  {status !== "Done" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task, "right");
                      }}
                    >
                      &rarr;
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onRefresh={fetchTasks}
        />
      )}
    </div>
  );
};

export default TaskBoard;
