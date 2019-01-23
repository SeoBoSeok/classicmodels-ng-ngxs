import { browser, by, element } from 'protractor';

describe('classicmodels.OfficeShow', function() {

  beforeEach(() => {
    browser.get('/offices/show');
  });

  it('should display message saying OfficeShow', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('OfficeShow');
  });
});

