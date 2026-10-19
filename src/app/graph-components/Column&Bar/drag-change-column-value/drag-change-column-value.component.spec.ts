import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DragChangeColumnValueComponent } from './drag-change-column-value.component';

describe('DragChangeColumnValueComponent', () => {
  let component: DragChangeColumnValueComponent;
  let fixture: ComponentFixture<DragChangeColumnValueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DragChangeColumnValueComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DragChangeColumnValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
