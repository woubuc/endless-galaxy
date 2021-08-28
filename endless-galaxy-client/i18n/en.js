export default {
	title: 'Endless Galaxy',
	subtitle: 'Interplanetary traders & entrepreneurs',

	open_game_link: 'To game',

	ui: {
		close: 'Close',
		cancel: 'Cancel',
	},

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
		planet: 'Planet',

		ships: 'Ships',
		ships_count: '{0} ship here | {0} ships here',
		ships_targeting: 'Ships en route',
		has_population: 'Inhabited',
		has_market: 'Market',
		has_shipyard: 'Shipyard',
		has_warehouse: 'You own buildings on this planet',

		settlement: 'Settlement',
		settlement_population: '{0} citizens',

		market: 'Market',
		market_sell_orders: '0 sell | {0} sell | {0} sell',
		market_buy_orders: '0 buy orders | {0} buy order | {0} buy orders',

		shipyard: 'Shipyard',
		shipyard_queue: 'Available | {0} order in queue | {0} orders in queue',

		warehouse: 'Warehouse',
		warehouse_inventory: 'Empty | {0} item | {0} items',

		buildings: 'Buildings',
		buildings_idle: 'Operational | {0} idle | {0} idle',
		buildings_factories: 'Production buildings',
		buildings_shops: 'Shops',

		construction: 'Construction',
		construction_activity: 'Idle | Working',

		construct_building: 'Build new building'
	},

	settlement: {
		population: '{0} people live here',
		demand_items: 'Demands',
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
		order_days_remaining: ' | almost ready | ready in {0}h',
	},

	warehouse: {
		inventory: 'Warehouse inventory',
	},

	construction: {
		no_warehouse: 'Build a warehouse to establish a base of operations and unlock other building projects on this planet.',
		not_enough_money: 'Can\'t afford',

		build: 'Build {0}',
		upgrade: 'Upgrade {0}',
		insufficient_money: 'Not enough money',
		recipes_button: 'View Recipes',
		recipes_title: '{0} can produce:',
		items_button: 'View items',
		items_title: '{0} can sell:',
	},

	ledger: {
		current: 'This week\'s results',
		multiple: '{0}x',
		maintenance: 'Maintenance',
		ship: 'Fleet',
		shipyard_order: 'Shipyard order ({0})',
		running_cost: 'Running costs ({0})',
		construction: 'Construction',
		warehouse: 'Warehouse {0}',
		build: 'Build ({0})',
		upgrade: 'Upgrade ({0})',
		production: 'Production',
		staff: 'Staff wages ({0})',
		market: 'Market',
		sale: 'Sale ({0})',
		purchase: 'Purchase ({0})',
		buy_order: 'Buy order ({0})',
		refund: 'Buy order refund ({0})',
		scavenge: 'Scavenging',
	},

	inventory: {
		each: ' each',
	},

	building: {
		warehouse: 'Warehouse',
		idle: 'Idle',
	},

	factory: {
		input: 'Input',
		output: 'Output',

		idle: '{0} is idle',
		change_recipe: 'Select production recipe',
		set_recipe: 'Start production',
		pending: 'Getting ready',

		repeating: 'Production will continue indefinitely',
		not_repeating: 'Production will stop after this run',
		no_supply: 'Not enough resources in warehouse',
	},

	itemType: {
		aluminium: 'Aluminium',
		apples: 'Apples',
		avocado: 'Avocados',
		bacon: 'Bacon',
		baguette: 'Baguettes',
		bananas: 'Bananas',
		bauxite: 'Bauxite',
		bauxite_ore: 'Bauxite ore',
		beauty_product: 'Beauty products',
		beets: 'Beets',
		book: 'Books',
		bread: 'Bread',
		candy: 'Candy',
		capacitor: 'Capacitors',
		carrots: 'Carrots',
		cashews: 'Cashews',
		cheese: 'Cheese',
		cherries: 'Cherries',
		chicken: 'Chicken',
		chicken_meat: 'Chicken',
		coal: 'Coal',
		concrete: 'Concrete',
		construction_equipment: 'Construction equipment',
		construction_material: 'Construction materials',
		construction_tool: 'Construction tools',
		copper: 'Copper',
		copper_ore: 'Copper ore',
		corn: 'Corn',
		cow: 'Cows',
		croissant: 'Pastries',
		eggplant: 'Eggplants',
		eggs: 'Eggs',
		electronics: 'Electronics',
		fish: 'Fish',
		fishing_equipment: 'Fishing equipment',
		flax: 'Flax',
		flour: 'Flour',
		fresh_food: 'Fresh food',
		gem: 'Gems',
		gold: 'Gold',
		gold_ore: 'Gold ore',
		grapes: 'Grapes',
		hazelnuts: 'Hazelnuts',
		iron: 'Iron',
		iron_ore: 'Iron ore',
		lettuce: 'Lettuce',
		led: 'LED',
		log: 'Log',
		magazine: 'Magazines',
		milk: 'Milk',
		nylon: 'Nylon',
		orange_juice: 'Orange juice',
		oranges: 'Oranges',
		paper: 'Paper',
		peanuts: 'Peanuts',
		pears: 'Pears',
		petroleum: 'Petroleum',
		pig: 'Pigs',
		plank: 'Plank',
		plastic: 'Plastics',
		potatoes: 'Potatoes',
		processed_food: 'Processed food',
		processor: 'Processors',
		robot: 'Robots',
		rock: 'Rocks',
		rope: 'Ropes',
		seed: 'Seeds',
		silicon: 'Silicon',
		silicon_ore: 'Silicate ore',
		spinach: 'Spinach',
		steak: 'Steaks',
		steel: 'Steel',
		sugar: 'Sugar',
		sugarcane: 'Sugar cane',
		tomato: 'Tomatoes',
		tool: 'Tools',
		wheat: 'Wheat',
	},

	factoryType: {
		bakery: 'Bakery',
		barn: 'Barn',
		brewery: 'Brewery',
		butcher: 'Slaughterhouse',
		factory: 'Factory',
		farm: 'Farm',
		fishing: 'Fishery',
		food_factory: 'Food factory',
		forest: 'Forest',
		foundry: 'Foundry',
		lab: 'Laboratory',
		mill: 'Grain Mill',
		oil_pump: 'Oil Pump',
		mine: 'Surface Mine',
		orchard: 'Orchard',
	},

	shopType: {
		grocery_store: 'Grocery Store',
		bookshop: 'Book Store',
		gas_station: 'Gas Station',
	},

	shipType: {
		scout: 'Scout',
		hauler: 'Hauler',
	},
}
