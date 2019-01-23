import { browser, by, element } from 'protractor';

describe('classicmodels.CustomerShow', function() {

  beforeEach(() => {
    browser.get('/customers/show');
  });

  it('should display message saying CustomerShow', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('CustomerShow');
  });
});

