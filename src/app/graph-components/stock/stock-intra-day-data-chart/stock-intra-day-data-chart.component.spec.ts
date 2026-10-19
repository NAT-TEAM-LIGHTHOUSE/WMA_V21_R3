import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockIntraDayDataChartComponent } from './stock-intra-day-data-chart.component';

describe('StockIntraDayDataChartComponent', () => {
  let component: StockIntraDayDataChartComponent;
  let fixture: ComponentFixture<StockIntraDayDataChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockIntraDayDataChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockIntraDayDataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
