import request from 'supertest';
import express, {Request, Response} from 'express';
import * as fs from 'node:fs';
import * as parquet from 'parquetjs';
import { SparkJob } from '../types/types';
import {getSparkJob} from "../routes/sparkJobs";
import {describe} from "node:test";

const app = express();
app.use(express.json());
app.get('api/spark_jobs/:fob_id', async (req: Request, res: Response) => {
    await getSparkJob(req, res);
});

jest.mock('node.fs');
jest.mock('parquetjs');
jest.mock('../data/generateSyntData', () => ({
    generateSyntData: jest.fn().mockResolvedValue(undefined),
}));

describe('GET /api/spark_jobs/:job_id', () => {
    const sampleJob: SparkJob = {
        job_id: 'job_001',
        total_duration: 120.5,
        stages: [{ stage_id: 'stage_1', duration: 60, tasks: [] }],
        shuffle_stats: { total_shuffle_read_mb: 150.0, total_shuffle_write_mb: 200.0 },
        errors: null,
        num_executors: 4,
    }

    const sampleRow = {
        job_id: 'job_001',
        total_duration: 120.5,
        stages: JSON.stringify(sampleJob.stages),
        shuffle_stats: JSON.stringify(sampleJob.shuffle_stats),
        errors: null,
        num_executors: 4,
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns job data for an existing job', async () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        const mockCursor = {
            next: jest.fn().mockReturnValueOnce(sampleRow),
        };
        const mockReader ={
            getCursor: jest.fn(() => mockCursor),
            close: jest.fn().mockResolvedValue(undefined),
        };
        (parquet.ParquetReader.openFile as jest.Mock).mockResolvedValue(mockReader);

        const response = await request(app).get('/api/spark_jobs/job_001');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(sampleJob);
        expect(fs.existsSync).toHaveBeenCalledWith('./spark_logs/job_001.parquet');
        expect(parquet.ParquetReader.openFile).toHaveBeenCalledWith('./spark_logs/job_001.parquet');
        expect(mockReader.close).toHaveBeenCalled();
    })
    it('returns 404 if Parquet file does not exist', async () => {
        // Mock fs.existsSync to return false
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        const response = await request(app).get('/api/spark_jobs/job_999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Job not found' });
        expect(fs.existsSync).toHaveBeenCalledWith('./spark_logs/job_999.parquet');
        expect(parquet.ParquetReader.openFile).not.toHaveBeenCalled();
    });

    it('returns 404 if no data is found in the Parquet file', async () => {
        // Mock fs.existsSync to return true
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        // Mock ParquetReader to return null
        const mockCursor = {
            next: jest.fn().mockResolvedValueOnce(null),
        };
        const mockReader = {
            getCursor: jest.fn(() => mockCursor),
            close: jest.fn().mockResolvedValue(undefined),
        };
        (parquet.ParquetReader.openFile as jest.Mock).mockResolvedValue(mockReader);

        const response = await request(app).get('/api/spark_jobs/job_001');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'No data found for the job' });
        expect(mockReader.close).toHaveBeenCalled();
    });

    it('returns 500 if an error occurs while reading the Parquet file', async () => {
        // Mock fs.existsSync to return true
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        // Mock ParquetReader to throw an error
        (parquet.ParquetReader.openFile as jest.Mock).mockRejectedValue(new Error('Parquet read error'));

        const response = await request(app).get('/api/spark_jobs/job_001');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Parquet read error' });
    });

    it('returns 500 if generateSynthData fails', async () => {
        // Mock generateSynthData to throw an error
        const mockGenerateSynthData = require('../data/generateSyntData').generateSynthData;
        mockGenerateSynthData.mockRejectedValue(new Error('Synth data generation failed'));

        const response = await request(app).get('/api/spark_jobs/job_001');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Synth data generation failed' });
        expect(fs.existsSync).not.toHaveBeenCalled(); // Fails before file check
    });
});
