import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForceDirectedTreeAnmBulletsComponent } from './force-directed-tree-anm-bullets.component';

describe('ForceDirectedTreeAnmBulletsComponent', () => {
  let component: ForceDirectedTreeAnmBulletsComponent;
  let fixture: ComponentFixture<ForceDirectedTreeAnmBulletsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceDirectedTreeAnmBulletsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForceDirectedTreeAnmBulletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
