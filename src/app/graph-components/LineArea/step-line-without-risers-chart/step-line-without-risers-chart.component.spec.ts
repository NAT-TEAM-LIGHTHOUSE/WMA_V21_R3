import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StepLineWithoutRisersChartComponent } from './step-line-without-risers-chart.component';

describe('StepLineWithoutRisersChartComponent', () => {
  let component: StepLineWithoutRisersChartComponent;
  let fixture: ComponentFixture<StepLineWithoutRisersChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StepLineWithoutRisersChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StepLineWithoutRisersChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
