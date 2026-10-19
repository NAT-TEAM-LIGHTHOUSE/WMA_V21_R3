import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NonRibbonChordDiagramComponent } from './non-ribbon-chord-diagram.component';

describe('NonRibbonChordDiagramComponent', () => {
  let component: NonRibbonChordDiagramComponent;
  let fixture: ComponentFixture<NonRibbonChordDiagramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NonRibbonChordDiagramComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NonRibbonChordDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
