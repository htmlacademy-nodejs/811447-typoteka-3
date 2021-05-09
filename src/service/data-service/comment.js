'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  constructor(articles) {
    this._comments = articles.reduce((comments, article) => comments.concat(article.comments), []);
  }

  create(articleId, comment) {
    const newComment = Object.assign({...comment, id: nanoid(MAX_ID_LENGTH), articleId});

    this._comments.push(newComment);
    return newComment;
  }

  drop(id) {
    const comment = this._comments.find((item) => item.id === id);

    if (!comment) {
      return null;
    }

    this._comments = this._comments.filter((item) => item.id !== id);
    return comment;
  }

  findAll(articleId) {
    return this._comments.filter((item) => item.postId === articleId);
  }
}

module.exports = CommentService;
