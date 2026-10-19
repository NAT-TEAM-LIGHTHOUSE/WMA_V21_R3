import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnimatedShankeyDiagramComponent } from './animated-shankey-diagram.component';

describe('AnimatedShankeyDiagramComponent', () => {
  let component: AnimatedShankeyDiagramComponent;
  let fixture: ComponentFixture<AnimatedShankeyDiagramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedShankeyDiagramComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimatedShankeyDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
