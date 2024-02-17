"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/* Input: story
Returns: The HTML for the favorite button (icon)

This function checks if the story is a favorite story and returns the corresponding icon
button */

function generateButton(story) {
  let isFavorite = false;
  for (let fav of currentUser.favorites) {
    if (fav.storyId === story.storyId) {
      isFavorite = true;
    }
  }

  if (isFavorite) {
    return `<i id='filled-star' class="bi bi-star-fill"></i>`;
  } else {
    return `<i id='empty-star' class="bi bi-star"></i>`;
  }

}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        ${generateButton(story)}
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  for (let story of storyList.stories) {

    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** This function is called when users submit the form.
 * - gets the data from the form,
 * TODO> Remove next line
 * - calls  the .addStory method
 * - then puts that new story on the page.

 */
async function getNewStory(evt) {
  evt.preventDefault();

  const author = $("#author-name").val();
  const title = $("#title").val();
  const url = $("#url").val();

  const $dataStory = await storyList.addStory(currentUser, {
    author,
    title,
    url,
  });

  const $story = generateStoryMarkup($dataStory);
  $allStoriesList.prepend($story);

  $newStory.hide();
}

/** when icon is clicked, toggles between a empty star and a filled star  */

function clickFavoriteHandler(evt) {
  const $closest = $(evt.target).closest('i');

  if ($closest.hasClass("bi-star")) {
    $closest.removeClass("bi-star").addClass('bi-star-fill');
    addFavoriteStory(evt);
  } else {
    $closest.removeClass("bi-star-fill").addClass('bi-star');
    removeFavoriteStory(evt);
  }

}

/** adds the Story instance with the favorited story to the list  */

function addFavoriteStory(evt) {
  let selectedStory;
  let storyId = evt.target.closest('li').id;

  for (let story of storyList.stories) {
    if (story.storyId === storyId) {
      selectedStory = story;
    }
  }

  currentUser.addFavorite(selectedStory);
  console.log('currentUser: ', currentUser.favorites);
}

/** removes the Story instance with the un-favorited story from the list  */

function removeFavoriteStory(evt) {
  let selectedStory;
  let storyId = evt.target.closest('li').id;

  for (let story of storyList.stories) {
    if (story.storyId === storyId) {
      selectedStory = story;
    } else {
      selectedStory = Story.arbitraryStory(storyId);
    }
  }

  currentUser.removeFavorite(selectedStory);
}

/** displays user's favorites in the favorites section */

function displayFavorites() {
  $newStory.hide();
  $allStoriesList.empty();

  currentUser.favorites.map(favStory => {
    const $storyMarkup = generateStoryMarkup(favStory);
    $allStoriesList.append($storyMarkup);
  });

}


/* EventListener for the form's submit button */
$newStory.on("submit", getNewStory);

/* event Listener for favorites (star) button */
$allStoriesList.on('click', $emptyStar, clickFavoriteHandler);

/* event Listener for favorites (star) button */
$navFavorites.on('click', displayFavorites);