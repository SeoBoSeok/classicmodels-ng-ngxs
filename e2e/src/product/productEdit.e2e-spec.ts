import { browser, by, element } from 'protractor';

describe('classicmodels.ProductEdit', function() {

  beforeEach(() => {
    browser.get('/products/edit');
  });

  it('should has items...', () => {
    expect(element(by.name('productCode'))).not.toBeNull();
    expect(element(by.name('productName'))).not.toBeNull();
    expect(element(by.name('productScale'))).not.toBeNull();
    expect(element(by.name('productVendor'))).not.toBeNull();
    expect(element(by.name('productDescription'))).not.toBeNull();
    expect(element(by.name('quantityInStock'))).not.toBeNull();
    expect(element(by.name('buyPrice'))).not.toBeNull();
    expect(element(by.name('msrp'))).not.toBeNull();
  });
});
