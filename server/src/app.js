import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Project, Issue } from "./models.js";

const app = express();
app.use(cors());
app.use(express.json());

const secret = () => process.env.JWT_SECRET || "dev-secret";

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    req.user = jwt.verify(header.slice(7), secret());
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "devtrack-api" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({ message: "Name, email and 6+ character password are required" });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      name, email, password: await bcrypt.hash(password, 10)
    });

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, secret(), { expiresIn: "1d" });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch {
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, secret(), { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/api/projects", auth, async (req, res) => {
  const projects = await Project.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(projects);
});

app.post("/api/projects", auth, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Project name is required" });
  const project = await Project.create({ name, description, owner: req.user.id });
  res.status(201).json(project);
});

app.get("/api/issues", auth, async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  const issues = await Issue.find(filter)
    .populate("project", "name")
    .populate("assignee", "name")
    .sort({ createdAt: -1 });
  res.json(issues);
});

app.post("/api/issues", auth, async (req, res) => {
  const { title, description, project, priority, assignee } = req.body;
  if (!title || !project)
    return res.status(400).json({ message: "Title and project are required" });

  const issue = await Issue.create({
    title, description, project, priority, assignee, createdBy: req.user.id
  });
  res.status(201).json(issue);
});

app.patch("/api/issues/:id", auth, async (req, res) => {
  const allowed = ["title", "description", "status", "priority", "assignee"];
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const issue = await Issue.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!issue) return res.status(404).json({ message: "Issue not found" });
  res.json(issue);
});

app.get("/api/dashboard", auth, async (_req, res) => {
  const [total, todo, progress, testing, done] = await Promise.all([
    Issue.countDocuments(),
    Issue.countDocuments({ status: "TODO" }),
    Issue.countDocuments({ status: "IN_PROGRESS" }),
    Issue.countDocuments({ status: "TESTING" }),
    Issue.countDocuments({ status: "DONE" })
  ]);
  res.json({ total, todo, progress, testing, done });
});

export default app;
