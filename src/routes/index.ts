import express from 'express';

const routes = express.Router();

import testRouter from './test.routes';
import authRouter from './auth.routes';

routes.use('/test', testRouter);
routes.use('/auth', authRouter)

export default routes;
