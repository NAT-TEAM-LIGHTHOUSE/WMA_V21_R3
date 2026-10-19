import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapImagingAreasMapComponent } from './map-imaging-areas-map.component';

describe('MapImagingAreasMapComponent', () => {
  let component: MapImagingAreasMapComponent;
  let fixture: ComponentFixture<MapImagingAreasMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapImagingAreasMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapImagingAreasMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
