import { browser, by, element } from 'protractor';

describe('classicmodels.CustomerPaymentStatistic', function() {

  beforeEach(() => {
    browser.get('/customers/statistics');
  });

  it('should display message saying CustomerPaymentStatistic', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('CustomerPaymentStatistic');
  });
});

