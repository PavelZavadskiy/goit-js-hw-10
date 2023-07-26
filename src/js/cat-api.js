import axios from 'axios';

const API_KEY = 'live_3MtvjaxfCd85ScC2ikNowuREIjhAAHg1V9iWGPZtSsNE6U8s3e762ej5c1tvqW42';
axios.defaults.headers.common['x-api-key'] = API_KEY;

function fetchBreeds() {
  return fetch(`https://api.thecatapi.com/v1/breeds?${axios}`).then(response => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  });
}

function fetchCatByBreed(breedId) {
  return fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&api_key=${API_KEY}`).then(response => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  });
}

module.exports = { fetchBreeds, fetchCatByBreed };
