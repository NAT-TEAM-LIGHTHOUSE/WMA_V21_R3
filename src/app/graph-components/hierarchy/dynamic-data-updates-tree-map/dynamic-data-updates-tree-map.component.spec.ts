import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DynamicDataUpdatesTreeMapComponent } from './dynamic-data-updates-tree-map.component';

describe('DynamicDataUpdatesTreeMapComponent', () => {
  let component: DynamicDataUpdatesTreeMapComponent;
  let fixture: ComponentFixture<DynamicDataUpdatesTreeMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicDataUpdatesTreeMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicDataUpdatesTreeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
