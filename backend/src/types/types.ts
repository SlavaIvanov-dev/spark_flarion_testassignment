import * as parquet from 'parquetjs';

export interface Task {
    task_id: string;
    duration: number;
    shuffle_read_mb: number;
    shuffle_write_mb: number;
}

export interface Stage {
    stage_id: string;
    duration: number;
    tasks: Task[];
}

export interface ShuffleStats {
    total_shuffle_read_mb: number;
    total_shuffle_write_mb: number;
}

export interface SparkJob {
    job_id: string;
    total_duration: number;
    stages: Stage[];
    shuffle_stats: ShuffleStats;
    errors: string | null;
    num_executors: number;
}

export interface ParquetRow {
    job_id: string;
    total_duration: number;
    stages: string; // JSON stringified
    shuffle_stats: string; // JSON stringified
    errors?: string; // Optional field (undefined when null)
    num_executors: number;
    [key: string]: string | number | undefined;
}