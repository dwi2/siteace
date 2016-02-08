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
  console.log(user);
  return (user && user._id && user.username);
}
