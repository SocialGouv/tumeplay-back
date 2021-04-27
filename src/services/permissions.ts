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
		},
		status: {
			'0'	 : [
				config.roles.moderator,
			],
			'1'	 : [
				config.roles.moderator,
			],
			'2'	 : [
				config.roles.moderator,
			],
			'3'	 : [
				config.roles.redactor,
			],
			'4'	 : [
				config.roles.moderator,
			],
			'5'	 : [
				config.roles.redactor,
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
				config.roles.administrator_local,       
			],
			'add': [
			    config.roles.administrator_local,       
			],
			'edit': [
				config.roles.administrator_local,
			],
			'delete': [config.roles.administrator],
		},
	},
	boxs: {
		global: {
			'add' : [
				config.roles.administrator_local,
			],
			'view': [
				config.roles.administrator_local,
			],
			'edit': [
				config.roles.administrator_local,
			],
			'delete': [config.roles.administrator],
		},
		ajax: {
			'products': [
				config.roles.orders_support
			]
		}
	},
	poi: {
		global: {
			'view': [
				config.roles.administrator_local,
			],
			'add' : [
				config.roles.administrator_local,
			],
			'edit': [
				config.roles.administrator_local,
			],
			'delete': [config.roles.administrator],
		},
	},
	orders: {
		global: {
			'view': [config.roles.orders_support],
			'edit': [config.roles.orders_support],
			'delete': [config.roles.administrator_local],
		},
		shipping: {
			'view': [config.roles.administrator],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		}
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
			'delete': [config.roles.administrator_local],
			'add_zone': [config.roles.administrator_local],
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
			'order_support_metropole': [
				config.roles.orders_support_metropole
			],
			'order_support': [
				config.roles.orders_support
			]
		},
	},
};

export default permissions;