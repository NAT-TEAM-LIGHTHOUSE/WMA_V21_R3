import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockChartBollingerBandsIndicatorComponent } from './stock-chart-bollinger-bands-indicator.component';

describe('StockChartBollingerBandsIndicatorComponent', () => {
  let component: StockChartBollingerBandsIndicatorComponent;
  let fixture: ComponentFixture<StockChartBollingerBandsIndicatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockChartBollingerBandsIndicatorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockChartBollingerBandsIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
