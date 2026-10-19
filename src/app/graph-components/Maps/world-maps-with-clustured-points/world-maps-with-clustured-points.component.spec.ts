import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorldMapsWithClusturedPointsComponent } from './world-maps-with-clustured-points.component';

describe('WorldMapsWithClusturedPointsComponent', () => {
  let component: WorldMapsWithClusturedPointsComponent;
  let fixture: ComponentFixture<WorldMapsWithClusturedPointsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorldMapsWithClusturedPointsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WorldMapsWithClusturedPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
