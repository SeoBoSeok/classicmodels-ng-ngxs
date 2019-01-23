import { browser, by, element } from 'protractor';

describe('classicmodels.CustomerEdit', function() {

  beforeEach(() => {
    browser.get('/customers/edit');
  });

  it('should has items...', () => {
    expect(element(by.name('customerNumber'))).not.toBeNull();
    expect(element(by.name('customerName'))).not.toBeNull();
    expect(element(by.name('contactLastName'))).not.toBeNull();
    expect(element(by.name('contactFirstName'))).not.toBeNull();
    expect(element(by.name('phone'))).not.toBeNull();
    expect(element(by.name('addressLine1'))).not.toBeNull();
    expect(element(by.name('addressLine2'))).not.toBeNull();
    expect(element(by.name('city'))).not.toBeNull();
    expect(element(by.name('state'))).not.toBeNull();
    expect(element(by.name('postalCode'))).not.toBeNull();
    expect(element(by.name('country'))).not.toBeNull();
    expect(element(by.name('creditLimit'))).not.toBeNull();
  });
});

