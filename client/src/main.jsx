import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./styles.css";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

const demoIssues = [
  { title: "Design authentication flow", status: "DONE", priority: "HIGH", project: "DevTrack" },
  { title: "Create issue dashboard", status: "IN_PROGRESS", priority: "MEDIUM", project: "DevTrack" },
  { title: "Add Docker deployment", status: "TESTING", priority: "CRITICAL", project: "DevOps" },
  { title: "Write API tests", status: "TODO", priority: "LOW", project: "DevTrack" }
];

function App() {
  const [health, setHealth] = useState("Checking");
  const [issues, setIssues] = useState(demoIssues);

  useEffect(() => {
    api.get("/health")
      .then(() => setHealth("Online"))
      .catch(() => setHealth("Offline"));
  }, []);

  return (
    <div className="app">
      <aside>
        <div className="logo">Dev<span>Track</span></div>
        <nav>
          <a className="active">Dashboard</a>
          <a>Projects</a>
          <a>Issues</a>
          <a>Team</a>
          <a>Reports</a>
        </nav>
        <div className="deploy">
          <small>CI/CD STATUS</small>
          <strong><i /> Jenkins pipeline ready</strong>
          <p>GitHub → Jenkins → Docker</p>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <p className="eyebrow">PROJECT WORKSPACE</p>
            <h1>Good morning, Developer 👋</h1>
          </div>
          <div className="header-right">
            <span className={health === "Online" ? "online" : "offline"}>● API {health}</span>
            <div className="avatar">D</div>
          </div>
        </header>

        <section className="stats">
          <div><span>Total issues</span><b>24</b><small>↑ 12% this week</small></div>
          <div><span>In progress</span><b>8</b><small>Across 4 projects</small></div>
          <div><span>Completed</span><b>11</b><small>46% completion</small></div>
          <div><span>Critical</span><b>2</b><small>Needs attention</small></div>
        </section>

        <section className="content">
          <div className="panel issues">
            <div className="panel-head">
              <div><p className="eyebrow">WORK QUEUE</p><h2>Recent issues</h2></div>
              <button>+ New issue</button>
            </div>
            <div className="table">
              <div className="row head"><span>Issue</span><span>Status</span><span>Priority</span><span>Project</span></div>
              {issues.map((issue, i) => (
                <div className="row" key={i}>
                  <strong>{issue.title}</strong>
                  <span className={`badge ${issue.status.toLowerCase()}`}>{issue.status.replace("_", " ")}</span>
                  <span className={`priority ${issue.priority.toLowerCase()}`}>{issue.priority}</span>
                  <span>{issue.project}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <p className="eyebrow">PIPELINE</p>
            <h2>Deployment</h2>
            <div className="pipeline">
              {["Git push", "Jenkins", "Tests", "Docker", "Deploy"].map((x, i) => (
                <div className="step" key={x}><span>{i + 1}</span><b>{x}</b><small>{i < 4 ? "Ready" : "Live"}</small></div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
