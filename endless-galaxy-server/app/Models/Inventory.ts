import { InventoryStack } from 'App/Models/InventoryStack';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';

export type Inventory = Record<ItemTypeId, InventoryStack>;
