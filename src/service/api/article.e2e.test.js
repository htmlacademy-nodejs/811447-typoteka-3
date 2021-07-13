'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);
const {mockArticles, mockUsers, mockCategories} = require(`../../test-mocks`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const createAPI = async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  const app = express();
  app.use(express.json());
  article(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
});

describe(`API returns an offer with given id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Ёлки. История деревьев"`, () => expect(response.body.title).toBe(`Ёлки. История деревьев`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    userId: 1,
    picture: ``,
    categories: [1],
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи.`,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    categories: [1],
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи.`,
  };

  let app;
  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    userId: 1,
    picture: ``,
    categories: [1],
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи.`,
    createdAt: `2021-03-22 00:46:46`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/2`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/2`)
    .expect((res) => expect(res.body.title).toBe(`Как собрать камни бесконечности`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();
  const validArticle = {
    userId: 1,
    picture: ``,
    categories: [1],
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи.`,
  };

  return request(app)
    .put(`/articles/200`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const app = await createAPI();

  const invalidArticle = {
    userId: 1,
    picture: ``,
    categories: [1],
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи.`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();
  return request(app)
    .delete(`/articles/200`)
    .expect(HttpCode.NOT_FOUND);
});
