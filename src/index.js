import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let simpleLightBox;
const per_page = 40;

searchForm.addEventListener('submit', onSearchForm)
loadMoreBtn.addEventListener('click', onLoadMore)

function renderGallery(images) {
  if (!gallery) {
    return;
  }
  const markup = images
    .map(image => {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');
  
  gallery.insertAdjacentHTML('beforeend', markup);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onSearchForm(evt) {

  loadMoreBtn.classList.add('is-hidden');
  evt.preventDefault();

  page = 1;
  query = evt.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';
  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.',
    );
    return;
  }

  fetchImages(query, page, per_page)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        loadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onLoadMore() {

  loadMoreBtn.classList.add('is-hidden');
  page += 1;

  simpleLightBox.destroy();
  // simpleLightBox.refresh();
  fetchImages(query, page, per_page)
    .then(data => {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      const totalPages = Math.ceil(data.totalHits / per_page);
      if (page > totalPages) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
        );
      }
    })
    .catch(error => console.log(error));
}

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.pageYOffset >=
    document.documentElement.scrollHeight
  );
}

function showLoadMorePage() {
  if (checkIfEndOfPage()) {

    onLoadMore();
  }
}

window.addEventListener('scroll', showLoadMorePage)


// кнопка “вгору”->

arrowTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // після scrollTo відбудеться подія "scroll", тому стрілка автоматично сховається
};

window.addEventListener('scroll', function () {
  arrowTop.hidden = scrollY < document.documentElement.clientHeight;
});


