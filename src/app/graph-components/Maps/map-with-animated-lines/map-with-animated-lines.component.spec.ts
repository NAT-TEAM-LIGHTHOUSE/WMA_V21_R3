import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapWithAnimatedLinesComponent } from './map-with-animated-lines.component';

describe('MapWithAnimatedLinesComponent', () => {
  let component: MapWithAnimatedLinesComponent;
  let fixture: ComponentFixture<MapWithAnimatedLinesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapWithAnimatedLinesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapWithAnimatedLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
