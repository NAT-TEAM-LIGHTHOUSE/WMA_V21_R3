import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DraggingPieSlicesComponent } from './dragging-pie-slices.component';

describe('DraggingPieSlicesComponent', () => {
  let component: DraggingPieSlicesComponent;
  let fixture: ComponentFixture<DraggingPieSlicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DraggingPieSlicesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DraggingPieSlicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
