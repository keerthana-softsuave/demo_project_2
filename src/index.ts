import express, { Application, Request, Response, RequestHandler } from 'express';

const app: Application = express();
const port: number = 3000;

app.use(express.json() as RequestHandler);

import {router} from "./route/user"
app.use('/test',router);



app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
  });
  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });