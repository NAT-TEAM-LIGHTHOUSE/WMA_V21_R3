import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ZoombleForceDirTreeComponent } from './zoomble-force-dir-tree.component';

describe('ZoombleForceDirTreeComponent', () => {
  let component: ZoombleForceDirTreeComponent;
  let fixture: ComponentFixture<ZoombleForceDirTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoombleForceDirTreeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ZoombleForceDirTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
