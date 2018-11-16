const BASE_URL = 'https://hack-or-snooze-v2.herokuapp.com';

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  // static is a function that is defined directly on the class and not the instance.
  static getStories(cb) {
    // fetch stories from API
    $.getJSON(`${BASE_URL}/stories`, function(response) {
      // stories is a mapped array of Story instances, which are objects
      const stories = response.stories.map(function(story) {
        //one by one take out value of these variable from story object and assign them to new values
        const { username, title, author, url, storyId } = story;
        return new Story(username, title, author, url, storyId);
      });
      const storyList = new StoryList(stories);
      return cb(storyList);
    });
  }

  // accept three parameters, the user logged in,  an obj with data about a new story and a callback funtion
  // 1. add a story, 2. invoke  user.retrieveDetails function to upfate ownStories' property

  addStory(user, dataObj, cb) {
    // add a story
    console.log(user);
    $.post(
      `${BASE_URL}/stories`,
      {
        token: user.loginToken,
        story: {
          author: dataObj.author,
          title: dataObj.title,
          url: dataObj.url
        }
      },
      res => {
        const { author, title, url, username, storyId } = res.story;
        const newStory = new Story(author, title, url, username, storyId);
        this.stories.push(newStory);
        this.stories.push(newStory);
        user.retrieveDetails(() => cb(this)
          // add the story into the ownstory list
          //console.log(newStory);
        );
      });
  }

  // pass in  an id of a story, and a callback function to remove(),
  //Need to figure out how to access the user id and ###
  removeStory(storyId, cb) {
    $.ajax({
      url: `${BASE_URL}/stories/${storyId}`,
      method: 'DELETE',
      data: {
        token: user.loginToken
      },
      success: () => {
        //if story never found, nothing will be deleted
        const storyIndex = this.stories.findIndex(
          story => story.storyId === storyId
        );
        //find index loops through stories in JS memory and deletes the one with the corresponding index
        //retrieve details then updates the memory
        this.stories.splice(storyIndex, 1);
        user.retrieveDetails(() => cb(this));
      }
    });
  }
}

class User {
  constructor(username, password, name, createdAt, updatedAt) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.loginToken = '';
    this.favorites = [];
    this.ownStories = [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(username, password, name, cb) {
    // to create a new user, token: xxx, "user":{name, username, password}
    $.post(
      `${BASE_URL}/signup`,
      { user: { name, username, password } },
      function(response) {
        const { username, name } = response.user;
        const newUser = new User(username, password, name);
        localStorage.setItem('TOKEN', response.token);
        // do what's in login
        // in localStorage, set a key for your username
        // and a key for your token that match
        // what you're doing at the top of hack-or-snooze.js
        newUser.loginToken = response.token;
        return cb(newUser);
      }
    );
  }

  login(cb) {
    // need username, password to login $.post() function
    $.post(
      `${BASE_URL}/login`,
      { user: { username: this.username, password: this.password } },
      res => {
        //use arrow function because 'this' needs to refer to the instance and not the function scope
        this.loginToken = res.token;
        localStorage.setItem(this.username, this.loginToken);
        localStorage.setItem('username', this.username);
        localStorage.setItem('name', this.name);

        return cb(this);
      }
    );
  }

  retrieveDetails(cb) {
    //a function that retrieves details about one user and returns a callback that does something with the instance
    $.ajax({
      url: `${BASE_URL}/users/${this.username}`,
      data: { token: this.loginToken },
      success: res => {
        console.log("RETRIEVE DETAILS RES", res);
        this.favorites = res.user.favorites;
        this.ownStories = res.user.stories;
        // this.stories = res.user.stories <-- option 1
        // this.ownStories = res.user.stories <-- option 2
        this.createdAt = res.user.createdAt;
        this.updatedAt = res.user.updatedAt;
        this.name = res.user.name;
        return cb(this);
      }
    });
  }
  //? how to use callback function
  addFavorite(storyId, cb) {
    // add a sotory to favorites
    $.post(
      `${BASE_URL}/users/${this.username}/favorites/${storyId}`,
      { token: this.loginToken },
      () => this.retrieveDetails(() => cb(this))
    );
  }

  removeFavorite(storyId, cb) {
    $.ajax({
      url: `${BASE_URL}/users/${this.username}/favorites/${storyId}`,
      data: { token: this.loginToken },
      method: 'DELETE',
      success: () => {
        this.retrieveDetails(() => cb(this));
      }
    });
  }

  update(dataObj, cb) {
    $.ajax({
      url: `${BASE_URL}/users/${this.username}`,
      method: 'PATCH',
      token: this.loginToken,
      data: {
        user: dataObj,
        token: this.loginToken
      },
      success: res => {
        this.name = res.user.name;
        return cb(this);
      }
    });
  }

  remove(cb) {
    $.ajax({
      url: `${BASE_URL}/users/${this.username}`,
      data: { token: this.loginToken },
      method: 'DELETE',
      success: cb
    });
  }
}

class Story {
  //instead of individual variables, you could pass in a data Obj with the corresponding keys to the constructor
  constructor(author, title, url, username, storyId) {
    this.author = author;
    this.title = title;
    this.url = url;
    this.username = username;
    this.storyId = storyId;
  }

  update(user, dataObj, cb) {
    $.ajax({
      url: `${BASE_URL}/users/${user}`,
      method: 'PATCH',
      data: {
        token: user.loginToken,
        story: dataObj
      },
      success: res => {
        const { author, title, url } = res.story;
        this.author = author;
        this.title = title;
        this.url = url;
        return cb(this);
      }
    });
  }
}
