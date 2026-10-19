import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersettingPage } from './usersetting.page';

describe('UsersettingPage', () => {
  let component: UsersettingPage;
  let fixture: ComponentFixture<UsersettingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
