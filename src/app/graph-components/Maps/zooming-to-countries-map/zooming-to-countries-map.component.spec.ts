import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ZoomingToCountriesMapComponent } from './zooming-to-countries-map.component';

describe('ZoomingToCountriesMapComponent', () => {
  let component: ZoomingToCountriesMapComponent;
  let fixture: ComponentFixture<ZoomingToCountriesMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomingToCountriesMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ZoomingToCountriesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
