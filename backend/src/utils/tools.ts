import {Task, Stage, ShuffleStats, SparkJob} from "../types/types";

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export function generateRandomTask(stageId: string, taskNum: number): Task {
    const duration = randomFloat(5, 30);
    const shuffleReadMb = randomFloat(1, 15);
    const shuffleWriteMb = randomFloat(0, 10);
    return {
        task_id: `${stageId}-Task-${taskNum}`,
        duration,
        shuffle_read_mb: shuffleReadMb,
        shuffle_write_mb: shuffleWriteMb,
    };
}

export function generateRandomStage(stageNum: number): Stage {
    const stageId = `${stageNum}-Stage`;
    const numTasks = randomInt(1, 5);
    const tasks: Task[] = Array.from({length: numTasks}, (_, i) =>
        generateRandomTask(stageId, i + 1));
    const duration = tasks.reduce((sum, task) => sum + task.duration, 0);
    return {stage_id: stageId, duration, tasks};
}

export function generateRandomShuffleStats(stages: Stage[]): ShuffleStats {
    const totalShuffleReadMb = stages.flatMap(stage => stage.tasks)
        .reduce((sum, task) => sum + task.shuffle_read_mb, 0);
    const totalShuffleWriteMb = stages.flatMap(stage => stage.tasks)
        .reduce((sum, task) => sum + task.shuffle_write_mb, 0);
    return {total_shuffle_read_mb: totalShuffleReadMb, total_shuffle_write_mb: totalShuffleWriteMb};
}

export function generateRandomJob(jobId: string): SparkJob {
    const numStages = randomInt(1, 4);
    const stages: Stage[] = Array.from({length: numStages}, (_, i) =>
        generateRandomStage(i + 1));
    const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
    const shuffleStats = generateRandomShuffleStats(stages);
    const hasError = Math.random() < 0.1;
    const errors = hasError ? 'OutOfMemoryError' : null;
    const numExecutors = randomInt(2, 8);
    return {
        job_id: jobId,
        total_duration: totalDuration,
        stages,
        shuffle_stats: shuffleStats,
        errors,
        num_executors: numExecutors,
    }
}