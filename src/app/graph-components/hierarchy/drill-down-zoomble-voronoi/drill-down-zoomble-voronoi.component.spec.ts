import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrillDownZoombleVoronoiComponent } from './drill-down-zoomble-voronoi.component';

describe('DrillDownZoombleVoronoiComponent', () => {
  let component: DrillDownZoombleVoronoiComponent;
  let fixture: ComponentFixture<DrillDownZoombleVoronoiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillDownZoombleVoronoiComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrillDownZoombleVoronoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
