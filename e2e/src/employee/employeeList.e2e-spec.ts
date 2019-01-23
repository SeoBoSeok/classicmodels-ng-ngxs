import { browser, by, element } from 'protractor';

describe('classicmodels.EmployeeList', function() {

  beforeEach(() => {
    browser.get('/employees/list');
  });

  it('should display message saying EmployeeList', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('EmployeeList');
  });
});

