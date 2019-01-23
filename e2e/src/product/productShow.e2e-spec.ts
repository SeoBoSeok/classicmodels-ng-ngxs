import { browser, by, element } from 'protractor';

describe('classicmodels.ProductShow', function() {

  beforeEach(() => {
    browser.get('/products/show');
  });

  it('should display message saying ProductShow', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('ProductShow');
  });
});
