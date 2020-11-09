import jwt from 'express-jwt';
import config from '../../config';

/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 *
 * But it could come in a query parameter with the name that you want like
 * GET https://my-bulletproof-api.com/stats?apiKey=${JWT}
 * Luckily this API follow _common sense_ ergo a _good design_ and don't allow that ugly stuff
 */
const isLoggedIn = req => {
    return req.session.loggedin;
};

const isAuth = async (req, res, next) => {
    try {
        if (req.session.loggedin) {
            if (!req.session.roles || req.session.roles == config.roles.user) {
                return res.redirect('/');
            }
            next();
        } else {
            return res.redirect('/');
        }
    } catch (e) {
        return res.redirect('/');
    }
};

export default isAuth;
