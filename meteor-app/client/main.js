import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Posts } from '../imports/api/collections.js';
import './main.html';

// Subscribe to data
Meteor.startup(() => {
  Meteor.subscribe('allPosts');
});

// Post list template
Template.postsList.helpers({
  posts() {
    return Posts.find({}, {sort: {votes: -1, createdAt: -1}});
  }
});

// Post item template
Template.postItem.onCreated(function() {
  // Use the data context's _id, not this._id
  this.autorun(() => {
    const data = Template.currentData();
  });
});

Template.postItem.events({
  'click .upvote'(event, template) {
    event.preventDefault();
    Meteor.call('posts.upvote', this._id);
  },
});

// Post submit template
Template.postSubmit.events({
  'submit .post-submit'(event, template) {
    event.preventDefault();
    
    const title = event.target.title.value;
    const url = event.target.url.value;
    
    Meteor.call('posts.insert', title, url, (error) => {
      if (error) {
        console.error("Error adding post:", error);
      } else {
        // Clear form
        event.target.title.value = '';
        event.target.url.value = '';
      }
    });
  }
});