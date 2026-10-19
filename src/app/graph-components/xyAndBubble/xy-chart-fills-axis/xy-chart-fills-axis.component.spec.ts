import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { XyChartFillsAxisComponent } from './xy-chart-fills-axis.component';

describe('XyChartFillsAxisComponent', () => {
  let component: XyChartFillsAxisComponent;
  let fixture: ComponentFixture<XyChartFillsAxisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ XyChartFillsAxisComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(XyChartFillsAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
