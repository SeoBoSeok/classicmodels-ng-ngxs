import { browser, by, element } from 'protractor';

describe('classicmodels.ProductlineEdit', function() {

  beforeEach(() => {
    browser.get('/productlines/edit');
  });

  it('should has items...', () => {
    expect(element(by.name('productLine'))).not.toBeNull();
    expect(element(by.name('textDescription'))).not.toBeNull();
    expect(element(by.name('htmlDescription'))).not.toBeNull();
  });
});

