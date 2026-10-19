import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockChartRelativeStrengthIndexComponent } from './stock-chart-relative-strength-index.component';

describe('StockChartRelativeStrengthIndexComponent', () => {
  let component: StockChartRelativeStrengthIndexComponent;
  let fixture: ComponentFixture<StockChartRelativeStrengthIndexComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockChartRelativeStrengthIndexComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockChartRelativeStrengthIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
