import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RotateGlobeSelectedCountryComponent } from './rotate-globe-selected-country.component';

describe('RotateGlobeSelectedCountryComponent', () => {
  let component: RotateGlobeSelectedCountryComponent;
  let fixture: ComponentFixture<RotateGlobeSelectedCountryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RotateGlobeSelectedCountryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RotateGlobeSelectedCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
