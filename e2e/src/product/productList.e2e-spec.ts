import { browser, by, element } from 'protractor';

describe('classicmodels.ProductList', function() {

  beforeEach(() => {
    browser.get('/products/list');
  });

  it('should display message saying ProductList', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('ProductList');
  });
});

