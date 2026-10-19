import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VennDiagramPatternsComponent } from './venn-diagram-patterns.component';

describe('VennDiagramPatternsComponent', () => {
  let component: VennDiagramPatternsComponent;
  let fixture: ComponentFixture<VennDiagramPatternsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VennDiagramPatternsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VennDiagramPatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
