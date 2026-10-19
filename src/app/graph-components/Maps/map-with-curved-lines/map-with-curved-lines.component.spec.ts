import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapWithCurvedLinesComponent } from './map-with-curved-lines.component';

describe('MapWithCurvedLinesComponent', () => {
  let component: MapWithCurvedLinesComponent;
  let fixture: ComponentFixture<MapWithCurvedLinesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapWithCurvedLinesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapWithCurvedLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
