import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MulitpleValueAxisChartComponent } from './mulitple-value-axis-chart.component';

describe('MulitpleValueAxisChartComponent', () => {
  let component: MulitpleValueAxisChartComponent;
  let fixture: ComponentFixture<MulitpleValueAxisChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MulitpleValueAxisChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MulitpleValueAxisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
