import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound		 = dotenv.config();

if (!envFound) 
{
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port				: parseInt(process.env.SERVER_PORT, 10),
  databaseURL		: process.env.DATABASE_URI,
  databaseHost		: process.env.DATABASE_HOST,
  databaseLogin 	: process.env.DATABASE_LOGIN,
  databasePassword 	: process.env.DATABASE_PASSWORD,
  databaseName		: process.env.DATABASE_NAME,
  jwtSecret			: process.env.JWT_SECRET,   
  
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
          
  api: 	{
    prefix: '/api',
  },  
};
