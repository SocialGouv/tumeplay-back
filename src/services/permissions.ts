import config from '../config';

const permissions = {
	contents : {
		global: {
			'view': [ 
				config.roles.redactor,
				config.roles.moderator,
			],
			'edit': [ 
				config.roles.redactor,
				config.roles.moderator,
			],
			'delete': [ 
				config.roles.administrator_local,
			],
		}
	},
	questions : {
		global: {
			'view': [ 
				config.roles.redactor,
				config.roles.moderator,
			],
			'edit': [ 
				config.roles.redactor,
				config.roles.moderator,
			],
			'delete': [ 
				config.roles.administrator_local,
			],
		}
	},
	families: {
		global: {
			'view': [ 
				config.roles.redactor,
				config.roles.moderator,
			],
			'add' : [
				config.roles.redactor, 
			],
			'edit': [ 
				config.roles.redactor,
				config.roles.moderator,
			],
			'delete': [ 
				config.roles.administrator_local
			],
		}
	},
	thematics: {
		global: {
			'view': [ 
				config.roles.redactor,
				config.roles.moderator,
			],
			'add' : [
				config.roles.redactor,
			],
			'edit': [ 
				config.roles.redactor,
				config.roles.moderator,
			],
			'delete': [ 
				config.roles.administrator_local
			],
		}
	},
	reviews: {
		global: {
			'view': [ 
				config.roles.redactor,
				config.roles.moderator,
			],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		}
	},
	contacts: {
		global: {
			'view': [config.roles.administrator],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		}
	},
	products: {
		global: {
			'view': [
				config.roles.moderator,       
			],
			'add': [
			    config.roles.moderator,       
			],
			'edit': [
				config.roles.moderator,
			],
			'delete': [config.roles.administrator],
		},
	},
	boxs: {
		global: {
			'view': [
				config.roles.moderator,
			],
			'edit': [
				config.roles.moderator,
			],
			'delete': [config.roles.administrator],
		},
	},
	poi: {
		global: {
			'view': [
				config.roles.moderator,
			],
			'add' : [
				config.roles.moderator,
			],
			'edit': [
				config.roles.moderator,
			],
			'delete': [config.roles.administrator],
		},
	},
	orders: {
		global: {
			'view': [config.roles.orders_support],
			'edit': [config.roles.orders_support],
			'delete': [config.roles.administrator],
		},
	},
	global: {
		reset: {
			'exec': [
				config.roles.administrator,
			],   
		},
		zones: {
			'view': [config.roles.administrator],
			'edit': [config.roles.administrator,],
			'delete': [config.roles.administrator],
		},
		users: {
			'view': [
				config.roles.administrator_local
			],
			'edit': [config.roles.administrator_local],
			'delete': [config.roles.administrator],
			'add_zone': [config.roles.administrator],
		},
		dashboard: {
			'superadministrator': [ 
				config.roles.administrator 
			],
			'administrator': [
			    config.roles.administrator_local,
			],
			'redactor': [
				config.roles.redactor,
			],
			'moderator': [
				config.roles.moderator
			],
			'order_support': [
				config.roles.orders_support
			]
		},
	},
};

export default permissions;