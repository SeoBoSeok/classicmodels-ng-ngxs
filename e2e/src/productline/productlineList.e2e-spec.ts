import { browser, by, element } from 'protractor';

describe('classicmodels.ProductlineList', function() {

  beforeEach(() => {
    browser.get('/productlines/list');
  });

  it('should display message saying ProductlineList', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('ProductlineList');
  });
});

