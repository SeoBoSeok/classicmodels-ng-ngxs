import { browser, by, element } from 'protractor';

describe('classicmodels.OfficeList', function() {

  beforeEach(() => {
    browser.get('/offices/list');
  });

  it('should display message saying OfficeList', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('OfficeList');
  });
});

