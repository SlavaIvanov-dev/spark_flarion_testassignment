import {generateSynthData} from "../data/generateSyntData";
import {Request, Response} from "express";
import * as fs from "node:fs";
import * as parquet from 'parquetjs';
import {SparkJob} from "../types/types";

export async function getSparkJob(req: Request, res: Response) {
    await generateSynthData();
    const jobId = req.params.job_id;
    const filePath = `./spark_logs/${jobId}.parquet`;

    try{
        if(!fs.existsSync(filePath)){
            return res.status(404).json({error: "Job not found"});
        }
        const reader = await parquet.ParquetReader.openFile(filePath);
        const cursor = reader.getCursor();
        const row = (await cursor.next()) as any;
        await reader.close();

        if(!row) {
            return res.status(404).json({error: "No data found for the job"})
        }

        const jobData: SparkJob = {
            job_id: row.job_id,
            total_duration: row.total_duration,
            stages: JSON.parse(row.stages),
            shuffle_stats: JSON.parse(row.shuffle_stats),
            errors: row.errors,
            num_executors: row.num_executors,
        }

        res.json(jobData);
    }catch (error){
        res.status(500).json({error: (error as Error).message});
    }

}