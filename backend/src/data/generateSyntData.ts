import * as fs from 'fs';
import * as parquet from 'parquetjs';
import {generateRandomJob} from "../utils/tools";
import {ParquetRow} from '../types/types';

const DATA_DIR = './spark_logs'

export async function generateSynthData(): Promise<void> {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

    const numJobs = 5;
    for (let j = 1; j <= numJobs; j++) {
        const jobId = `job_${String(j).padStart(3, '0')}`;
        const filePath = `${DATA_DIR}/${jobId}.parquet`;

        if (!fs.existsSync(filePath)) {
            const jobData = generateRandomJob(jobId);
            const parquetData: ParquetRow = {
                job_id: jobData.job_id,
                total_duration: jobData.total_duration,
                stages: JSON.stringify(jobData.stages),
                shuffle_stats: JSON.stringify(jobData.shuffle_stats),
                num_executors: jobData.num_executors,
            };

            if (jobData.errors !== null) {
                parquetData.errors = jobData.errors;
            }

            const schema = new parquet.ParquetSchema({
                job_id: {type: 'UTF8'},
                total_duration: {type: 'DOUBLE'},
                stages: {type: 'UTF8'},
                shuffle_stats: {type: 'UTF8'},
                errors: {type: 'UTF8', optional: true},
                num_executors: {type: 'INT32'},
            });

            const writer = await parquet.ParquetWriter.openFile(schema, filePath);
            await writer.appendRow(parquetData as any);
            await writer.close();
        }
    }
}