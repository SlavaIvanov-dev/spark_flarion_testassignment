import React, {useState, useEffect} from "react";
import axios from "axios";
import {SparkJob} from "../types/sparkJob";
import {StageChart} from "./StageChart";

interface Props {
    jobId: string;
}


export const JobDashboard: React.FC<Props> = ({jobId}) => {
    const [jobData, setJobData] = useState<SparkJob | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/spark_jobs/${jobId}`);
                setJobData(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load job data');
                setJobData(null);
            }
        }
        (async () => {
            await fetchJobData();
        })();
    }, [jobId]);

    return (
        <div>
            {error && <p className="error-message">{error}</p>}
            {jobData && (
                <div className="job-details">
                    <h2>Job: {jobData.job_id}</h2>
                    <p>Total Duration: {jobData.total_duration}s</p>
                    <p>Executors: {jobData.num_executors}</p>
                    {jobData.errors && <p className="error-message">Error: {jobData.errors}</p>}
                    <h3>Shuffle Statistics</h3>
                    <p>Total Shuffle Read: {jobData.shuffle_stats.total_shuffle_read_mb} MB</p>
                    <p>Total Shuffle Write: {jobData.shuffle_stats.total_shuffle_write_mb} MB</p>
                    <h3>Stage Details</h3>
                    <div className="stage-list">
                        {jobData.stages.map(stage => (
                            <div key={stage.stage_id} className="stage-item">
                                <p>{stage.stage_id} - Duration: {stage.duration}s</p>
                                <ul>
                                    {stage.tasks.map(task => (
                                        <li key={task.task_id}>
                                            {task.task_id}: {task.duration}s, Shuffle Read: {task.shuffle_read_mb} MB, Shuffle Write: {task.shuffle_write_mb} MB
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="chart-container">
                        <StageChart jobData={jobData} />
                    </div>
                </div>
            )}
        </div>
    );
};