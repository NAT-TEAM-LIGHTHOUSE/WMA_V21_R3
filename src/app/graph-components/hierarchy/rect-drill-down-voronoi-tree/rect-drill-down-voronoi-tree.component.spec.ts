import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RectDrillDownVoronoiTreeComponent } from './rect-drill-down-voronoi-tree.component';

describe('RectDrillDownVoronoiTreeComponent', () => {
  let component: RectDrillDownVoronoiTreeComponent;
  let fixture: ComponentFixture<RectDrillDownVoronoiTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RectDrillDownVoronoiTreeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RectDrillDownVoronoiTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
