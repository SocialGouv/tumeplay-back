import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv.config();

if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    port: parseInt(process.env.SERVER_PORT, 10),
    databaseHost: process.env.DATABASE_HOST,
    databaseLogin: process.env.DATABASE_LOGIN,
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseName: process.env.DATABASE_NAME,
    databaseForce: process.env.DATABASE_FORCE,
    jwtSecret: process.env.JWT_SECRET,

    // Email setups:
    mailer: {
        host: process.env.MAIL_TRANSPORT_HOST,
        secure: process.env.MAIL_TRANSPORT_SECURE === 'true',
        port: process.env.MAIL_TRANSPORT_PORT,
        username: process.env.MAIL_TRANSPORT_USER,
        password: process.env.MAIL_TRANSPORT_PASSWORD,
    },

    mondialRelay: {
        websiteId: process.env.MONDIALRELAY_ID,
        websiteKey: process.env.MONDIALRELAY_SECRET,
    },

    // -----------

    defaultAdminLogin: process.env.DEFAULT_ADMIN_LOGIN,
    defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD,

    roles: {
        administrator: 'ROLE_ADMINISTATOR',
        user: 'ROLE_USER',
    },

    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },

    api: {
        prefix: '/api',
    },
};
