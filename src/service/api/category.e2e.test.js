'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const initDB = require(`../lib/init-db`);
const {HttpCode} = require(`../../constants`);
const {mockArticles, mockUsers, mockCategories} = require(`../../test-mocks`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  category(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {
  let response;
  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(3));

  test(`Category names are "IT", "Кино", "Музыка"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([{id: 1, name: `IT`}, {id: 2, name: `Кино`}, {id: 3, name: `Музыка`}])
      )
  );
});
