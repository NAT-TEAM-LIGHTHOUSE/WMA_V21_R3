import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineChartHorizantalTargetComponent } from './line-chart-horizantal-target.component';

describe('LineChartHorizantalTargetComponent', () => {
  let component: LineChartHorizantalTargetComponent;
  let fixture: ComponentFixture<LineChartHorizantalTargetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartHorizantalTargetComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartHorizantalTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
