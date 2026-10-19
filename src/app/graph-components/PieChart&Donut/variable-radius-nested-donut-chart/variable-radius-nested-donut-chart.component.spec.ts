import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariableRadiusNestedDonutChartComponent } from './variable-radius-nested-donut-chart.component';

describe('VariableRadiusNestedDonutChartComponent', () => {
  let component: VariableRadiusNestedDonutChartComponent;
  let fixture: ComponentFixture<VariableRadiusNestedDonutChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableRadiusNestedDonutChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariableRadiusNestedDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
