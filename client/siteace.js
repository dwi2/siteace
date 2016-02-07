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
  comments: function() {
    var website_id = this._id;
    var commentCount = Comments.find({website_id: website_id}).count();
    var result = commentCount > 1 ?
      commentCount + ' comments' : commentCount + ' comment';
    return result;
  }
});

/////
// template events
/////

Template.navbar.events({
  "click .js-toggle-website-form":function(event){
    $("#website_form").toggle('slow');
  },
});

Template.website_item.events({
	"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		console.log("Up voting website with id "+website_id);
    if (Meteor.user()) {
      Websites.update({_id: website_id}, {$inc: {vote: 1}});
    }
		return false;// prevent the button from reloading the page
	},
	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		console.log("Down voting website with id "+website_id);

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
    var title = $('#title').val();
    var description = $('#description').val();
    if (Meteor.user() && url && url.length > 0 &&
        description && description.length > 0) {
      Websites.insert({
        title: title || '',
        url: url,
        description: description,
        vote: 0,
        createdOn: new Date()
      });
    }
    $("#website_form").hide();
		return false;// stop the form submit from reloading the page

	}
});


// Challenge 1: automatic info
// fetch web content and retrieve
// 1. content of meta[property="og:description"]
// 2. content of meta[name="twitter:description"]
// 3. title
//
// e.g.
// <meta property="og:description" content="開發一款 APP 遠比你們想像中難得多！ - ">
// <meta name="twitter:description" content="開發一款 APP 遠比你們想像中難得多！ - ">
