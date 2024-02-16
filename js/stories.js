"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
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
        <i class="bi bi-star"></i>
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

/* EventListener for the form's submit button */
$newStory.on("submit", getNewStory);
