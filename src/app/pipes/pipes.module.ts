import { NgModule } from '@angular/core';

import { TableSearchPipe } from './table-search.pipe';
import { SearchfilterPipe } from './searchfilter.pipe';
import { MultileveltabsearchPipe } from './multileveltabsearch.pipe';
import { ApexSearchPipe } from './apex-search.pipe';
import { CanvasItemSearchPipe } from './canvas-item-search.pipe';
import { LovComboSearchPipe } from './lov-combo-search.pipe';
import { FormatMaskPipe } from './format-mask.pipe';
import { ColumnfilterPipe } from './column-filter';
import { InputFormatMaskPipe } from './input-format-mask.pipe';
import { FilterColumnDataPipe } from './filter-column-data.pipe';
import { SearchFilterRawPipe } from './search-filter-raw.pipe';
import { GlobalSearchPipe } from './global-search.pipe';

@NgModule({
  declarations: [TableSearchPipe,GlobalSearchPipe, MultileveltabsearchPipe,ApexSearchPipe, CanvasItemSearchPipe, LovComboSearchPipe, FormatMaskPipe,SearchfilterPipe,ColumnfilterPipe,FilterColumnDataPipe, InputFormatMaskPipe, SearchFilterRawPipe, GlobalSearchPipe],
  imports: [
    
  ],
  exports:[TableSearchPipe,MultileveltabsearchPipe,ApexSearchPipe,GlobalSearchPipe,CanvasItemSearchPipe,LovComboSearchPipe,FormatMaskPipe,InputFormatMaskPipe,SearchfilterPipe,ColumnfilterPipe,SearchFilterRawPipe],
  providers:[TableSearchPipe,MultileveltabsearchPipe,ApexSearchPipe,GlobalSearchPipe,CanvasItemSearchPipe,LovComboSearchPipe,FormatMaskPipe,InputFormatMaskPipe,ColumnfilterPipe,FilterColumnDataPipe,SearchFilterRawPipe]
})
export class PipesModule { }
