import { ItemsComponent } from './items.component';
import { ItemComponentsModule } from '../../shared_modules/item-components/item-components-module';

export const ItemsModule = [ItemsComponent, ...ItemComponentsModule];