Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

Websites.allow({
  insert: function(userId, doc) {
    if (!isUserObject(doc.createdBy)) {
      return false;
    }
    return !!Meteor.user();
  },
  update: function(userId, doc) {
    return !!Meteor.user();
  },
  remove: function(userId, doc) {
    return (doc.createdBy && doc.createdBy._id && doc.createdBy._id === userId);
  }
});

Comments.allow({
  insert: function(userId, doc) {
    if (!isUserObject(doc.createdBy)) {
      return false;
    }
    return !!Meteor.user();
  }
});

var isUserObject = function(user) {
  return (user && user._id && user.username);
}
