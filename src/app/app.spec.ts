import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { Header } from './layout/header/header';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  template: '',
})
class HeaderStub {}

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, HeaderStub],
    })
      .overrideComponent(App, {
        remove: {
          imports: [Header],
        },
        add: {
          imports: [HeaderStub],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header component', () => {
    const header = fixture.debugElement.query(By.css('app-header'));

    expect(header).toBeTruthy();
  });

  it('should render the main application container', () => {
    const main = fixture.debugElement.query(By.css('main.app-main'));

    expect(main).toBeTruthy();
  });

  it('should render router outlet inside the main application container', () => {
    const main = fixture.debugElement.query(By.css('main.app-main'));
    const routerOutlet = main.query(By.directive(RouterOutlet));

    expect(routerOutlet).toBeTruthy();
  });
});
