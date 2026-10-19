import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorldTimeZoneMapComponent } from './world-time-zone-map.component';

describe('WorldTimeZoneMapComponent', () => {
  let component: WorldTimeZoneMapComponent;
  let fixture: ComponentFixture<WorldTimeZoneMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorldTimeZoneMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WorldTimeZoneMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
