/// config acounts-ui
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

/// routing
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('navbar', {to:'navbar'});
  this.render('websites', {to:'main'});
});


Router.route('/item/:_id', function () {
  this.render('navbar', {to:"navbar"});
  this.render('comments', {
    to:"main",
    data: function() {
      return Websites.findOne({_id:this.params._id});
    }
  });
});

/////
// template helpers
/////

// helper function that returns all available websites
Template.website_list.helpers({
	websites: function() {
		return Websites.find({}, {sort: {vote: -1}});
	}
});

Template.website_item.helpers({
  commentNumber: function() {
    var website_id = this._id;
    var commentCount = Comments.find({website_id: website_id}).count();
    var result = commentCount > 1 ?
      commentCount + ' comments' : commentCount + ' comment';
    return result;
  },
  author: function() {
    if (this.createdBy) {
      return this.createdBy.username;
    } else {
      return 'system';
    }
  }
});

Template.comment_list.helpers({
  comments: function() {
    return Comments.find({website_id: this.website_id}, {sort: {createdOn: 1}});
  },
  hasAnyComments: function() {
    var result = Comments.find({website_id: this.website_id}, {limit: 1});
    return result.count() > 0;
  }
});

Template.comment_item.helpers({
  author: function() {
    return this.createdBy.username;
  }
});

Template.comment_form.onRendered(function() {
  $('#comment-alert').addClass('hidden').text('Cannot post empty comment');
});

/////
// template events
/////

Template.websites.events({
  "click .js-toggle-website-form":function(event){
    $("#website_form").toggle('fast', function(d) {
      if (this.style.display === 'none') {
        cleanWebsiteForm();
      }
    });
  }
});

Template.website_item.events({
	"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
    if (Meteor.user()) {
      Websites.update({_id: website_id}, {$inc: {vote: 1}});
    }
		return false;// prevent the button from reloading the page
	},
	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		// put the code in here to remove a vote from a website!
    if (Meteor.user()) {
      Websites.update({_id: website_id}, {$inc: {vote: -1}});
    }

		return false;// prevent the button from reloading the page
	}
})

Template.website_form.events({
	"submit .js-save-website-form":function(event){
		var url = event.target.url.value;
    var urlElem = $('#url');
    var titleElem = $('#title');
    var descriptionElem = $('#description');
    var title = titleElem.val();
    var description = descriptionElem.val();
    var hasNoError = true;

    urlElem.parent().removeClass('has-error');
    descriptionElem.parent().removeClass('has-error');

    if (!url || url.length === 0) {
      urlElem.parent().addClass('has-error');
      hasNoError = false;
    }
    if (!description || description.length === 0) {
      descriptionElem.parent().addClass('has-error');
      hasNoError = false;
    }

    if (Meteor.user() && hasNoError) {
      Websites.insert({
        title: title || '',
        url: url,
        description: description,
        vote: 0,
        createdBy: Meteor.user(),
        createdOn: new Date()
      });
      $("#website_form").hide(function() {
        cleanWebsiteForm();
      });
    }

		return false;// stop the form submit from reloading the page
	},
  "click .js-cancel-save-website-form": function(evt) {
    $("#website_form").hide(function() {
      cleanWebsiteForm();
    });
    return false;
  }
});

Template.comment_form.events({
  "submit .js-save-comment-form": function(evt) {
    var comment = $('#comment').val();
    var website_id = this.website_id;
    if (Meteor.user() && website_id) {
      if (comment && comment.length > 0) {
        Comments.insert({
          website_id: website_id,
          comment: comment,
          createdBy: Meteor.user(),
          createdOn: new Date()
        }, function(err, id) {
          if (id) {
            $('#comment-alert').addClass('hidden').text('Cannot post empty comment');
            $('#comment').val('');
          } else {
            $('#comment-alert').removeClass('hidden').text(err);
          }
        });
      } else {
        $('#comment-alert').removeClass('hidden').text('Cannot post empty comment');
      }
    }
    return false;
  }
});


var cleanWebsiteForm = function() {
  $('#url').val('').parent().removeClass('has-error');
  $('#title').val('').parent().removeClass('has-error');
  $('#description').val('').parent().removeClass('has-error');
}
// Challenge 1: automatic info
// fetch web content and retrieve
// 1. content of meta[property="og:description"]
// 2. content of meta[name="twitter:description"]
// 3. title
//
// e.g.
// <meta property="og:description" content="開發一款 APP 遠比你們想像中難得多！ - ">
// <meta name="twitter:description" content="開發一款 APP 遠比你們想像中難得多！ - ">
