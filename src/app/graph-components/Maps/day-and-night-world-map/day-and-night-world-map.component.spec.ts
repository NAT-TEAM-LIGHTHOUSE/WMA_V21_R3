import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DayAndNightWorldMapComponent } from './day-and-night-world-map.component';

describe('DayAndNightWorldMapComponent', () => {
  let component: DayAndNightWorldMapComponent;
  let fixture: ComponentFixture<DayAndNightWorldMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DayAndNightWorldMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DayAndNightWorldMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
