import { browser, by, element } from 'protractor';

describe('classicmodels.PaymentEdit', function() {

  beforeEach(() => {
    browser.get('/payments/edit');
  });

  it('should has items...', () => {
    expect(element(by.name('checkNumber'))).not.toBeNull();
    expect(element(by.name('paymentDate'))).not.toBeNull();
    expect(element(by.name('amount'))).not.toBeNull();
  });
});

