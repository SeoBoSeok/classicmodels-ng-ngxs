import { browser, by, element } from 'protractor';

describe('classicmodels.OrderShow', function() {

  beforeEach(() => {
    browser.get('/orders/show');
  });

  it('should display message saying OrderShow', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('OrderShow');
  });
});

