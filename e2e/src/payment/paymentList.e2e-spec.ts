import { browser, by, element } from 'protractor';

describe('classicmodels.PaymentList', function() {

  beforeEach(() => {
    browser.get('/payments/list');
  });

  it('should display message saying PaymentList', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('PaymentList');
  });
});

