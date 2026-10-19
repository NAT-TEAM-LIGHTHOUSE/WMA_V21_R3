import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockChartComparingPricesComponent } from './stock-chart-comparing-prices.component';

describe('StockChartComparingPricesComponent', () => {
  let component: StockChartComparingPricesComponent;
  let fixture: ComponentFixture<StockChartComparingPricesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockChartComparingPricesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockChartComparingPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
