import Logger from '@ioc:Adonis/Core/Logger';
import FactoriesController from 'App/Controllers/Http/FactoriesController';
import Factories from 'App/Services/FactoryTypeDataService';
import Items from 'App/Services/ItemTypeDataService';
import Recipes from 'App/Services/RecipeDataService';
import Ships from 'App/Services/ShipTypeDataService';
import Shops from 'App/Services/ShopTypeDataService';

/*********
 * ITEMS *
 *********/
Items.create('aluminium').volume(20).add();
Items.create('bauxite_ore').volume(25).add();
Items.create('beauty_product').volume(4).add();
Items.create('book').volume(10).add();
Items.create('bread').volume(2).add();
Items.create('candy').volume(4).add();
Items.create('capacitor').volume(1).add();
Items.create('coal').volume(25).add();
Items.create('concrete').volume(10).add();
Items.create('construction_equipment').volume(8).add();
Items.create('construction_material').volume(30).add();
Items.create('construction_tool').volume(4).add();
Items.create('copper').volume(10).add();
Items.create('copper_ore').volume(25).add();
Items.create('electronics').volume(2).add();
Items.create('fresh_food').volume(10).add();
Items.create('gem').volume(1).add();
Items.create('gold').volume(10).add();
Items.create('gold_ore').volume(25).add();
Items.create('iron').volume(10).add();
Items.create('iron_ore').volume(25).add();
Items.create('led').volume(1).add();
Items.create('log').volume(20).add();
Items.create('paper').volume(5).add();
Items.create('petroleum').volume(10).add();
Items.create('plank').volume(15).add();
Items.create('plastic', 'plastics').volume(10).add();
Items.create('processed_food').volume(10).add();
Items.create('processor').volume(1).add();
Items.create('robot').volume(12).add();
Items.create('rock').volume(25).add();
Items.create('seed').volume(1).add();
Items.create('silicon').volume(10).add();
Items.create('silicon_ore').volume(25).add();
Items.create('steel').volume(20).add();
Items.create('tool').volume(6).add();


Logger.info('Initialised %d item types', Items.count);


/***********
 * RECIPES *
 ***********/
Recipes.create('aluminium').input('bauxite_ore', 4).output('aluminium', 1).add();
Recipes.create('bauxite_ore').output('bauxite_ore', 6).output('rock', 2).add();
Recipes.create('beauty_product').input('plastic', 3).input('petroleum', 1).output('beauty_product', 4).add();
Recipes.create('book').input('paper', 3).output('book', 1).add();
// bread
// candy
Recipes.create('capacitor').input('silicon', 1).output('capacitor', 12).add();
Recipes.create('coal').hours(4).output('coal', 22).output('rock', 2).add();
Recipes.create('concrete').input('rock', 4).input('coal', 1).output('concrete', 6).add();
// construction equipment
Recipes.create('construction_material').input('concrete', 12).input('steel', 4).output('construction_material', 10).add();
Recipes.create('construction_tool').input('log', 5).input('steel', 2).output('construction_tool', 3).add();
Recipes.create('copper').input('copper_ore', 5).output('copper', 2).add();
Recipes.create('copper_ore').hours(4).output('copper_ore', 10).output('rock', 5).add();
Recipes.create('electronics').input('led', 4).input('capacitor', 9).input('processor', 1).output('electronics', 5).add();
Recipes.create('fresh_food').input('seed', 10).weeks(4).output('seed', 40).output('fresh_food', 600).add();
Recipes.create('gem').hours(8).output('gem', 2).add();
Recipes.create('gold').input('gold_ore', 8).output('gold', 2).add();
Recipes.create('gold_ore').hours(4).output('gold_ore', 4).output('rock', 6).add();
Recipes.create('iron').input('iron_ore', 4).output('iron', 2).add();
Recipes.create('iron_ore').hours(4).output('iron_ore', 12).output('rock', 4).add();
Recipes.create('led').input('silicon', 1).output('led', 8).add();
Recipes.create('log').weeks(5).output('log', 90).add();
Recipes.create('paper').input('log', 1).output('paper', 4).add();
Recipes.create('petroleum').output('petroleum', 18).add();
Recipes.create('plank').input('log', 1).output('plank', 5).add();
Recipes.create('plastic').input('petroleum', 2).output('plastic', 5).add();
Recipes.create('processed_food').input('fresh_food', 4).output('processed_food', 7).add();
Recipes.create('processor').input('silicon', 3).output('processor', 14).add();
Recipes.create('robot').input('steel', 5).input('aluminium', 8).input('electronics', 4).days(4).output('robot', 1).add();
// rock
// seed
Recipes.create('silicon').input('silicon_ore', 8).output('silicon', 2).add();
Recipes.create('silicon_ore').hours(4).output('silicon_ore', 8).output('rock', 5).add();
Recipes.create('steel').hours(2).input('iron_ore', 4).input('coal', 1).output('steel', 2).add();
Recipes.create('tool').input('log', 1).input('iron', 2).output('tool', 2).add();



Logger.info('Initialised %d recipes', Recipes.count);


/*************
 * FACTORIES *
 *************/
// Factories.create('barn')
// 	.staff(1)
// 	.price(4_000_00)
// 	.add();

// Factories.create('brewery')
// 	.staff(4)
// 	.price(12_000_00)
// 	.add();

Factories.create('factory')
	.staff(8)
	.price(20_000_00)
	.recipe('plank', 'paper', 'book')
	.recipe('plastic')
	.recipe('tool', 'concrete', 'construction_material', 'construction_tool')
	.add();

Factories.create('farm')
	.staff(16)
	.price(28_000_00)
	.recipe('fresh_food')
	.add();

Factories.create('food_factory')
	.staff(8)
	.price(22_000_00)
	.recipe('processed_food')
	.add();

Factories.create('forest')
	.staff(4)
	.price(7_000_00)
	.recipe('log')
	.add();

Factories.create('lab')
	.staff(3)
	.price(44_000_00)
	.recipe('beauty_product', 'robot', 'electronics', 'led', 'processor', 'capacitor')
	.add();

Factories.create('foundry')
	.staff(5)
	.price(25_000_00)
	.recipe('iron', 'copper', 'gold', 'steel', 'aluminium', 'silicon')
	.add();

Factories.create('mine')
	.staff(12)
	.price(40_000_00)
	.recipe('iron_ore', 'copper_ore', 'gold_ore', 'bauxite_ore', 'silicon_ore', 'coal')
	.add();

Factories.create('oil_pump')
	.staff(7)
	.price(80_000_00)
	.recipe('petroleum')
	.add();

// Factories.create('orchard')
// 	.staff(5)
// 	.price(14_000_00)
// 	.add();

// Factories.create('power_plant')
// 	.staff(6)
// 	.price(105_000_00)
// 	.add();

// Factories.create('solar_panels')
// 	.staff(1)
// 	.price(20_000_00)
// 	.add();




Logger.info('Initialised %d factory types', Factories.count);


/*********
 * SHOPS *
 *********/
Shops.create('grocery_store')
	.staff(2)
	.price(8_000_00)
	.shelves(6)
	.item('fresh_food', 'processed_food')
	.add();

Shops.create('bookshop')
	.staff(1)
	.price(6_000_00)
	.shelves(4)
	.item('book')
	.add();

Shops.create('gas_station')
	.staff(1)
	.price(15_000_00)
	.shelves(2)
	.item('petroleum', 'processed_food')
	.add();

Logger.info('Initialised %d shop types', Shops.count);

/*********
 * SHIPS *
 *********/
Ships.create('scout')
	.capacity(150)
	.speed(8)
	.runCost(100_00)
	.buildCost('steel', 20)
	.buildCost('aluminium', 100)
	.buildCost('plastics', 40)
	.add();

Ships.create('hauler')
	.capacity(2_000)
	.speed(1)
	.runCost(850_00)
	.buildCost('steel', 600)
	.buildCost('aluminium', 200)
	.buildCost('plastics', 100)
	.add();

Logger.info('Initialised %d ship types', Ships.count);
