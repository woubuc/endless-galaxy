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
ShipTypeService.add('scout', { capacity: 150, speed: 8, resources: { steel: 20, aluminium: 100, plastics: 40 } });
ShipTypeService.add('hauler', { capacity: 2_000, speed: 1, resources: { steel: 600, aluminium: 200, plastics: 400 } });

Logger.debug('Initialised %d ship types', ShipTypeService.count);
