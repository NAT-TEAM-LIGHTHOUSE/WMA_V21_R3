import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapAnimatedBubblesComponent } from './map-animated-bubbles.component';

describe('MapAnimatedBubblesComponent', () => {
  let component: MapAnimatedBubblesComponent;
  let fixture: ComponentFixture<MapAnimatedBubblesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapAnimatedBubblesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapAnimatedBubblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
