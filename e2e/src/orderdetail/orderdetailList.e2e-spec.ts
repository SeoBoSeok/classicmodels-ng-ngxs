import { browser, by, element } from 'protractor';

describe('classicmodels.OrderdetailList', function() {

  beforeEach(() => {
    browser.get('/orderdetails/list');
  });

  it('should display message saying OrderdetailList', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('OrderdetailList');
  });
});

