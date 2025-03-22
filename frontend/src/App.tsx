import React, {useState} from "react";
import { JobDashboard } from "./components/JobDashboard";
import './styles/App.css';

const App:React.FC = () => {
    const [jobId, setJobId] = useState('job_001');
    const [submittedJobId, setSubmittedJobId] = useState('job_001');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page refresh
        setSubmittedJobId(jobId); // Update the submitted job ID
    };

    return (
        <div className="App">
            <h1>Spark Job Dashboard</h1>
            <div className="job-input-container">
                <input
                    type="text"
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    placeholder="Enter Job ID (e.g., job_001 to job_005)"
                    className="job-input"
                />
                <button type="button" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
            <JobDashboard jobId={submittedJobId} />
        </div>
    );
}

export default App;