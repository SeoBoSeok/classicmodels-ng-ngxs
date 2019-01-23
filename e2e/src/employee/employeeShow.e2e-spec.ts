import { browser, by, element } from 'protractor';

describe('classicmodels.EmployeeShow', function() {

  beforeEach(() => {
    browser.get('/employees/show');
  });

  it('should display message saying EmployeeShow', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('EmployeeShow');
  });
});

