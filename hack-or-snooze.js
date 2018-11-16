




$(function() {
  //let currentUser;
  //let storyList;\

  let user;
  let storyList;
  let username =localStorage.getItem("username");
  let token = localStorage.getItem(username);
  let currentUser;

  
  // how to have the user instance when we first load the page,
  // we know there is a user logged in, let's get his all details
  if(token && username){
    currentUser= new User(username);
    currentUser.loginToken = token;
    currentUser.retrieveDetails(userWithAllDetails => {
      console.log("USER IS ALREADY LOGGED IN", userWithAllDetails);
      currentUser = userWithAllDetails;
    })
  }

  let $submit = $('#submit');
  let $favorites = $('#favorites');
  let $form = $('#form');
  let $ol = $('#ol');
  let $all = $('#all');
  let $title = $('#title');
  let $url = $('#url');

  $submit.on('click', function() {
    $form.slideToggle();
  });

  $("#toggle-sign-up").on('click',function(){
    $("#sign-up-form").slideToggle();
  })

  $("#toggle-log-in").on('click',function(){
    $("#log-in-form").slideToggle();
  })

  $ol.on('click', '.far, .fas', function(event) {
    $(event.target).toggleClass('far fas');
    if ($(event.target).hasClass('fas')) {
      //console.log(event.target.id);
      currentUser.addFavorite(`${event.target.id}`, user => {
        console.log(user);
      });
    } else if ($(event.target).hasClass('far')) {
      currentUser.removeFavorite(`${event.target.id}`, user => {
        console.log(user);
      });
    }
  });

  // $form.on('submit', function(event) {
  //   event.preventDefault();
  //   // list span a small
  //   let title = $title.val();
  //   let urlValue = $url.val();

  //   let $span = $('<span>').addClass('far fa-star');
  //   let $a = $('<a>')
  //     .attr(`href`, urlValue)
  //     .text(` ${title} `);

  //   let hostname = $a
  //     .prop('hostname')
  //     .split('.')
  //     .slice(-2)
  //     .join('.');

  //   let $small = $('<small>').text(` (${hostname})`);
  //   let $list = $('<li>').addClass('py-1');

  //   $list.append($span, $a, $small);
  //   $ol.append($list);
  // });
//refactor 
  $favorites.on('click', function(event) {
    $('.far')
      .parent()
      .addClass('hidden');
    $('.fas')
      .parent()
      .addClass('hidden-list');
    $favorites.addClass('hidden');
    $all.toggleClass('hidden');
  });

  $all.on('click', function(event) {
    $('.hidden').removeClass('hidden');
    $('.hidden-list').removeClass('hidden-list');
    $all.addClass('hidden');
  });

  $ol.on('click', 'small', function(event) {
    $favorites.addClass('hidden');
    $all.removeClass('hidden');
    $.each($('small'), (index, value) => {
      if ($(value).text() !== $(event.target).text()) {
        $(value)
          .parent()
          .addClass('hidden');
      } else
        $(value)
          .parent()
          .addClass('hidden-list');
    });
  });

  //Starting class list functionality
  function defaultPage() {
    $('ol').empty();
    StoryList.getStories(story => {
      storyList = story;
      for (let i = 0; i < 10; i++) {
        let listItem = $(
          `<li class='py-1'><span id=${
            story.stories[i].storyId
          } class="far fa-star"></span> <a href="${story.stories[i].url}">${
            story.stories[i].title
          }</a> <small>(${story.stories[i].url})</small></li>`
        );
        $('ol').append(listItem);
      }
    });
  }

  $('#sign-up').on('click', function signUp(e) {
    e.preventDefault();

    let $username = $('#sign-up-username').val();
    let $name = $('#sign-up-name').val();
    let $password = $('#sign-up-password').val();
    console.log($username);
    console.log($password);
    console.log($name);

    User.create($username, $password, $name, taco => {
      console.log(taco);
      currentUser = taco;
      alert('You have successfully signed up!');
    });
    $("#sign-up-form").slideToggle();
  });

  $('#log-in').on('click', function logIn(e) {
    e.preventDefault();
    console.log('hello');
    let $username = $('#log-in-username').val();
    //let $name = $('#name').val();
    let $password = $('#log-in-password').val();
    let newUser = new User($username, $password);
    newUser.login(xyz => {
      console.log("xyz", xyz);
      currentUser = xyz;
      currentUser.retrieveDetails(currentUserwithAllDetail => {
        currentUser = currentUserwithAllDetail;
        console.log("latest currentUser", currentUser);
      })
    });
    $("#log-in-form").slideToggle();
  });

  $('#submit-button').on('click', function newStory(e) {
    e.preventDefault();
    let $title = $('#title').val();
    let $author = $('#author').val();
    let $url = $('#url').val();

    // console.log(token);
    console.log(currentUser);
    //let story = new StoryList();
    storyList.addStory(
      currentUser,
      { author: $author, title: $title, url: $url },
        ()=>{
          defaultPage();
        alert(`created a new, ${currentUser}`);
        // add the story to theown story list 
    $form.slideToggle();
    $('#title').empty();
    $('#author').empty()
    $('#url').empty()
  });
});


  $('#log-out').on('click', function(e) {
    e.preventDefault();
    currentUser = undefined;
    localStorage.clear();
  });

  $('#my-profile').on('click', function(e) {
    e.preventDefault();
    alert(
      `Username: ${currentUser.username}, Name: ${currentUser.name}`
    );
  });

  defaultPage();
});

