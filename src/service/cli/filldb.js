'use strict';
const fs = require(`fs`).promises;
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `generate`});
const initDatabase = require(`../lib/init-db`);
const sequelize = require(`../lib/sequelize`);
const {ExitCode} = require(`../../constants`);
const passwordUtils = require(`../lib/password`);

const {
  getRandomInt,
  shuffle
} = require(`../../utils`);

const DEFAULT_COUNT = 10;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const PICTURES = [`forest.jpg`, `sea.jpg`, `skyscraper.jpg`];

const MAX_COMMENTS = 4;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`).slice(0, -1);
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const generateComments = (count, comments, users) => (
  Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    text: shuffle(comments.slice(0, -1))
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePosts = (count, titles, categories, sentences, comments, users) => {

  return Array(count).fill({}).map(() => {
    return {
      user: users[0].email,
      picture: PICTURES[getRandomInt(0, PICTURES.length - 1)],
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
      fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length - 1)).join(` `),
      categories: shuffle(categories).slice(0, getRandomInt(1, 4)),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
    };
  });
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const users = [
      {
        firstName: `Иван`,
        lastName: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: passwordUtils.hashSync(`123456`),
        avatar: `forest.jpg`,
        isAuthor: true
      },
      {
        firstName: `Пётр`,
        lastName: `Петров`,
        email: `petrov@example.com`,
        passwordHash: passwordUtils.hashSync(`123456`),
        avatar: `sea.jpg`,
        isAuthor: false
      }
    ];
    const [count] = args;
    const countPost = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const posts = generatePosts(countPost, titles, categories, sentences, comments, users);
    return initDatabase(sequelize, {categories, articles: posts, users});
  }
};
