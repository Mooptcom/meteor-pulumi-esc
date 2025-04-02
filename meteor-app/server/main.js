import { Meteor } from 'meteor/meteor';
import { Posts } from '../imports/api/collections.js';

Meteor.startup(() => {
  // If the Posts collection is empty, add some data
  if (Posts.find().countAsync() === 0) {
    const dummyPosts = [
      {
        title: 'Introducing Moopt',
        url: 'https://moopt.com',
        createdAt: new Date(),
        author: 'System',
        votes: 0
      },
      {
        title: 'Discover Moopt',
        url: 'https://linkedin.com/company/moopt',
        createdAt: new Date(),
        author: 'System',
        votes: 0
      }
    ];
    
    dummyPosts.forEach(post => Posts.insertAsync(post));
  }
});