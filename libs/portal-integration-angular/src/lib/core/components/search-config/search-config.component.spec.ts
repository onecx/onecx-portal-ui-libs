import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchConfigComponent } from './search-config.component';

describe('SearchConfigComponent', () => {
  let component: SearchConfigComponent;
  let fixture: ComponentFixture<SearchConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
