import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const API_KEY = 'live_3MtvjaxfCd85ScC2ikNowuREIjhAAHg1V9iWGPZtSsNE6U8s3e762ej5c1tvqW42';
axios.defaults.headers.common['x-api-key'] = API_KEY;

const breedSelect = document.querySelector('.breed-select');

const catInfo = document.querySelector('.cat-info');
catInfo.classList.add('visually-hidden');
const loader = document.querySelector('.loader');
loader.classList.add('visually-hidden');
const errorText = document.querySelector('.error');
errorText.classList.add('visually-hidden');

const select = new SlimSelect({
  select: breedSelect,
  settings: {
    disabled: false,
    alwaysOpen: false,
    showSearch: true,
    searchPlaceholder: 'Search',
    searchText: 'No Results',
    searchingText: 'Searching...',
    searchHighlight: false,
    closeOnSelect: true,
    contentLocation: document.body,
    contentPosition: 'absolute',
    openPosition: 'auto',
    placeholderText: 'Select cat',
    allowDeselect: false,
    hideSelected: false,
    showOptionTooltips: false,
    // allowDeselect: true,
    // minSelected: 0,
    // maxSelected: 1000,
    // timeoutDelay: 200,
    // maxValuesShown: 20,
    // maxValuesMessage: '{number} selected',
  },
  events: {
    afterChange: newVal => {
      if (newVal[0].value.length > 0) {
        removeChildren(catInfo);
        fetchCatByBreed(newVal[0].value)
          .then(posts => renderPosts(posts))
          .catch(error => console.log(error));
      } else {
        catInfo.classList.add('visually-hidden');
      }
    },
  },
});

fetchBreeds()
  .then(posts => renderFetchBreeds(posts))
  .catch(error => console.log(error));

function fetchBreeds() {
  requestStart();
  return fetch(`https://api.thecatapi.com/v1/breeds?${axios}`)
    .then(response => {
      requestFinish();
      if (!response.ok) {
        requestWrong();
        Notify.failure(`Request rejected: ${response.status}`);
        // throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      requestWrong();
      Notify.failure(`Request rejected: ${error.status}`);
    });
}

function renderFetchBreeds(posts) {
  let arrSelected = [{ text: '', placeholder: true }];
  posts.forEach(element => {
    arrSelected.push({ text: element.name, value: element.id });
  });
  select.setData(arrSelected);
}

function fetchCatByBreed(breedId) {
  requestStart();
  return fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&api_key=${API_KEY}`)
    .then(response => {
      requestFinish();
      if (!response.ok) {
        requestWrong();
        Notify.failure(`Request rejected: ${response.status}`);
        // throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      requestWrong();
      Notify.failure(`Request rejected: ${error.status}`);
    });
}

function renderPosts(posts) {
  const markup = posts
    .map(posts => {
      return `<div class="cat-item-card">
                <img class="cat-img" src="${posts.url}" />
              </div>
              <div class="cat-item-card">
                <h1 class="cat-title">${posts.breeds[0].name}</h1>
                <p>${posts.breeds[0].temperament}</p>
                <p>${posts.breeds[0].description}</p>
              </div>`;
    })
    .join('');

  catInfo.insertAdjacentHTML('afterbegin', markup);
}

function removeChildren(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function requestStart() {
  loader.classList.remove('visually-hidden');
  breedSelect.classList.add('visually-hidden');
  catInfo.classList.add('visually-hidden');
}

function requestFinish() {
  loader.classList.add('visually-hidden');
  breedSelect.classList.remove('visually-hidden');
  catInfo.classList.remove('visually-hidden');
}

function requestWrong() {
  loader.classList.add('visually-hidden');
  breedSelect.classList.add('visually-hidden');
  catInfo.classList.add('visually-hidden');
}
