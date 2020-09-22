import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRoutes from '../api';
import frontRoutes from '../front';
import config from '../config';
import path from 'path';
import AclService from '../services/acl';             

export default ({ app }: { app: express.Application }) => {
    /**
     * Health Check endpoints
     * @TODO Explain why they are here
     */
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    app.use('/css', express.static('public/css'));
    app.use('/js', express.static('public/js'));
    app.use('/pictures', express.static('public/pictures'));
    app.use('/fonts', express.static('public/fonts'));

    app.use('/uploads/pictures/box', express.static('uploads/pictures/box'));
    app.use('/uploads/pictures/category', express.static('uploads/pictures/category'));
    app.use('/uploads/pictures/content', express.static('uploads/pictures/content'));
    app.use('/uploads/pictures/product', express.static('uploads/pictures/product'));
    app.use('/uploads/pictures/question', express.static('uploads/pictures/question'));
    app.use('/uploads/pictures/theme', express.static('uploads/pictures/theme'));

    // In default question files, may be accessed via api:
    // ----------------------------------------------------------------------------------------------------

    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../pug'));
    
    app.enable('trust proxy');

    app.use(cors());

    app.use(require('method-override')());

    app.use(
        session({
            secret: config.jwtSecret,
            resave: true,
            saveUninitialized: true,
        }),
    );
    
    app.use(function (req, res, next) {
	    res.locals.req = req;
	    next();
	});
    
    app.use(function (req, res, next) {
        res.locals.readable_roles = '';
        if (req.session && req.session.loggedin) {
            if (req.session.roles) 
            {
                const readableRoles = req.session.roles.map(role => {
                    return config.roles_readable[role];
                });
                
                res.locals.readable_roles = readableRoles.join(', ');
                res.locals.username       = req.session.name;
            }
        }
        next();
    });
    
    app.locals.isAllowed = (req, section, subSection, operation) => {
    	return AclService.checkAllRoles(req.session.roles, section, subSection, operation);	    	
    }

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Load routes
    app.use('/', frontRoutes());
    app.use(config.api.prefix, apiRoutes());

    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    /// error handlers
    app.use((err, req, res, next) => {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (err.name === 'UnauthorizedError') {
            return res
                .status(err.status)
                .send({ message: err.message })
                .end();
        }
        return next(err);
    });
    app.use((err, req, res, next) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
            },
        });
    });
};
