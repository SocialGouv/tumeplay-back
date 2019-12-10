import express 		from 'express';
import session		from 'express-session';
import bodyParser 	from 'body-parser';
import cors 		from 'cors';
import apiRoutes 	from '../api';
import frontRoutes	from '../front';
import config 		from '../config';
import path 		from 'path';



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

  app.use('/css', 		express.static('public/css'));
  app.use('/js',  		express.static('public/js'));
  app.use('/pictures',  express.static('public/pictures'));
  
  app.use('/uploads/themeFiles',  express.static('uploads/themeFiles'));
  app.use('/uploads/categoryFiles',  express.static('uploads/categoryFiles'));
  app.use('/uploads/contentFiles',  express.static('uploads/contentFiles'));
  app.use('/uploads/questionFiles',  express.static('uploads/questionFiles'));
  app.use('/uploads/productFiles',  express.static('uploads/productFiles'));
  
  
  app.set("view engine", "pug");
  app.set("views", 		 path.join(__dirname, "../pug"));
  
  app.enable('trust proxy');

  app.use(cors());

  app.use(require('method-override')());

  app.use(session({
	secret: config.jwtSecret,
	resave: true,
	saveUninitialized: true
  }));
  
  app.use(bodyParser.urlencoded({extended : true}));
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