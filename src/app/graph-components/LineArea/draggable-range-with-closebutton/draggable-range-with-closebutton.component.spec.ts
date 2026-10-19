import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DraggableRangeWithClosebuttonComponent } from './draggable-range-with-closebutton.component';

describe('DraggableRangeWithClosebuttonComponent', () => {
  let component: DraggableRangeWithClosebuttonComponent;
  let fixture: ComponentFixture<DraggableRangeWithClosebuttonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DraggableRangeWithClosebuttonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DraggableRangeWithClosebuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
