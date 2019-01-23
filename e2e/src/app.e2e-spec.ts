import { browser, by, element } from 'protractor';

describe('classicmodels App', function() {

  beforeEach(() => {
    browser.get('/');
  });

  it('should display message saying classicmodels', () => {
    expect(element(by.css('app-root h1')).getText()).toEqual('classicmodels');
  });
});
