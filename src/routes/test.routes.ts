import express from 'express';
import AppError from '../errors/AppError';

const testRouter = express.Router();

testRouter.get('/', (request, response) => {
    const { token } = request.query;

    if (!token || token != '123') throw new AppError('Missing token query param');

    return response.json({ message: 'ok' });
});
export default testRouter;
