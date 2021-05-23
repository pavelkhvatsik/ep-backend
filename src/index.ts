import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './utils/env';

import errorHandler from './middleware/errorHandler.middleware';
import routers from './routes/index';
import db from './db/index';

const PORT = process.env.PORT || 5000;
const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api', routers);

app.use(errorHandler);

const start = async () => {
  try {
    await db.authenticate();
    await db.sync();

    app.listen(PORT, (): void => {
      console.log(`Example app listening at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
