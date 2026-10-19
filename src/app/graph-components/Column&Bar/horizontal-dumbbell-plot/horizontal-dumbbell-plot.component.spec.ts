import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HorizontalDumbbellPlotComponent } from './horizontal-dumbbell-plot.component';

describe('HorizontalDumbbellPlotComponent', () => {
  let component: HorizontalDumbbellPlotComponent;
  let fixture: ComponentFixture<HorizontalDumbbellPlotComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalDumbbellPlotComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalDumbbellPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
