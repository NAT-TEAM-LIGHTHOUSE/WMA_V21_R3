import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnimatedBulletEndSeriesComponent } from './animated-bullet-end-series.component';

describe('AnimatedBulletEndSeriesComponent', () => {
  let component: AnimatedBulletEndSeriesComponent;
  let fixture: ComponentFixture<AnimatedBulletEndSeriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedBulletEndSeriesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimatedBulletEndSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
