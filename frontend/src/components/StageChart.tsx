import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {SparkJob} from "../types/sparkJob";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
    jobData: SparkJob
}

export const StageChart: React.FC<Props> = ({jobData}) => {
    const labels = jobData.stages.map(stage => stage.stage_id);
    const durations = jobData.stages.map(stage => stage.duration);
    const data ={
        labels,
        datasets: [
            {
                label: 'Stage Duration (s)',
                data: durations,
                backgroundColor: '#36A2EB',
            }
        ]
    };

    return (
        <Bar
            data={data}
            options={{
                responsive: true,
                plugins: { title: { display: true, text: 'Stage Execution Times' } },
            }}
        />
    );
}