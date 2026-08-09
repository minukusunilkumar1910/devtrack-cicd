# DevTrack — CI/CD

DevTrack is a full-stack project and issue management platform built as a portfolio project for demonstrating a real GitHub → Jenkins → Docker → AWS CI/CD pipeline.

## Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Vitest + Supertest
- Docker + Docker Compose
- Nginx
- Jenkins

## Features
- User registration/login
- JWT authentication
- Projects
- Issues with status and priority
- Dashboard statistics
- Search/filter issues
- Dockerized frontend/backend/database
- Automated backend tests
- Jenkins CI/CD pipeline
- Health-check deployment

## Structure
```text
devtrack/
├── client/
├── server/
├── nginx/
├── docker-compose.yml
├── Jenkinsfile
├── .env.example
└── README.md
```

## Run locally with Docker

```bash
cp .env.example .env
docker compose up --build
```

Open `http://localhost`.

API health: `http://localhost/api/health`

## Run backend tests

```bash
cd server
npm install
npm test
```

## Jenkins

Create a Pipeline job using this repository and `Jenkinsfile`.

Recommended Jenkins plugins:
- Pipeline
- Git
- GitHub
- Docker Pipeline
- Credentials Binding

Allow Jenkins to access Docker:

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
sudo -u jenkins docker ps
```

For GitHub webhook:

```text
http://YOUR_EC2_PUBLIC_IP:8080/github-webhook/
```

Trigger: push events.

## Pipeline

```text
GitHub
  ↓ webhook
Jenkins
  ↓
Checkout
  ↓
Backend tests
  ↓
Frontend build
  ↓
Docker build
  ↓
Docker Compose deploy
  ↓
Health check
  ↓
Live application
```

## EC2 ports

For a demo deployment:
- 22 SSH
- 80 application
- 8080 Jenkins

Do not expose MongoDB 27017 publicly.
