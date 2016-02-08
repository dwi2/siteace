Meteor.methods({
  getMeta: function(url, callback) {
    // make it async, because Metainspector doesn't support async invokation
    this.unblock();
    var urlObject = Iron.Url.parse(url);
    if (!urlObject || !urlObject.host || !urlObject.rootUrl) {
      throw new Meteor.Error('not-url', url + ' is not url!');
    }
    return Metainspector.fetch(url);
  }
});