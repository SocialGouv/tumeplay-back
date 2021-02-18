import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv.config();

if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    port: parseInt(process.env.SERVER_PORT, 10),
    databaseHost: process.env.PGHOST,
    databaseLogin: process.env.PGUSER,
    databasePassword: process.env.PGPASSWORD,
    databaseName: process.env.PGDATABASE,
    databaseForce: process.env.DATABASE_FORCE,
    jwtSecret: process.env.JWT_SECRET,
    environment: process.env.ENVIRONMENT || 'prod',

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
        administrator_local: 'ROLE_ADMINISTRATOR_LOCAL',
        redactor: 'ROLE_REDACTOR',
        moderator: 'ROLE_MODERATOR',
        orders_support: 'ROLE_ORDERS_SUPPORT',
        user: 'ROLE_USER',
    },
    roles_hierarchy: {
		ROLE_ADMINISTATOR: [
			'ROLE_ADMINISTRATOR_LOCAL',
		],
		ROLE_ADMINISTRATOR_LOCAL: [
			'ROLE_REDACTOR',
			'ROLE_MODERATOR',
			'ROLE_ORDERS_SUPPORT'
		],		
    },
    roles_readable: {
        ROLE_ADMINISTATOR: 'Super-Admin.',
        ROLE_ADMINISTRATOR_LOCAL: 'Admin.',
        ROLE_REDACTOR: 'Rédacteur',
        ROLE_MODERATOR: 'Modérateur',
        ROLE_ORDERS_SUPPORT: 'Référent / Support',
        ROLE_USER: 'Utilisateur',
    },

    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },

    api: {
        prefix: '/api',
    },
};
