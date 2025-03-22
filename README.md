# Spark Flarion Test Assignment
This project is a full-stack application for displaying Spark job statistics. The frontend is a React application built with TypeScript, while the backend is a Node.js Express server that reads job data from Parquet files. The app is containerized using Docker and includes automated tests for both frontend and backend.

## Project Structure

spark_flarion_testassignment/
├── frontend/           # React/TypeScript frontend
│   ├── src/           # Source files
│   ├── Dockerfile     # Docker configuration
│   └── package.json   # Dependencies and scripts
├── backend/           # Node.js/TypeScript backend
│   ├── src/           # Source files (e.g., index.ts)
│   ├── spark_logs/    # Directory for generated Parquet files
│   ├── Dockerfile     # Docker configuration
│   └── package.json   # Dependencies and scripts
├── docker-compose.yml  # Docker Compose configuration
└── README.md          # Project documentation

## Features
- Frontend: A React app that allows users to input a Spark job ID and displays job details (duration, executors, shuffle stats, etc.) fetched from the backend.
- Backend: A Node.js Express server that reads job data from Parquet files in spark_logs/ and serves it via a REST API.
- Data Generation: Synthetic Spark job data is generated on each request using generateSynthData.
- Containerization: Dockerized frontend and backend with Docker Compose for easy deployment.
- Testing: Unit tests for both frontend (Jest/React Testing Library) and backend (Jest/Supertest).

## Prerequisites
Node.js: v18.x (LTS recommended)
Docker: Latest version with Docker Compose
npm: Comes with Node.js

## Setup
Clone the Repository
git clone <repository-url>
cd spark_flarion_testassignment
Install Dependencies

## Frontend
cd frontend
npm install

## Backend
cd backend
npm install
Running Locally

## Frontend
cd frontend
npm start
Opens at http://localhost:3000.

## Backend
cd backend
npm start
Runs at http://localhost:8000.

## Running with Docker
Ensure Docker is running.
Build and start containers:
cd spark_flarion_testassignment
docker-compose up --build
Frontend: http://localhost:3001
Backend: http://localhost:8000

## Stop containers:
docker-compose down

## Persisting Parquet Files
The spark_logs/ directory is mounted as a volume (./backend/spark_logs:/app/spark_logs) to persist generated Parquet files across container restarts.

## Usage
Open the frontend in a browser (http://localhost:3001 with Docker, or http://localhost:3000 locally).
Enter a job ID (e.g., job_001) in the input field and click "Submit."
View the job details fetched from the backend, including total duration, shuffle statistics, and stage information.
API Endpoints
GET /api/spark_jobs/:job_id:
Description: Fetches Spark job data for the given job_id.
Response:
Success (200): JSON object with job details (see SparkJob type).
Not Found (404): { "error": "Job not found" } or { "error": "No data found for the job" }.
Error (500): { "error": "<error message>" }.

## Testing

## Frontend Tests
cd frontend
npm test
Uses Jest and React Testing Library to test the UI and component interactions.

## Backend Tests
cd backend
npm test
Uses Jest and Supertest to test the /api/spark_jobs/:job_id endpoint with mocked Parquet and file system interactions.

## Dockerfiles

## Frontend
Base: node:18 (build) and node:18-slim (runtime).
Build: Compiles React app with npm run build.
Serve: Uses serve@14.2.3 to host static files on port 3031.

## Backend
Base: node:18.
Run: Uses ts-node to execute src/index.ts directly on port 8000.
Volume: Mounts spark_logs/ for Parquet file storage.

## Project Details
## Frontend
Tech: React, TypeScript, react-scripts.
Structure:
src/App.tsx: Main app component with job ID input and JobDashboard.
src/components/JobDashboard.tsx: Displays job details.
src/__tests__/: Unit tests.

## Backend
Tech: Node.js, Express, TypeScript, parquetjs.
Structure:
src/index.ts: Express server setup and route registration.
src/data/generateSyntData.ts: Generates synthetic Parquet files.
src/types/types.ts: Type definitions (e.g., SparkJob).
__tests__/getSparkJob.test.ts: Unit tests.

## Types
interface SparkJob {
job_id: string;
total_duration: number;
stages: Array<{ stage_id: string; duration: number; tasks: Array<any> }>;
shuffle_stats: { total_shuffle_read_mb: number; total_shuffle_write_mb: number };
errors: string | null;
num_executors: number;
}

interface Task {
task_id: string;
duration: number;
shuffle_read_mb: number;
shuffle_write_mb: number;
}

interface Stage {
stage_id: string;
duration: number;
tasks: Task[];
}

interface ShuffleStats {
total_shuffle_read_mb: number;
total_shuffle_write_mb: number;
}

interface ParquetRow {
job_id: string;
total_duration: number;
stages: string; 
shuffle_stats: string; 
errors?: string; 
num_executors: number;
[key: string]: string | number | undefined;
}

## Troubleshooting

Backend fails with "Cannot find module":
Ensure src/index.ts exists and matches the CMD in the Dockerfile.
Verify ts-node is installed (npm install --save ts-node).

Frontend fails with ArgError:
Check serve version; use nginx as an alternative if issues persist.
Parquet files not found:
Ensure spark_logs/ is writable locally or mounted correctly in Docker.

## Contributing
Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit changes (git commit -m "Add feature").
Push to the branch (git push origin feature-name).
Open a pull request.

## Notes
Paths: Adjust <repository-url> and file paths (e.g., src/index.ts) if your structure differs slightly.
Customization: Add sections like "Deployment" or "Environment Variables" if you plan to extend the setup (e.g., with a production server or config).
Run Locally: If your generateSynthData requires specific setup (e.g., pre-generating files), add those instructions.
