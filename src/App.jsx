
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://student-task-manager-qe6n.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    deadline: "",
    status: "Pending",
  });

  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

  const fetchTasks = () => {
    fetch("https://student-task-manager-qe6n.onrender.com/api/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://student-task-manager-qe6n.onrender.com/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      alert("Task added successfully!");

      setFormData({
        title: "",
        subject: "",
        description: "",
        deadline: "",
        status: "Pending",
      });

      setShowForm(false);
      fetchTasks();
    } catch (error) {
      alert(error.message);
    }
  };

// PASTE handleDelete HERE
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `https://student-task-manager-qe6n.onrender.com/api/tasks/${id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    fetchTasks();
  } catch (error) {
    alert(error.message);
  }
};


const handleEdit = async (task) => {
  const updatedTitle = prompt("Enter new title:", task.title);
  if (updatedTitle === null) return;

  const updatedSubject = prompt("Enter new subject:", task.subject);
  if (updatedSubject === null) return;

  const updatedDescription = prompt(
    "Enter new description:",
    task.description
  );
  if (updatedDescription === null) return;

  const updatedDeadline = prompt(
    "Enter new deadline (YYYY-MM-DD):",
    task.deadline.slice(0, 10)
  );
  if (updatedDeadline === null) return;

  const updatedStatus = prompt(
    "Enter status (Pending, In Progress, Completed):",
    task.status
  );
  if (updatedStatus === null) return;

  try {
    const response = await fetch(
      `https://student-task-manager-qe6n.onrender.com/api/tasks/${task._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedTitle,
          subject: updatedSubject,
          description: updatedDescription,
          deadline: updatedDeadline,
          status: updatedStatus,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    alert("Task updated successfully!");
    fetchTasks();
  } catch (error) {
    alert(error.message);
  }
};


// Your existing totalTasks, pendingTasks, completedTasks code

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const filteredTasks = tasks.filter((task) => {
  const matchesSearch =
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.subject.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" || task.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>TaskFlow</h1>
          <p>Student Task & Assignment Manager</p>
        </div>

        <button
          className="add-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Add New Task
        </button>
      </header>

      <main className="dashboard">
        <h2>Dashboard</h2>
        <p className="subtitle">Keep track of your academic work.</p>

        <section className="stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>{totalTasks}</p>
          </div>

          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <p>{pendingTasks}</p>
          </div>

          <div className="stat-card">
            <h3>Completed Tasks</h3>
            <p>{completedTasks}</p>
          </div>
        </section>

        {showForm && (
          <section className="form-section">
            <h2>Add New Task</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Task Description"
                value={formData.description}
                onChange={handleChange}
              />

              <label>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />

              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <button type="submit" className="add-button">
                Save Task
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </section>
        )}

        <section className="tasks-section">
          <h2>Your Tasks</h2>


<div className="filter-container">
  <input
    type="text"
    placeholder="Search by task title or subject..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>
</div>


          {filteredTasks.length === 0 ? (
            <p>No matching tasks found.</p>
          ) : (
            filteredTasks.map((task) => (
              <div className="task-card" key={task._id}>
                <h3>{task.title}</h3>
                <p>{task.subject}</p>
                <p>{task.description}</p>
                <p>Deadline: {task.deadline.slice(0, 10)}</p>
                <span>{task.status}</span>
                <button
  className="edit-button"
  onClick={() => handleEdit(task)}
>
  Edit
</button>
                <button
  className="delete-button"
  onClick={() => handleDelete(task._id)}
>
  Delete
</button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
