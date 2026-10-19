import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrillDownToCountriesComponent } from './drill-down-to-countries.component';

describe('DrillDownToCountriesComponent', () => {
  let component: DrillDownToCountriesComponent;
  let fixture: ComponentFixture<DrillDownToCountriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillDownToCountriesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrillDownToCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
