import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Posts, Comments } from '../imports/api/collections.js';
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
  this.autorun(() => {
    this.subscribe('comments', this._id);
  });
});

Template.postItem.helpers({
  commentsForPost() {
    return Comments.find({postId: this._id}, {sort: {createdAt: -1}});
  }
});

Template.postItem.events({
  'click .upvote'(event, template) {
    event.preventDefault();
    Meteor.call('posts.upvote', this._id);
  },
  
  'submit .comment-form'(event, template) {
    event.preventDefault();
    
    const text = event.target.text.value;
    
    if (text.trim()) {
      Meteor.call('comments.insert', this._id, text);
      event.target.text.value = '';
    }
  }
});

// Post submit template
Template.postSubmit.events({
  'submit .post-submit'(event, template) {
    event.preventDefault();
    
    const title = event.target.title.value;
    const url = event.target.url.value;
    
    Meteor.call('posts.insert', title, url);
    
    // Clear form
    event.target.title.value = '';
    event.target.url.value = '';
  }
});