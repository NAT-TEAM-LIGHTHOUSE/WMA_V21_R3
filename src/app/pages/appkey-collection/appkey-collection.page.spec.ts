import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppkeyCollectionPage } from './appkey-collection.page';

describe('AppkeyCollectionPage', () => {
  let component: AppkeyCollectionPage;
  let fixture: ComponentFixture<AppkeyCollectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppkeyCollectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
