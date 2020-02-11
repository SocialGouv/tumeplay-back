import { Router } from 'express';
import auth from './routes/auth';
import box from './routes/boxs';
import contents from './routes/contents';
import order from './routes/order';
import product from './routes/products';
import quizzs from './routes/quizzs';

import shippingMode from './routes/shipping-mode';
import thematiques from './routes/thematiques';
import user from './routes/user';
import poi from './routes/poi';

// guaranteed to get dependencies
export default () => {
    const app = Router();

    auth(app);
    box(app);
    contents(app);
    order(app);
    product(app);
    quizzs(app);

    shippingMode(app);
    thematiques(app);
    user(app);
    poi(app);

    return app;
};
