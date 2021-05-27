import NewsApiService from './js/apiService';
import getRefs from './js/getRefs';
import photoCardTpl from './templates/photo-card.hbs';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const refs = getRefs();

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.galleryList.addEventListener('click', onOpenBigPhoto);

function onOpenBigPhoto(e) {
  if (e.target.classList.contains('image')) {
    const instance = basicLightbox.create(`
    <img src="${e.target.dataset.img}" width="800" height="600">
`);

    instance.show();
  }
}

function onSearch(e) {
  e.preventDefault();
  const form = e.currentTarget;
  newsApiService.query = form.elements.query.value;

  if (!newsApiService.query.trim()) {
    alert('Enter your query!');
    clearPhotosList();
    refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }

  newsApiService.resetPage();

  newsApiService.fetchImagesByKeyWord().then(hits => {
    clearPhotosList();
    appendPhotosMarkUp(hits);
  });

  refs.loadMoreBtn.classList.remove('is-hidden');
}

function appendPhotosMarkUp(hits) {
  refs.galleryList.insertAdjacentHTML('beforeend', photoCardTpl(hits));
}

async function onLoadMore() {
  await newsApiService.fetchImagesByKeyWord().then(appendPhotosMarkUp);
  setTimeout(scroll, 100);
}

function scroll() {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth',
  });
}

function clearPhotosList() {
  refs.galleryList.innerHTML = '';
}
