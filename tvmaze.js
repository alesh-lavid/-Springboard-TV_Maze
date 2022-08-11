"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get('http://api.tvmaze.com/search/shows', {params: {q: term}});
  const shows = [];

  for(let show of res.data){
    if (show.show.image == null) show.show.image = '';
    shows.push({
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image.original
    })
  }
   return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {

    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>  
       </div>
      `);
    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }
async function getEpisodesOfShow(id){
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const showEpisodes = [];

  for(let episode of res.data){
    showEpisodes.push({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    })
  }

  return showEpisodes;
}

/** Write a clear docstring for this function... */
/*
  Given a shows episode list, append a new LI to a doom list.
*/
// function populateEpisodes(episodes) { }
function populateEpisodes(episodes){
  const episodeList = $('#episodes-list');
  episodeList.empty();

  for(let episode of episodes){
    episodeList.append(`<li>${episode.name}, (season ${episode.season}, number${episode.number})</li>`)
  }
}

$('#shows-list').on('click', '.get-episodes', async (e)=> {
  $('#episodes-area').css('display', 'inline-block')
  const showID = $(e.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showID) 
  populateEpisodes(episodes);
});

