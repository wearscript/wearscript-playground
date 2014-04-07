describe('Wearscript Homepage', function() {
  it('should have Wearscript title in top bar', function() {
    browser.get('http://localhost:9000');
    var title = element(by.id('page-title-text')).getText();
    expect(title).toEqual('Wearscript Playground');
  });
});

