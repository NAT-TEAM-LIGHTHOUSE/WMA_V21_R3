import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MixedDailyIntraDayChrtComponent } from './mixed-daily-intra-day-chrt.component';

describe('MixedDailyIntraDayChrtComponent', () => {
  let component: MixedDailyIntraDayChrtComponent;
  let fixture: ComponentFixture<MixedDailyIntraDayChrtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedDailyIntraDayChrtComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MixedDailyIntraDayChrtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
