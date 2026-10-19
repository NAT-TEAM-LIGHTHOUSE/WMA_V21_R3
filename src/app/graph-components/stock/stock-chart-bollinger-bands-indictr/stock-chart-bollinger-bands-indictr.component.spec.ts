import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockChartBollingerBandsIndictrComponent } from './stock-chart-bollinger-bands-indictr.component';

describe('StockChartBollingerBandsIndictrComponent', () => {
  let component: StockChartBollingerBandsIndictrComponent;
  let fixture: ComponentFixture<StockChartBollingerBandsIndictrComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockChartBollingerBandsIndictrComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockChartBollingerBandsIndictrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
