'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);
const {mockData} = require(`../../test-mocks`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService(cloneData));
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals "2LAAKH"`, () => expect(response.body[0].id).toBe(`2LAAKH`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/2LAAKH`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Как собрать камни бесконечности"`, () => expect(response.body.title).toBe(`Как собрать камни бесконечности`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    category: [`IT`],
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи.`,
    createdDate: `2021-03-22 00:46:46`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    category: [`IT`],
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи.`,
    createdDate: `2021-03-22 00:46:46`
  };
  const app = createAPI();

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
    category: [`IT`],
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи.`,
    createdDate: `2021-03-22 00:46:46`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/2LAAKH`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () => expect(response.text).toEqual(`Updated`));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/2LAAKH`)
    .expect((res) => expect(res.body.title).toBe(`Как собрать камни бесконечности`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();
  const validArticle = {
    category: [`IT`],
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи.`,
    createdDate: `2021-03-22 00:46:46`
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    category: [`IT`],
    title: `Как собрать камни бесконечности`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Освоить вёрстку несложно. Возьмите новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи.`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;
  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/2LAAKH`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`2LAAKH`));
  test(`Offer count is 5 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();
  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
