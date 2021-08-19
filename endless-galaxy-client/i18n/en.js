export default {
	title: 'Endless Galaxy',
	subtitle: 'Interplanetary traders & entrepreneurs',

	open_game_link: 'To game',

	login: {
		email: 'Email',
		password: 'Password',
		action: 'Log in or sign up',
		action_text: 'If you don\'t have an account, a new account will be created for you',

		logout: 'Log out',
	},

	verify_email: {
		prompt: 'Please verify your email address',
		prompt_secondary: 'Click the button in the email you received to verify your email address.',
		waiting_message: 'If you don\'t receive an email after a few minutes, be sure to check your spam folder.',
		resend_prompt: 'Haven\'t received an email?',
		resend: 'Resend verification email',

		verified: 'Email verified',
		verified_text: 'You can close this window and go back to the game. Or load the game here if you closed your original window.',
		verified_action: 'Load game',
	},

	onboarding: {
		company_name: 'Choose a name for your company',
		save: 'Save & continue',
	},

	bank: {
		loan: 'loan',
	},

	planet: {
		buildings: 'Buildings',
		ships: 'Ships',
		ships_targeting: 'Ships en route',
		has_settlement: 'Has settlements',
		has_shipyard: 'Shipyard',

		settlement: 'Settlement',
		settlement_population: '{0} citizens',

		market: 'Market',
		market_sell_orders: '0 sell | {0} sell | {0} sell',
		market_buy_orders: '0 buy orders | {0} buy order | {0} buy orders',

		shipyard: 'Shipyard',
		shipyard_queue: 'Available | {0} order in queue | {0} orders in queue',

		warehouse: 'Warehouse',
		warehouse_inventory: 'Empty | {0} item | {0} items',

		construction: 'Construction',
		construction_activity: 'Idle | Working',

		construct_building: 'Build new building'
	},

	market: {
		sell_orders: 'Sell orders',
		buy_orders: 'Buy orders',

		create_sell_order: 'Sell goods',
		select_item_to_sell: 'Select a good to sell',
		sell_order_options: 'Set up your sell order',
		create_buy_order: 'Place buy order',
	},

	shipyard: {
		order: 'Order ship',
		type: 'Ship type',
		ship_volume: '{0}m³ cargo space',
		ship_speed: '{0} AU per day',
		ship_run_cost: '{0}/day',
		request_quote: 'Request price quote',
		price_quote: 'Total cost:',
		confirm_order: 'Place order',
		no_resources_title: 'Resource shortage',
		no_resources: 'The shipyard does not have enough resources on hand to build this ship.',
		orders: 'My orders',
		order_days_remaining: ' | ready in 1 day | ready in {0} days',
	},

	warehouse: {
		inventory: 'Warehouse inventory',
	},

	construction: {
		build: 'Build {0}',
		upgrade: 'Upgrade {0}',
		insufficient_money: 'Not enough money',
	},

	profit: {
		multiple: '{0}x',
		maintenance: 'Maintenance',
		ship_run_cost: 'Running costs ({0})',
	},

	ledger: {
		current: 'This week\'s results',
	},

	inventory: {
		each: ' each',
	},

	building: {
		warehouse: 'Warehouse',
		mine: 'Mine',
		farm: 'Farm',
		factory: 'Factory',
	},

	itemType: {
		processed_food: 'Processed food',
		fresh_food: 'Fresh food',

		iron_ore: 'Iron ore',
		iron: 'Iron',

		copper_ore: 'Copper ore',
		copper: 'Copper',

		gold_ore: 'Gold ore',
		gold: 'Gold',

		coal: 'Coal',
		steel: 'Steel',
		rock: 'Rock',
		concrete: 'Concrete',

		bauxite: 'Bauxite',
		aluminium: 'Aluminium',

		petroleum: 'Petroleum',
		plastics: 'Plastics',
	},

	factoryType: {
		factory: 'Factory',
		farm: 'Farm (Field)',
		food_factory: 'Food factory',
		forest: 'Forest',
		lab: 'Laboratory',
		foundry: 'Foundry',
		oil_pump: 'Oil Pump',
		mine: 'Surface Mine',
		deep_mine: 'Underground Mine',
	},

	shopType: {
		grocery_store: 'Grocery Store',
	},

	shipType: {
		scout: 'Scout',
		hauler: 'Hauler',
	},
}
