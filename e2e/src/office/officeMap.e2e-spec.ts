import { browser, by, element } from 'protractor';

describe('classicmodels.OfficeMap', function() {

  beforeEach(() => {
    browser.get('/offices/map');
  });

  it('should display message saying OfficeMap', () => {
    expect(element(by.tagName('h3')).getText()).toEqual('OfficeMap');
  });
});

