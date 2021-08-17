import Logger from '@ioc:Adonis/Core/Logger';
import ItemTypeService from 'App/Services/ItemTypeService';
import ShipTypeService from 'App/Services/ShipTypeService';

/*********
 * ITEMS *
 *********/
ItemTypeService.add('processed_food', { volume: 10 });
ItemTypeService.add('fresh_food', { volume: 10 });

ItemTypeService.add('steel', { volume: 20 });
ItemTypeService.add('aluminium', { volume: 20 });
ItemTypeService.add('plastics', { volume: 10 });

Logger.debug('Initialised %d item types', ItemTypeService.count);

/*********
 * SHIPS *
 *********/
ShipTypeService.create('scout')
	.capacity(150)
	.speed(8)
	.runCost(100_00)
	.buildCost('steel', 20)
	.buildCost('aluminium', 100)
	.buildCost('plastics', 40)
	.add();

ShipTypeService.create('hauler')
	.capacity(2_000)
	.speed(1)
	.runCost(850_00)
	.buildCost('steel', 600)
	.buildCost('aluminium', 200)
	.buildCost('plastics', 100)
	.add();

Logger.debug('Initialised %d ship types', ShipTypeService.count);
