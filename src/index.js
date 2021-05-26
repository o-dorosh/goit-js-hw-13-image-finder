import NewsApiService from './js/apiService';
import getRefs from './js/getRefs';
import photoCardTpl from './templates/photo-card.hbs';
import * as basicLightbox from 'basiclightbox';

const refs = getRefs();

refs.loadMoreBtn.disabled = true;

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  const form = e.currentTarget;
  newsApiService.query = form.elements.query.value;
  refs.loadMoreBtn.disabled = false;

  if (!newsApiService.query.trim()) {
    alert('Enter your query!');
    clearPhotosList();
    return;
  }

  newsApiService.resetPage();

  newsApiService.fetchImagesByKeyWord().then(hits => {
    clearPhotosList();
    appendPhotosMarkUp(hits);
  });
}

function appendPhotosMarkUp(hits) {
  refs.galleryList.insertAdjacentHTML('beforeend', photoCardTpl(hits));

  refs.galleryList.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function onLoadMore() {
  newsApiService.fetchImagesByKeyWord().then(appendPhotosMarkUp);
}

function clearPhotosList() {
  refs.galleryList.innerHTML = '';
}
