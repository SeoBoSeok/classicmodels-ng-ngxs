import { browser, by, element } from 'protractor';

describe('classicmodels.OrderList', function() {

  beforeEach(() => {
    browser.get('/orders/list');
  });

  it('should display message saying OrderList', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('OrderList');
  });
});

