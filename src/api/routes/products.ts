import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IProduct, IProductInputDTO } from '../../interfaces/IProduct';

const route = Router();

export default (app: Router) => {
    app.use('/products', route);
};
