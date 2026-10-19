import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariableRadiusRadarChartComponent } from './variable-radius-radar-chart.component';

describe('VariableRadiusRadarChartComponent', () => {
  let component: VariableRadiusRadarChartComponent;
  let fixture: ComponentFixture<VariableRadiusRadarChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableRadiusRadarChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariableRadiusRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
