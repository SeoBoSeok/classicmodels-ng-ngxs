import { browser, by, element } from 'protractor';

describe('classicmodels.OrderdetailEdit', function() {

  beforeEach(() => {
    browser.get('/orderdetails/edit');
  });

  it('should has items...', () => {
    expect(element(by.name('quantityOrdered'))).not.toBeNull();
    expect(element(by.name('priceEach'))).not.toBeNull();
    expect(element(by.name('orderLineNumber'))).not.toBeNull();
  });
});

