import { Mongo } from 'meteor/mongo';

export const Posts = new Mongo.Collection('posts');
export const Comments = new Mongo.Collection('comments');

// Define security rules if not using autopublish
if (Meteor.isServer) {
  // Publications
  Meteor.publish('allPosts', function() {
    return Posts.find({}, {sort: {votes: -1, createdAt: -1}});
  });
  
  Meteor.publish('comments', function(postId) {
    return Comments.find({postId: postId});
  });
}

// Methods
Meteor.methods({
  'posts.insert'(title, url) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Posts.insert({
      title,
      url,
      createdAt: new Date(),
      userId: this.userId,
      author: Meteor.users.findOne(this.userId).username,
      votes: 0
    });
  },
  
  'posts.upvote'(postId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Posts.update(postId, {$inc: {votes: 1}});
  },
  
  'comments.insert'(postId, text) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Comments.insert({
      postId,
      text,
      createdAt: new Date(),
      userId: this.userId,
      author: Meteor.users.findOne(this.userId).username
    });
  }
});