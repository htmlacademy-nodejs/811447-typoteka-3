'use strict';

const {Router} = require(`express`);
const {HttpCode, COMMENTS_COUNT, ARTICLES_COUNT} = require(`../../constants`);
const {getOrderedComments, getOrderedArticles} = require(`../../utils`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExist = require(`../middlewares/article-exist`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, category} = req.query;

    let result;
    if (category && limit && offset) {
      result = await articleService.findAllByCategory({limit, offset, category});
    } else if (limit && offset) {
      result = await articleService.findPage({limit, offset});
    } else {
      result = await articleService.findAll();
    }
    res.status(HttpCode.OK).json(result);
  });

  route.get(`/comments`, async (req, res) => {
    const result = await commentService.findAll();
    res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const articleWithComments = await articleService.findOne(articleId);
    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }
    articleWithComments.comments.forEach(async (comment) => {
      await commentService.drop(comment.id);
    });

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);
    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;

    const updated = await articleService.update(articleId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }
    return res.status(HttpCode.OK).send(`Updated`);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;

    const comments = await commentService.findAll(articleId);
    res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {commentId} = req.params;
    const deleted = await commentService.drop(commentId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    const comments = await commentService.findAll();
    const articles = await articleService.findAll();
    const articlesCommented = getOrderedArticles(articles, ARTICLES_COUNT);
    const commentsOrdered = getOrderedComments(comments, COMMENTS_COUNT);

    const io = req.app.locals.socketio;
    io.emit(`update`, {articles: articlesCommented, comments: commentsOrdered});

    return res.status(HttpCode.OK).json(deleted);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(article.id, req.body);

    const comments = await commentService.findAll();
    const articles = await articleService.findAll();
    const articlesCommented = getOrderedArticles(articles, ARTICLES_COUNT);
    const commentsOrdered = getOrderedComments(comments, COMMENTS_COUNT);

    const io = req.app.locals.socketio;
    io.emit(`update`, {articles: articlesCommented, comments: commentsOrdered});

    return res.status(HttpCode.CREATED).json(comment);
  });

  route.delete(`/comments/:id`, async (req, res) => {
    const {id} = req.params;
    const comment = await commentService.drop(id);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).json(comment);
  });
};
