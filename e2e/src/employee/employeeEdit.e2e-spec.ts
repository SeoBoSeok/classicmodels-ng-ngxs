import { browser, by, element } from 'protractor';

describe('classicmodels.EmployeeEdit', function() {

  beforeEach(() => {
    browser.get('/employees/edit');
  });

  it('should has items...', () => {
    expect(element(by.name('employeeNumber'))).not.toBeNull();
    expect(element(by.name('lastName'))).not.toBeNull();
    expect(element(by.name('firstName'))).not.toBeNull();
    expect(element(by.name('extension'))).not.toBeNull();
    expect(element(by.name('email'))).not.toBeNull();
    expect(element(by.name('jobTitle'))).not.toBeNull();
  });
});

