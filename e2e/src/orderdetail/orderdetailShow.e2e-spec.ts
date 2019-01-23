import { browser, by, element } from 'protractor';

describe('classicmodels.OrderdetailShow', function() {

  beforeEach(() => {
    browser.get('/orderdetails/show');
  });

  it('should display message saying OrderdetailShow', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('OrderdetailShow');
  });
});

