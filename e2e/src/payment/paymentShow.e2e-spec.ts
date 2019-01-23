import { browser, by, element } from 'protractor';

describe('classicmodels.PaymentShow', function() {

  beforeEach(() => {
    browser.get('/payments/show');
  });

  it('should display message saying PaymentShow', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('PaymentShow');
  });
});

