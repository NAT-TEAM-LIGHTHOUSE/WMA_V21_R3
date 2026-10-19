import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApproximateWorkingHoursMapComponent } from './approximate-working-hours-map.component';

describe('ApproximateWorkingHoursMapComponent', () => {
  let component: ApproximateWorkingHoursMapComponent;
  let fixture: ComponentFixture<ApproximateWorkingHoursMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproximateWorkingHoursMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApproximateWorkingHoursMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
