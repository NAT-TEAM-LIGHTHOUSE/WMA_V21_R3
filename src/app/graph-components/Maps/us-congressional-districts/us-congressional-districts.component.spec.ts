import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsCongressionalDistrictsComponent } from './us-congressional-districts.component';

describe('UsCongressionalDistrictsComponent', () => {
  let component: UsCongressionalDistrictsComponent;
  let fixture: ComponentFixture<UsCongressionalDistrictsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsCongressionalDistrictsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsCongressionalDistrictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
