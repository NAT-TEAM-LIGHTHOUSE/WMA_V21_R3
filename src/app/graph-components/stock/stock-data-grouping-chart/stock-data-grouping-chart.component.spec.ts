import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockDataGroupingChartComponent } from './stock-data-grouping-chart.component';

describe('StockDataGroupingChartComponent', () => {
  let component: StockDataGroupingChartComponent;
  let fixture: ComponentFixture<StockDataGroupingChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDataGroupingChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockDataGroupingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
