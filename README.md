# K8s Task Manager

A full-stack task management application built as a DevOps learning project.

The application currently includes a frontend interface, a Node.js/Express REST API, a MySQL database, Docker containers, Docker Compose orchestration, and persistent database storage.

The next stages of the project will focus on Kubernetes deployment, CI/CD automation, and monitoring with Prometheus and Grafana.

---

## Project Goal

The main goal of **K8s Task Manager** is to build a complete application and progressively transform it into a modern DevOps project.

The project is designed to practice:

* Full-stack application development
* REST API development
* MySQL database integration
* Docker containerization
* Docker Compose orchestration
* Persistent storage
* Kubernetes orchestration
* CI/CD pipelines
* Application monitoring

The final objective is to deploy and manage the application using Kubernetes while implementing DevOps best practices.

---

## Features

The application provides a simple task management system.

### CRUD Operations

Users can perform the four main CRUD operations.

#### Create

Create a new task.

Example:

```text
Learn Kubernetes
```

#### Read

Display all existing tasks.

#### Update

Modify:

* The task title
* The task completion status

#### Delete

Delete an existing task.

---

## Current Features

* Add a task
* Display all tasks
* Edit a task
* Mark a task as completed
* Reactivate a completed task
* Delete a task
* Task validation
* MySQL database storage
* Persistent database data
* REST API
* Dockerized frontend
* Dockerized backend
* Dockerized MySQL database
* Docker Compose orchestration
* Responsive task management interface

---

# Architecture

The current application architecture is:

```text
                User
                  |
                  v
        +-------------------+
        |     Frontend      |
        | HTML / CSS / JS   |
        +-------------------+
                  |
                  | HTTP / REST API
                  v
        +-------------------+
        |      Backend      |
        | Node.js / Express |
        +-------------------+
                  |
                  | SQL
                  v
        +-------------------+
        |       MySQL       |
        |     Database      |
        +-------------------+
                  |
                  v
        +-------------------+
        |   Docker Volume   |
        | Persistent Data   |
        +-------------------+
```

---

## Docker Architecture

The application is currently orchestrated using Docker Compose.

```text
Docker Compose
│
├── Frontend Container
│
├── Backend Container
│   └── Node.js / Express
│
├── MySQL Container
│
└── MySQL Volume
    └── Persistent Database Data
```

The containers communicate through the Docker network created automatically by Docker Compose.

---

# Technologies Used

## Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

## Backend

* Node.js
* Express.js
* REST API
* CORS

## Database

* MySQL
* mysql2

## DevOps

* Docker
* Docker Compose
* Docker Volumes
* Git
* GitHub

## Planned Technologies

The following technologies will be added during the next stages of the project:

* Kubernetes
* Minikube
* kubectl
* ConfigMap
* Kubernetes Secrets
* PersistentVolume
* PersistentVolumeClaim
* GitHub Actions
* Prometheus
* Grafana

---

# Project Structure

```text
k8s-task-manager/
│
├── backend/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

# Backend API

The backend runs on:

```text
http://localhost:3000
```

The main API endpoint is:

```text
http://localhost:3000/api/tasks
```

---

# API Endpoints

| Method | Endpoint         | Description               |
| ------ | ---------------- | ------------------------- |
| GET    | `/`              | Test backend availability |
| GET    | `/api/tasks`     | Get all tasks             |
| GET    | `/api/tasks/:id` | Get one task              |
| POST   | `/api/tasks`     | Create a task             |
| PUT    | `/api/tasks/:id` | Update a task             |
| DELETE | `/api/tasks/:id` | Delete a task             |

---

## GET All Tasks

```http
GET /api/tasks
```

Example:

```bash
curl http://localhost:3000/api/tasks
```

Example response:

```json
[
  {
    "id": 1,
    "title": "Apprendre Docker",
    "completed": 1
  },
  {
    "id": 2,
    "title": "Apprendre Kubernetes",
    "completed": 0
  }
]
```

---

## GET Task by ID

```http
GET /api/tasks/:id
```

Example:

```bash
curl http://localhost:3000/api/tasks/1
```

---

## Create a Task

```http
POST /api/tasks
```

Example:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Kubernetes"}'
```

Example response:

```json
{
  "id": 3,
  "title": "Learn Kubernetes",
  "completed": 0
}
```

---

## Update a Task

```http
PUT /api/tasks/:id
```

Example:

```bash
curl -X PUT http://localhost:3000/api/tasks/3 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

The task title can also be changed:

```bash
curl -X PUT http://localhost:3000/api/tasks/3 \
  -H "Content-Type: application/json" \
  -d '{"title":"Master Kubernetes"}'
```

---

## Delete a Task

```http
DELETE /api/tasks/:id
```

Example:

```bash
curl -X DELETE http://localhost:3000/api/tasks/3
```

Successful deletion returns:

```text
204 No Content
```

---

# Database

The application uses a MySQL database.

The main table is:

```text
tasks
```

Structure:

```text
tasks
│
├── id
├── title
├── completed
└── created_at
```

The backend automatically creates the table if it does not already exist.

---

# Database Persistence

MySQL data is stored using a Docker Volume.

This means that stopping or recreating the MySQL container does not automatically delete the application data.

Architecture:

```text
MySQL Container
      |
      v
Docker Volume
      |
      v
Persistent Data
```

---

# Environment Variables

The backend configuration can use environment variables.

Example:

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=tasks_user
DB_PASSWORD=change_me
DB_NAME=tasks_db

PORT=3000
```

A template is available in:

```text
.env.example
```

Create your local environment file with:

```bash
cp .env.example .env
```

Never commit the real `.env` file to GitHub.

---

# Running the Project with Docker Compose

## 1. Clone the repository

```bash
git clone https://github.com/dazibfh/k8s-task-manager.git
```

Enter the project:

```bash
cd k8s-task-manager
```

---

## 2. Create the environment file

```bash
cp .env.example .env
```

Modify the values if necessary.

---

## 3. Build and start the application

```bash
docker compose up --build -d
```

---

## 4. Check the containers

```bash
docker compose ps
```

The containers should be running.

---

## 5. Test the backend

```bash
curl http://localhost:3000/
```

Expected response:

```json
{
  "message": "K8s Task Manager Backend fonctionne !"
}
```

---

## 6. Test the API

```bash
curl http://localhost:3000/api/tasks
```

---

## 7. View the logs

Backend logs:

```bash
docker compose logs backend
```

Follow logs in real time:

```bash
docker compose logs -f
```

---

## 8. Stop the application

```bash
docker compose down
```

---

## Rebuild the Application

After modifying the source code:

```bash
docker compose down
```

Then:

```bash
docker compose up --build -d
```

---

# Useful Docker Commands

Display running containers:

```bash
docker ps
```

Display Docker Compose services:

```bash
docker compose ps
```

Display logs:

```bash
docker compose logs
```

Display backend logs:

```bash
docker compose logs backend
```

Stop the project:

```bash
docker compose down
```

Rebuild containers:

```bash
docker compose up --build -d
```

Display Docker images:

```bash
docker images
```

Display Docker volumes:

```bash
docker volume ls
```

---

# Roadmap

## Completed

* [x] Node.js backend
* [x] Express REST API
* [x] Frontend interface
* [x] MySQL database
* [x] CRUD operations
* [x] Docker
* [x] Docker Compose
* [x] Persistent MySQL Volume
* [x] Git
* [x] GitHub

---

## Kubernetes

Next, the application will be migrated from Docker Compose to Kubernetes.

Planned architecture:

```text
                     Kubernetes Cluster
                             |
          +------------------+------------------+
          |                  |                  |
          v                  v                  v
   Frontend Pod        Backend Pod         MySQL Pod
          |                  |                  |
          v                  v                  v
 Frontend Service     Backend Service      MySQL Service
                                                |
                                                v
                                      Persistent Volume
```

Planned Kubernetes components:

* Deployment
* Service
* ConfigMap
* Secret
* PersistentVolume
* PersistentVolumeClaim
* Minikube
* kubectl

---

## Kubernetes Self-Healing

The project will demonstrate Kubernetes self-healing.

Example:

```text
Desired backend replicas: 1

Backend Pod
     |
     X
 Pod deleted
     |
     v
Kubernetes detects the missing Pod
     |
     v
New Backend Pod created automatically
```

---

## Kubernetes Scaling

The backend will also be tested with multiple replicas.

Example:

```bash
kubectl scale deployment backend --replicas=3
```

Architecture:

```text
Backend Service
      |
  +---+---+
  |   |   |
  v   v   v
Pod  Pod  Pod
```

---

# CI/CD Roadmap

GitHub Actions will be added to automate the development workflow.

Planned pipeline:

```text
Developer
    |
    v
Git Push
    |
    v
GitHub
    |
    v
GitHub Actions
    |
    +----> Install dependencies
    |
    +----> Check JavaScript syntax
    |
    +----> Run tests
    |
    +----> Build Docker images
    |
    +----> Push Docker images
    |
    +----> Deploy application
```

Planned workflow file:

```text
.github/
└── workflows/
    └── ci.yml
```

---

# Monitoring Roadmap

Prometheus and Grafana will be added after the Kubernetes deployment.

Architecture:

```text
Kubernetes Application
        |
        v
    Prometheus
        |
        v
      Metrics
        |
        v
     Grafana
        |
        v
    Dashboards
```

The monitoring system will be used to observe metrics such as:

* CPU usage
* Memory usage
* Pod status
* Application availability
* HTTP requests
* Backend performance
* Application errors

---

# Final DevOps Architecture

The final objective of the project is:

```text
                      GitHub
                         |
                         v
                  GitHub Actions
                         |
                         v
                    CI / CD
                         |
                         v
                Kubernetes Cluster
                         |
        +----------------+----------------+
        |                |                |
        v                v                v
    Frontend          Backend           MySQL
        |                |                |
        |                |                v
        |                |        Persistent Volume
        |                |
        +----------------+
                         |
                         v
                    Prometheus
                         |
                         v
                      Grafana
```

---

# Learning Objectives

This project is designed to demonstrate knowledge of:

* REST APIs
* Full-stack development
* Database integration
* Containerization
* Docker networking
* Docker volumes
* Multi-container applications
* Kubernetes orchestration
* Kubernetes services
* Persistent storage
* Configuration management
* Secret management
* CI/CD
* Monitoring
* DevOps workflows

---

# Project Status

Current status:

```text
Backend             ✅
Frontend            ✅
CRUD                ✅
MySQL               ✅
Docker              ✅
Docker Compose      ✅
Persistent Volume   ✅
Git / GitHub        ✅

Kubernetes          🔄 Next
CI/CD               ⏳ Planned
Monitoring          ⏳ Planned
```

---

# Author

**dazibfh**

GitHub:

```text
https://github.com/dazibfh
```

---

## License

This project was created for learning, experimentation, and portfolio purposes.
