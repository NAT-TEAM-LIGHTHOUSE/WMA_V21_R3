import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComparingDifferentDateValuesGoogleAnalyticsStyleComponent } from './comparing-different-date-values-google-analytics-style.component';

describe('ComparingDifferentDateValuesGoogleAnalyticsStyleComponent', () => {
  let component: ComparingDifferentDateValuesGoogleAnalyticsStyleComponent;
  let fixture: ComponentFixture<ComparingDifferentDateValuesGoogleAnalyticsStyleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparingDifferentDateValuesGoogleAnalyticsStyleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComparingDifferentDateValuesGoogleAnalyticsStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
