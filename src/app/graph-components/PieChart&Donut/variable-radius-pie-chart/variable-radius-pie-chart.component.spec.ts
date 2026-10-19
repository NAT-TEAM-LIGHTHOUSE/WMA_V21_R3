import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariableRadiusPieChartComponent } from './variable-radius-pie-chart.component';

describe('VariableRadiusPieChartComponent', () => {
  let component: VariableRadiusPieChartComponent;
  let fixture: ComponentFixture<VariableRadiusPieChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableRadiusPieChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariableRadiusPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
