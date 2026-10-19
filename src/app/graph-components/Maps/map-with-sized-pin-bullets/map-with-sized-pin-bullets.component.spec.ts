import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapWithSizedPinBulletsComponent } from './map-with-sized-pin-bullets.component';

describe('MapWithSizedPinBulletsComponent', () => {
  let component: MapWithSizedPinBulletsComponent;
  let fixture: ComponentFixture<MapWithSizedPinBulletsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapWithSizedPinBulletsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapWithSizedPinBulletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
