import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapUsingD3ProjectionsComponent } from './map-using-d3-projections.component';

describe('MapUsingD3ProjectionsComponent', () => {
  let component: MapUsingD3ProjectionsComponent;
  let fixture: ComponentFixture<MapUsingD3ProjectionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapUsingD3ProjectionsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapUsingD3ProjectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
