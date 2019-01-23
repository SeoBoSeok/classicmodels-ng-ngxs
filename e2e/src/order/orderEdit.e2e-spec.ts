import { browser, by, element } from 'protractor';

describe('classicmodels.OrderEdit', function() {

  beforeEach(() => {
    browser.get('/orders/edit');
  });

  it('should has items...', () => {
    expect(element(by.name('orderNumber'))).not.toBeNull();
    expect(element(by.name('orderDate'))).not.toBeNull();
    expect(element(by.name('requiredDate'))).not.toBeNull();
    expect(element(by.name('shippedDate'))).not.toBeNull();
    expect(element(by.name('status'))).not.toBeNull();
    expect(element(by.name('comments'))).not.toBeNull();
  });
});

