import express, { Request, Response } from 'express';
import { getSparkJob} from "./routes/sparkJobs";
import cors from 'cors';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.get('/api/spark_jobs/:job_id', async (req: Request, res: Response) => {
    await getSparkJob(req, res);
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})