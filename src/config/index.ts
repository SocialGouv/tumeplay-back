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
        administrator_guyane: 'ROLE_ADMINISTRATOR_GUYANE',
        administrator_metropole: 'ROLE_ADMINISTRATOR_METROPOLE',        
        redactor_guyane: 'ROLE_REDACTOR_GUYANE',
        redactor_metropole: 'ROLE_REDACTOR_METROPOLE',
        moderator_guyane: 'ROLE_MODERATOR_GUYANE',
        moderator_metropole: 'ROLE_MODERATOR_METROPOLE',
        orders_support_guyane: 'ROLE_ORDERS_SUPPORT_GUYANE',
        orders_support_metropole: 'ROLE_ORDERS_SUPPORT_METROPOLE',        
        user: 'ROLE_USER',                                                
    },
    roles_hierarchy: {
		ROLE_ADMINISTATOR: [
			'ROLE_ADMINISTATROR_GUYANE',
			'ROLE_ADMINISTRATOR_METROPOLE'
		],
		ROLE_ADMINISTRATOR_GUYANE: [
			'ROLE_REDACTOR_GUYANE',
			'ROLE_MODERATOR_GUYANE',
			'ROLE_ORDERS_SUPPORT_GUYANE'
		],
		ROLE_ADMINISTRATOR_METROPOLE: [
			'ROLE_REDACTOR_METROPOLE',
			'ROLE_MODERATOR_METROPOLE',
			'ROLE_ORDERS_SUPPORT_METROPOLE'
		],
		
    },

    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },

    api: {
        prefix: '/api',
    },
};
