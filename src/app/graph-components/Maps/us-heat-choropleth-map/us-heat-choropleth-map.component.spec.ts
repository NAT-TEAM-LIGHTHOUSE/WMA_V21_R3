import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsHeatChoroplethMapComponent } from './us-heat-choropleth-map.component';

describe('UsHeatChoroplethMapComponent', () => {
  let component: UsHeatChoroplethMapComponent;
  let fixture: ComponentFixture<UsHeatChoroplethMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsHeatChoroplethMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsHeatChoroplethMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
