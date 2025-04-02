import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Posts = new Mongo.Collection('posts');
export const Comments = new Mongo.Collection('comments');

// Define security rules if not using autopublish
if (Meteor.isServer) {
  // Publications
  Meteor.publish('allPosts', function() {
    return Posts.find({}, {sort: {votes: -1, createdAt: -1}});
  });
  
  Meteor.publish('comments', function(postId) {
    check(postId, String);
    return Comments.find({postId: postId});
  });
}

// Methods
Meteor.methods({
  'posts.insert'(title, url) {
    check(title, String);
    check(url, String);
    
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    const user = Meteor.users.findOneAsync(this.userId);
    const username = user && user.username ? user.username : 
                    (user && user.profile && user.profile.name ? user.profile.name : 
                    (user && user.emails ? user.emails[0].address : 'Anonymous'));
    
    return Posts.insertAsync({
      title,
      url,
      createdAt: new Date(),
      userId: this.userId,
      author: username,
      votes: 0
    });
  },
  
  'posts.upvote'(postId) {
    check(postId, String);
    
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Posts.updateAsync(postId, {$inc: {votes: 1}});
  },
  
  'comments.insert'(postId, text) {
    check(postId, String);
    check(text, String);
    
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    const user = Meteor.users.findOneAsync(this.userId);
    const username = user && user.username ? user.username : 
                    (user && user.profile && user.profile.name ? user.profile.name : 
                    (user && user.emails ? user.emails[0].address : 'Anonymous'));
    
    return Comments.insertAsync({
      postId,
      text,
      createdAt: new Date(),
      userId: this.userId,
      author: username
    });
  }
});