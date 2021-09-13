'use strict';
const SERVER_URL = `http://localhost:3000`;

(() => {

  const socket = io(SERVER_URL);
  const articleList = document.querySelector('.hot__list');
  const commentList = document.querySelector('.last__list');

  socket.addEventListener('connect', () => {
    console.log('connect');
  })

  socket.addEventListener('update', ({articles, comments}) => {

    if (articleList && commentList) {
      console.log(articles);
      console.log(comments);
    }
  })
})();
