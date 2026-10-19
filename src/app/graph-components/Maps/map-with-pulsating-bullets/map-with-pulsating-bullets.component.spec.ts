import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapWithPulsatingBulletsComponent } from './map-with-pulsating-bullets.component';

describe('MapWithPulsatingBulletsComponent', () => {
  let component: MapWithPulsatingBulletsComponent;
  let fixture: ComponentFixture<MapWithPulsatingBulletsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapWithPulsatingBulletsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapWithPulsatingBulletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
