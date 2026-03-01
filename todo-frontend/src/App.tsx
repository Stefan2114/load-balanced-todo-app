import { useState } from "react";
import Auth from "./components/Auth";
import "./App.css";
import TaskBoard from "./components/TaskBoard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="App">
      <header>
        <h1>My Todo List</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Logout
        </button>
      </header>
      <TaskBoard />
    </div>
  );
}

export default App;
