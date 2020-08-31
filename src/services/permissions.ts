import config from '../config';

const permissions = {
	contents : {
		metropole: {
			'view': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
			],
			'edit': [
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
			],
			'delete': [ 
				config.roles.administrator_metropole
			],
		},
		guyane: {
			'view': [ 
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'edit': [ 
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'delete': [ 
				config.roles.administrator_guyane 
			],
		},
		global: {
			'view': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'edit': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'delete': [ 
				config.roles.administrator_metropole,
				config.roles.administrator_guyane 
			],
		}
	},
	questions : {
		metropole: {
			'view': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
			],
			'edit': [
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
			],
			'delete': [ 
				config.roles.administrator_metropole
			],
		},
		guyane: {
			'view': [ 
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'edit': [ 
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'delete': [ 
				config.roles.administrator_guyane 
			],
		},
		global: {
			'view': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'edit': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'delete': [ 
				config.roles.administrator_metropole,
				config.roles.administrator_guyane 
			],
		}
	},
	families: {
		metropole: {
			'view': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
			],
			'edit': [
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
			],
			'delete': [ 
				config.roles.administrator_metropole
			],
		},
		guyane: {
			'view': [ 
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'edit': [ 
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'delete': [ 
				config.roles.administrator_guyane 
			],
		},
		global: {
			'view': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'add' : [
				config.roles.redactor_metropole,
				config.roles.redactor_guyane,
			],
			'edit': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'delete': [ 
				config.roles.administrator_metropole,
				config.roles.administrator_guyane 
			],
		}
	},
	thematics: {
		metropole: {
			'view': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
			],
			'edit': [
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
			],
			'delete': [ 
				config.roles.administrator_metropole
			],
		},
		guyane: {
			'view': [ 
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'edit': [ 
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'delete': [ 
				config.roles.administrator_guyane 
			],
		},
		global: {
			'view': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'add' : [
				config.roles.redactor_metropole,
				config.roles.redactor_guyane,
			],
			'edit': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'delete': [ 
				config.roles.administrator_metropole,
				config.roles.administrator_guyane 
			],
		}
	},
	reviews: {
		metropole: {
			'view': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
			],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		},
		guyane: {
			'view': [
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		},             
		global: {
			'view': [ 
				config.roles.redactor_metropole,
				config.roles.moderator_metropole,
				config.roles.redactor_guyane,
				config.roles.moderator_guyane,
			],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		}
	},
	contacts: {
		metropole: {
			'view': [config.roles.administrator],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		},
		guyane: {
			'view': [config.roles.administrator],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		},
		global: {
			'view': [config.roles.administrator],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		}
	},
	products: {
		metropole: {
			'view': [
				config.roles.moderator_metropole,
			],
			'edit': [config.roles.moderator_metropole],
			'delete': [config.roles.administrator],
		},
		guyane: {
			'view': [
				config.roles.moderator_guyane,
			],
			'edit': [config.roles.moderator_guyane],
			'delete': [config.roles.administrator],
		},
		global: {
			'view': [
				config.roles.moderator_metropole,
				config.roles.moderator_guyane,
			],
			'add': [
			    config.roles.moderator_metropole,
				config.roles.moderator_guyane,
			],
			'edit': [
				config.roles.moderator_metropole,
				config.roles.moderator_guyane,
			],
			'delete': [config.roles.administrator],
		},
	},
	boxs: {
		metropole: {
			'view': [
				config.roles.moderator_metropole,
			],
			'edit': [config.roles.moderator_metropole],
			'delete': [config.roles.administrator],
		},
		guyane: {
			'view': [
				config.roles.moderator_guyane,
			],
			'edit': [config.roles.moderator_guyane],
			'delete': [config.roles.administrator],
		},
		global: {
			'view': [
				config.roles.moderator_metropole,
				config.roles.moderator_guyane,
			],
			'edit': [
				config.roles.moderator_metropole,
				config.roles.moderator_guyane,
			],
			'delete': [config.roles.administrator],
		},
	},
	poi: {
		metropole: {
			'view': [
				config.roles.moderator_metropole,
			],
			'edit': [config.roles.moderator_metropole],
			'delete': [config.roles.administrator],
		},
		guyane: {
			'view': [
				config.roles.moderator_guyane,
			],
			'edit': [config.roles.moderator_guyane],
			'delete': [config.roles.administrator],
		},
		
		global: {
			'view': [
				config.roles.moderator_metropole,
				config.roles.moderator_guyane,
			],
			'add' : [
				config.roles.moderator_metropole,
				config.roles.moderator_guyane,
			],
			'edit': [
				config.roles.moderator_metropole,
				config.roles.moderator_guyane,
			],
			'delete': [config.roles.administrator],
		},
	},
	orders: {
		metropole: {
			'view': [
				config.roles.orders_support_metropole,
			],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		},
		guyane: {
			'view': [
				config.roles.orders_support_guyane,
			],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		},
		
		global: {
			'view': [config.roles.orders_support_metropole,config.roles.orders_support_guyane,],
			'edit': [config.roles.orders_support_metropole,config.roles.orders_support_guyane,],
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
				config.roles.orders_support_guyane,
				config.roles.administrator_metropole,
				config.roles.administrator_guyane
			],
			'edit': [config.roles.administrator],
			'delete': [config.roles.administrator],
		},
		dashboard: {
			'superadministrator': [ 
				config.roles.administrator 
			],
			'administrator': [
			    config.roles.administrator_metropole,
				config.roles.administrator_guyane
			],
			'redactor': [
				config.roles.redactor_metropole,
				config.roles.redactor_guyane,
			],
			'moderator': [
				config.roles.moderator_metropole, 
				config.roles.moderator_guyane,
			],
			'order_support': [
				config.roles.orders_support_metropole,
				config.roles.orders_support_guyane
			]
		},
	},
};

export default permissions;