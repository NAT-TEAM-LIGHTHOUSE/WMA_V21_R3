import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockComparingPricesChartComponent } from './stock-comparing-prices-chart.component';

describe('StockComparingPricesChartComponent', () => {
  let component: StockComparingPricesChartComponent;
  let fixture: ComponentFixture<StockComparingPricesChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockComparingPricesChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockComparingPricesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
