import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { XyChartDateBasedAxisComponent } from './xy-chart-date-based-axis.component';

describe('XyChartDateBasedAxisComponent', () => {
  let component: XyChartDateBasedAxisComponent;
  let fixture: ComponentFixture<XyChartDateBasedAxisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ XyChartDateBasedAxisComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(XyChartDateBasedAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
