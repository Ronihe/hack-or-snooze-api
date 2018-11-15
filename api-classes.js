const BASE_URL = "https://hack-or-snooze-v2.herokuapp.com";

class StoryList {

  constructor(stories){
    this.stories = stories;
  }

  // static is a function that is defined directly on the class and not the instance.
  static getStories(cb) {
    // fetch stories from API
    $.getJSON(`${BASE_URL}/stories`, function(response) {
      const stories = response.stories.map(function(story) {
        const { username, title, author, url, storyId } = story;
        return new Story(username, title, author, url, storyId);
      });
      const storyList = new StoryList(stories);
      return cb(storyList);
    });
  }

// accept three parameters, the user logged in,  an obj with data about a new story and a callback funtion
// 1. add a story, 2. invoke  user.retrieveDetails function to upfate ownStories' property

  add(user, dataObj, cb){

    // add a story
    $.post(`${BASE_URL}/stories`, {"token": user.loginToken, "story":{"author":dataObj.author, "title": dataObj.title, "url": dataObj.url}}, function(res){
        return user.retrieveDetails(cb);
    })

  }

// pass in  an id of a story, and a callback function to remove(), 
//Need to figure out how to access the user id and ###
  remove(storyId, cb){
    $.ajax({
      url: `${BASE_URL}/stories/${storyId}`,
    
      type: "DELETE",
      success: function (res){
        return cb(res);
      }
    })
  }
  

}

class User {
  constructor(username, password, name, loginToken, favorites, ownStories){
    this.username = username;
    this.password = password;
    this.name = name;
    this.loginToken = loginToken;
    this.favorites = favorites;
    this.ownStories = ownStories;

  }

  static create(username, password, name, cb){

// to create a new user, token: xxx, "user":{name, username, password}
    $.post(`${BASE_URL}/signup`, {"user":{"name": name, "username":username, "password":password }}, function(response){
    
      const newuser = new User(username, password, name, response.user.loginToken, response.user.favorites, response.user.ownStories);
      console.log(newuser);
      return cb(newuser);
      })
  }

  login(cb){
// need username, password to login $.post() function  
    $.post(`${BASE_URL}/login`,{"user":{"username": this.username, "password":this.password}}, function(res){
      this.loginToken = res.token;
      return cb(res);
    })
  }


  retrieveDetails(cb){
// $.get(), to get ???
$.ajax(`${BASE_URL}/users/${this.username}`)
  .done(function(res){
    this.favorites = cb(res.user.favorites);
    this.ownStories = cb(res.user.ownStories);
  })
  }
//? how to use callback function
  addFavorite(storyId, cb){
    // add a sotory to favorites
    $.post(`${BASE_URL}/users/${this.username}/favorites/${storyId}`, function(){
      this.retrieveDetails(cb);
    })
  }

  removeFavorite(user, storyId, cb){
    $.ajax({
      url:`${BASE_URL}/users/${this.username}/favorites/${storyId}`,
      token:this.loginToken,
      user:this.user,
      type: "DELETE",
      success: function(res){
        this.retrieveDetails();
      }
    })
  }

  update(){




  }

  remove(){

  }

}



class Story {
  constructor(author, title, url, username, storyId){
    this.author = author;
    this.title = title;
    this.url = url;
    this.username = username;
    this.storyId = storyId;
    
  }

  update(user, dataObj, cb){

    $.ajax(`${BASE_URL}/users/${user}`, dataObj, function(res){

    })

      
  }






}
