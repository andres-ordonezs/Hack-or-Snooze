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

  const isFavorite = currentUser.favorites.some((favorite) => {
    console.log("favorite.storyId; ", favorite.storyId);
    console.log("story.storyId: ", story.storyId);
    return favorite.storyId === story.storyId;
  });

  if (isFavorite) {
    return `<i id='empty-star' class="bi bi-star"></i>`;
  } else {
    return `<i id='filled-star' class="bi bi-star-fill"></i>`;
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

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {

    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  console.log("favorites arr: ", currentUser.favorites);
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

function clickFavoriteHandler(evt) {
  const $closest = $(evt.target).closest('i');

  if ($closest.hasClass("bi-star")) {
    $closest.removeClass("bi-star").addClass('bi-star-fill');
    addFavoriteStory(evt);
    console.log("current fav: ", currentUser.favorites);
  } else {
    $closest.removeClass("bi-star-fill").addClass('bi-star');
    removeFavoriteStory(evt);
    console.log("removed fav: ", currentUser.favorites);
  }

}

function addFavoriteStory(evt) {
  let selectedStory;
  let storyId = evt.target.closest('li').id;

  for (let story of storyList.stories) {
    if (story.storyId === storyId) {
      selectedStory = story;
    }
  }

  currentUser.addFavorite(selectedStory);
}

function removeFavoriteStory(evt) {
  let selectedStory;
  let storyId = evt.target.closest('li').id;

  for (let story of storyList.stories) {
    if (story.storyId === storyId) {
      selectedStory = story;
    }
  }

  currentUser.removeFavorite(selectedStory);
}


/* EventListener for the form's submit button */
$newStory.on("submit", getNewStory);


/* event Listener for favorites (star) button */
$allStoriesList.on('click', $emptyStar, clickFavoriteHandler);