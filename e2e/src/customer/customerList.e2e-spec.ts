import { browser, by, element } from 'protractor';

describe('classicmodels.CustomerList', function() {

  beforeEach(() => {
    browser.get('/customers/list');
  });

  it('should display message saying CustomerList', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('CustomerList');
  });
});

