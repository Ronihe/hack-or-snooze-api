$(function() {
  let currentUser;
  let storyList;
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
      console.log(xyz);
      currentUser = xyz;
      alert(`Thank you ${$username}, you are now logged in`);
    });
    $("#log-in-form").slideToggle();
  });

  $('#submit-button').on('click', function newStory(e) {
    e.preventDefault();
    console.log('hllo');
    let $title = $('#title').val();
    let $author = $('#author').val();
    let $url = $('#url').val();
    let user = localStorage.getItem('username');
    let token = localStorage.getItem(user);
    console.log(token);
    console.log(user);
    //let story = new StoryList();
    storyList.addStory(
      currentUser,
      { author: $author, title: $title, url: $url },
        defaultPage()
    );
    $form.slideToggle();
  });
  $('#title').empty();
  $('#author').empty()
  $('#url').empty()

  defaultPage();
});

// default page
// 1.empty($(ol))2. get the ten sotories from getstorylist, and for loop to creat <li> and append the 10 li in the ol
//
