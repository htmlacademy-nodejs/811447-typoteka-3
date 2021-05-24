'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);
const {mockData} = require(`../../test-mocks`);

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 7 categories`, () => expect(response.body.length).toBe(7));

  test(`Category names are "IT", "Кино", "Железо", "Разное", "Музыка", "Программирование", "Деревья"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`IT`, `Кино`, `Железо`, `Разное`, `Музыка`, `Программирование`, `Деревья`])
      )
  );

});
