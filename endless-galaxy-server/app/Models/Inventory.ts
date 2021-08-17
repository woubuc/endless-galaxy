import { InventoryStack } from 'App/Models/InventoryStack';
import { ItemTypeId } from 'App/Services/ItemTypeService';

export type Inventory = Record<ItemTypeId, InventoryStack>;
