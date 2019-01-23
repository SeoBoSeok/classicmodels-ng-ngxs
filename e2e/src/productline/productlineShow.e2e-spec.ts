import { browser, by, element } from 'protractor';

describe('classicmodels.ProductlineShow', function() {

  beforeEach(() => {
    browser.get('/productlines/show');
  });

  it('should display message saying ProductlineShow', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('ProductlineShow');
  });
});

