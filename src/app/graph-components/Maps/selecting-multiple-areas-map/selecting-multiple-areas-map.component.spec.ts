import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectingMultipleAreasMapComponent } from './selecting-multiple-areas-map.component';

describe('SelectingMultipleAreasMapComponent', () => {
  let component: SelectingMultipleAreasMapComponent;
  let fixture: ComponentFixture<SelectingMultipleAreasMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectingMultipleAreasMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectingMultipleAreasMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
