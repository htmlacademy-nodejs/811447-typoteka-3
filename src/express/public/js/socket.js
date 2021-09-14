'use strict';
const SERVER_URL = `http://localhost:3000`;
const truncateText = (text) => {
  const shortText = text.length < 101 ? text : `${text.slice(0, 100)}...`;
  return shortText;
}

const createArticle = ({id, announce, comments}) => {
  return `<li class='hot__list-item'>
    <a class='hot__list-link' href='/articles/${id}'>
      ${truncateText(announce)}
      <sup class='hot__link-sup'> ${comments.length}</sup>
    </a>
  </li>`;
};

const createComment = (comment) => {
  return `<li class='last__list-item'>
    <img class='last__list-image' src='/img/${comment['user.avatar']}' width='20' height='20' alt='Аватар пользователя'>
    <b class='last__list-name'> ${comment['user.firstName']} ${comment['user.lastName']}</b>
    <a class='last__list-link' href='/articles/${comment.id}'>${truncateText(comment['comments.text'])}</a>
  </li>`;
}

(() => {
  const socket = io(SERVER_URL);
  const articleList = document.querySelector('.hot__list');
  const commentList = document.querySelector('.last__list');

  socket.addEventListener('update', ({articles, comments}) => {

    if (articleList && commentList) {
      articleList.innerHTML = articles.map(createArticle).join('');
      commentList.innerHTML = comments.map(createComment).join('');
    }
  })
})();
