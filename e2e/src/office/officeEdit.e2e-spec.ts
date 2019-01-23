import { browser, by, element } from 'protractor';

describe('classicmodels.OfficeEdit', function() {

  beforeEach(() => {
    browser.get('/offices/edit');
  });

  it('should has items...', () => {
    expect(element(by.name('officeCode'))).not.toBeNull();
    expect(element(by.name('city'))).not.toBeNull();
    expect(element(by.name('phone'))).not.toBeNull();
    expect(element(by.name('addressLine1'))).not.toBeNull();
    expect(element(by.name('addressLine2'))).not.toBeNull();
    expect(element(by.name('state'))).not.toBeNull();
    expect(element(by.name('country'))).not.toBeNull();
    expect(element(by.name('postalCode'))).not.toBeNull();
    expect(element(by.name('territory'))).not.toBeNull();
  });
});

