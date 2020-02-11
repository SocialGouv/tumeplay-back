import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
const route = Router();

export default (app: Router) => {
    app.use('/pictures', route);
};
