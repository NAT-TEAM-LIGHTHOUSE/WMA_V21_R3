import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StackedBarChartNegativeValuesComponent } from './stacked-bar-chart-negative-values.component';

describe('StackedBarChartNegativeValuesComponent', () => {
  let component: StackedBarChartNegativeValuesComponent;
  let fixture: ComponentFixture<StackedBarChartNegativeValuesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedBarChartNegativeValuesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StackedBarChartNegativeValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
